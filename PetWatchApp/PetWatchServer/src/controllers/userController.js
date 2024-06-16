require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendResetCodeEmail, sendContactEmail} = require('../services/mailService');
const {User} = require('../models/userModel');
const {ContactUs} = require('../models/contactUsModel');
const { ActivityLog } = require('../models/activityLogModel');
const { validatePhone, validateEmail, validatePassword } = require('../validators/userValidators');
const { RoutineCareRecord } = require('../models/routineCareRecordModel');
const { VaccinationRecord } = require('../models/vaccinationRecordModel');
const { VetVisit } = require('../models/vetVisitModel');
const { Task } = require('../models/taskModel');
const  {ActivityLogType, ActivityType } = require('../utils/enums');


async function getUserById(req, res) {
    const {userId} = req.params;
    try {
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

async function register (req, res) {
    try {
      const { fullName, email, phone, password } = req.body;

      // check if the email is already registered
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already registered' });
      }

      // validate email and phone
      validateEmail(email);
      validatePhone(phone);
      //TODO - need to change the validatePassword function
      validatePassword(password);
      // hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = new User({
        fullName,
        email,
        phone,
        password: hashedPassword,
      });

        await newUser.save();
        res.status(200).json({ message: 'User signed up successfully', user: newUser });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    } 
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(404).json({ error: 'No user found with that email' });
        }
        // check if the provided password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Incorrect  password' });
        }
        // If the password is correct, generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '100y' });

        res.status(200).json({ message: 'Login successful', user, token });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
}

async function getUserActivityLog(req, res) {
  try {
    const { userId } = req.params;

      const activityLogs = await ActivityLog.find({ userId }).sort({ created_at: -1 })
      .populate('petId', 'name').exec();
      res.status(200).json(activityLogs);

  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserExpensesArrays (req, res) {
  try {
    const { userId } = req.params;
    const userWithPetsAndExpenses = await User.findById(userId)
    .populate({
      path: 'pets',
      populate: {
        path: 'expenses',
        populate: {
          path: 'pet',
          select: 'name'
        }
      }
    });

  const allExpenses = userWithPetsAndExpenses.pets.reduce((accumulatedExpenses, pet) => {
    return accumulatedExpenses.concat(pet.expenses);
  }, []);

  const petExpensesData = userWithPetsAndExpenses.pets.map(pet => ({
    petName: pet.name,
    totalExpenses: pet.expenses.reduce((total, expense) => total + expense.amount, 0)
  }));

  const monthlyExpensesData = {}; 
  const categoryExpensesData = {}; 

  userWithPetsAndExpenses.pets.forEach(pet => {
    pet.expenses.forEach(expense => {
      const month = new Date(expense.date).getMonth()+1; // Get month index (0-11)
      const category = expense.category;

      // Update monthly expenses data
      monthlyExpensesData[month] = (monthlyExpensesData[month] || 0) + expense.amount;

      // Update category expenses data
      categoryExpensesData[category] = (categoryExpensesData[category] || 0) + expense.amount;
    });
  });

   // Convert monthly expenses data to array of objects
   const monthlyExpensesChartData = Object.entries(monthlyExpensesData).map(([monthIndex, amount]) => ({
    month: monthIndex, // Month index
    amount: amount // Total expenses for the month
  }));

  // Convert category expenses data to array of objects
  const categoryExpensesChartData = Object.entries(categoryExpensesData).map(([category, amount]) => ({
    category: category,
    amount: amount
  }));

  res.status(200).json({
    allExpenses: allExpenses,
    petExpensesData: petExpensesData,
    monthlyExpensesChartData: monthlyExpensesChartData,
    categoryExpensesChartData: categoryExpensesChartData});

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserUpcomingEvents (req, res) {
  try {
    const { userId } = req.params;
  
    const user = await User.findById(userId);
    const petIds = user.pets;
    const vetVisits = await VetVisit.find({
      $or: [
        { date: { $gte: new Date() } }
      ],
      pet: { $in: petIds }
    }).populate('pet');
    const routineCare = await RoutineCareRecord.find({
      $or: [
        { nextDate: { $gte: new Date() } }
      ],
        pet: { $in: petIds }
    }).populate('pet');
    const vaccinationRecords = await VaccinationRecord.find({
        $or: [
            { nextDate: { $gte: new Date() } }
        ],
        pet: { $in: petIds }
    }).populate('pet');

    const upcomingEvents = [];

      vaccinationRecords.forEach(vaccineRecord => {
          upcomingEvents.push({
              ...vaccineRecord.toObject(),
              petId: vaccineRecord.pet,
              actionType: 'Vaccine Record',
              details: `Vaccine Type: ${vaccineRecord.vaccineType}`
          });
      });

      routineCare.forEach(routineCareRecord => {
          upcomingEvents.push({
              ...routineCareRecord.toObject(),
              petId: routineCareRecord.pet,
              actionType: 'Routine Care',
              details: `Routine Care Type: ${routineCareRecord.activity}`
          });
      });

      vetVisits.forEach(visit => {
        upcomingEvents.push({
            ...visit.toObject(),
            nextDate: visit.date,
            petId: visit.pet,
            actionType: 'Vet Visit',
            details: `The Reason: ${visit.reason}`
        });
    });

    // Sort the combined events by nextDate
    upcomingEvents.sort((a, b) => a.nextDate - b.nextDate);
    res.status(200).json(upcomingEvents);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserNotes (req, res) {
  try {
    console.log('getUserNotes');
    const { userId } = req.params;
    const userWithNotes = await User.findById(userId).populate({
      path: 'pets',
      populate: [
          { path: 'notes',  
           populate: {path: 'pet',select: 'name'} },
      ]
    });
    console.log('userWithNotes: ', userWithNotes);
    const notes = [];

    userWithNotes.pets.map(pet => {
      notes.push(...pet.notes);
    });

      
    res.status(200).json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserAccountSettings (req, res) {
  try {
    console.log('getUserAccountSettings');
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }

    // Extract and return account settings
    const accountSettings = {
      notificationPreferences: user.notificationPreferences,
      theme: user.theme,
      currency: user.currency
    };

  res.status(200).json( {message: 'User account settings update successfully', accountSettings});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateUserById(req, res) {
  console.log('updateUserById: ', req.body);
    const {userId} = req.params; 
    const { userData } = req.body;
    // let imagePath = null;
    // if (req.file && req.file.path) {
    //   imagePath = req.file.path;
    // }

    try {
        // check if the user exists
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (userData.email && userData.email != user.email) {

            isValid = validateEmail(userData.email);
            if (isValid) {
              // check if the email is already registered
              const existingUser = await User.findOne({ email });
                
              if (existingUser) {
                return res.status(400).json({ error: 'Email is already registered' });
              }
              user.email = userData.email;
            }
            return res.status(400).json({ error: 'Email is not valid' });
        }
        if (userData.phone && userData.phone != user.phone) {
            isValid = validatePhone(userData.phone);
            if (isValid) {
              user.phone = userData.phone;
            }
          return res.status(400).json({ error: 'Phone is not valid' });

        }
        if (userData.fullName && userData.fullName != user.fullName) {
            user.fullName = userData.fullName;
        }
        // if (imagePath && user.imageUrl != imagePath) {
        //   user.imageUrl = imagePath;
        // }

        const updatedUser = await user.save();
        return res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}

async function updateUserAccountSettings (req, res) {
  try {
    const { userId } = req.params;
    const {updateSettings} = req.body;
    console.log('updateSettings: ', updateSettings)
    const user = await User.findById(userId);
    if (!user) {
      return { error: 'User not found' };
    }

    // Update user account settings
    if (updateSettings.notificationPreferences) {
      user.notificationPreferences = updateSettings.notificationPreferences;
    }
    if (updateSettings.theme) {
        user.theme = updateSettings.theme;
    }
    if (updateSettings.currency) {
        user.currency = updateSettings.currency;
    }
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function changePassword (req, res) {
  console.log('changePassword: ', req.body);
  const {changePasswordData} = req.body;
  // const { email, oldPassword, newPassword } = req.body;
  console.log('resetPassword: ', req.body);
    try {
      // find the user by email 
      const user = await User.findOne({email: changePasswordData.email});

      if (!user) {
        return res.status(401).json({ error: 'No user found with that email' });
      }

      // check if the provided password matches the stored hashed password
      const passwordMatch = await bcrypt.compare(changePasswordData.oldPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      // hash and update the user password in the db
      const hashedNewPassword = await bcrypt.hash(changePasswordData.newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
      return res.status(200).json({ message: 'Password change successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
}

async function requestPasswordReset(req, res) {
  const { email } = req.body;
  try {
    // check if the email exists in the db
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'No user with the provided email was found' });
    }

    // generate a verification code and store it in the user document
    const verificationCode = generateVerificationCode();
    user.resetCode = verificationCode;
    await user.save();

    // send the verification code to the user's email (use nodemailer)
    await sendResetCodeEmail(user.email, verificationCode, user.fullName);

    return res.status(200).json({ message: 'Verification code sent successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function ContactUsMessage(req, res) {
  const { messageData } = req.body;
    try {
      if (messageData.email) {
        validateEmail(messageData.email);
      }
  
      const newMessage = new ContactUs({
        userId: messageData.userId,
        fullName: messageData.name,
        email: messageData.email,
        message: messageData.message,
      });
  
      await newMessage.save();

      // send an email to the company
      await sendContactEmail(messageData);
      return res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

function generateVerificationCode() {
  const codeLength = 6; 
  const min = Math.pow(10, codeLength - 1);
  const max = Math.pow(10, codeLength) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function resetPasswordCode(req, res) {
  const { email, code } = req.body;
console.log('resetPasswordCode: ', code, email);
  try {
    // get the user (already check if the email exists in the start of the reset password proccess)
    const user = await User.findOne({ email });

    // check if the code match
    if (user.resetCode === code) {
      // code is correct, remove the passwordResetCode from the user document
      user.resetCode = null;
      await user.save();
      return res.status(200).json({ message: 'Code is correct' });
    } else {
      return res.status(401).json({ error: 'Sorry, that\'s not the right code. Please try again' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function resetPassword(req, res) {
  const { email, newPassword } = req.body;
console.log('resetPassword: ', email, newPassword);
  try {
    // find the user by email 
    const user = await User.findOne({ email});

    // hash and update the user password in the db
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserPetsActivitiesForMonth(req, res) {
  try {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const petIds = user.pets;

    // Fetch activities for each table
    const vetVisits = await VetVisit.find({
      $or: [
        { date: { $gte: new Date(year, month-1, 1), $lt: new Date(year, month, 1) } },
        { nextDate: { $gte: new Date(year, month-1, 1), $lt: new Date(year, month, 1) } }
      ],
      pet: { $in: petIds }
    }).populate('pet');
    const routineCare = await RoutineCareRecord.find({
      $or: [
        { date: { $gte: new Date(year, month-1, 1), $lt: new Date(year, month, 1) } },
        { nextDate: { $gte: new Date(year, month-1, 1), $lt: new Date(year, month, 1) } }
      ],
        pet: { $in: petIds }
    }).populate('pet');
    const vaccinationRecords = await VaccinationRecord.find({
        $or: [
            { date: { $gte: new Date(year, month-1, 1), $lt: new Date(year, month, 1) } },
            { nextDate: { $gte: new Date(year, month-1, 1), $lt: new Date(year, month, 1) } }
        ],
        pet: { $in: petIds }
    }).populate('pet');

    // Combine activities from all tables
    const activities = [...vetVisits, ...routineCare, ...vaccinationRecords];
    res.status(200).json(activities);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserTasks(req, res) {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('tasks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('tasks: ', user.tasks);
    res.status(200).json(user.tasks);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


async function addUserTask(req, res) {
  const { userId } = req.params;
  const {newTask} = req.body;
  console.log('newTask: ', newTask);
  try {
    const task = new Task({...newTask});
     await task.save();
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { tasks: task._id } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Log the activity
    const activityLog = new ActivityLog({
        userId: userId, 
        type: ActivityType.TASK,
        actionType: ActivityLogType.TASK_ADDED,
        details: task.title
    });
    await activityLog.save();

    res.status(201).json({ message: 'Task added successfully',  task});

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateUserTask(req, res) {
  const { userId, taskId } = req.params;
  const {updateTask} = req.body;
  console.log('updateTask: ', updateTask);
  try {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { ...updateTask },
      { new: true }
    );    

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // task.title = updateTask.title;
    // task.description = updateTask.description;
    // task.completed = updateTask.completed;
    // task.dueDate = updateTask.dueDate;
    // await task.save();

    // Log the activity
    const activityLog = new ActivityLog({
      userId: userId, 
      type: ActivityType.TASK,
      actionType: ActivityLogType.TASK_EDIT,
      details: task.title
    });
    await activityLog.save();

    res.status(200).json({ message: 'Task updated successfully', task });
  
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function deleteUserTask(req, res) {
  const { userId, taskId } = req.params;
  try {
  
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// function genreateSecretKey () {
//   const secretKey = crypto.randomBytes(32).toString('hex');
//   // Write the secret key to the .env file
//   fs.writeFileSync('.env', `SECRET_KEY=${secretKey}`);
// }

module.exports = {
    register,
    login,
    getUserById,
    getUserActivityLog,
    getUserExpensesArrays,
    getUserUpcomingEvents,
    getUserNotes,
    getUserAccountSettings,
    getUserPetsActivitiesForMonth,
    getUserTasks,
    addUserTask,
    updateUserById,
    updateUserAccountSettings,
    updateUserTask,
    deleteUserTask,
    changePassword,
    requestPasswordReset,
    resetPasswordCode,
    resetPassword,
    ContactUsMessage
};

/**
 * @swagger
 * paths:
 *   /users/{userId}:
 *     get:
 *       summary: Get user by ID
 *       tags:
 *        - User
 *       description: Retrieve a user by their ID.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: ID of the user to retrieve
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Successfully retrieved the user
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: User not found.
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 *     put:
 *       summary: Update user by ID
 *       tags:
 *        - User
 *       parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          schema:
 *            type: string
 *          description: ID of the user to update
 *        - in: body
 *          name: userData
 *          required: true
 *          schema:
 *            $ref: '#/components/schemas/User'
 *       responses:
 *        200:
 *          description: User updated successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        404:
 *          description: User not found
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
  *       500:
 *          description: Internal server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  error:
 *                    type: string
 *                    example: Internal server error.
 * 
 *   /users/register:
 *     post:
 *       summary: Register a new user
 *       tags:
 *        - User
 *       description: Register a new user with the provided information.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fullName:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - fullName
 *                 - email
 *                 - phone
 *                 - password
 *       responses:
 *         200:
 *           description: User registered successfully
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User signed up successfully
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *         400:
 *           description: Bad request
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Email is already registered.
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 * 
 *   /users/login:
 *     post:
 *       summary: Login
 *       tags:
 *        - User
 *       description: Login with email and password.
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *               required:
 *                 - email
 *                 - password
 *       responses:
 *         200:
 *           description: Login successful
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: Login successful
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *                   token:
 *                     type: string
 *                     example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         401:
 *           description: Unauthorized
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Incorrect password
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: No user found with that email
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 * 
 *   /users/activity/{userId}/:
 *     get:
 *       summary: Get user activity log
 *       tags:
 *        - User
 *       description: Retrieve activity log for a user by their ID.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: ID of the user to retrieve activity log for
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Successfully retrieved the user activity log
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ActivityLog'
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: User not found.
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 * 
 *   /users/expenses/{userId}:
 *     get:
 *       summary: Get user expenses
 *       tags:
 *        - User
 *       description: Retrieve expenses for a user by their ID.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: ID of the user to retrieve expenses for
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Successfully retrieved the user expenses
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   allExpenses:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Expense'
 *                   petExpensesData:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         petName:
 *                           type: string
 *                         totalExpenses:
 *                           type: number
 *                   monthlyExpensesChartData:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         month:
 *                           type: number
 *                         amount:
 *                           type: number
 *                   categoryExpensesChartData:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         category:
 *                           type: string
 *                         amount:
 *                           type: number
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: User not found.
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 * 
 *   /users/upcoming/{userId}:
 *     get:
 *       summary: Get user upcoming events
 *       tags:
 *        - User
 *       description: Retrieve upcoming events for a user by their ID.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: ID of the user to retrieve upcoming events for
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Successfully retrieved the user upcoming events
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nextDate:
 *                     type: string
 *                     format: date-time
 *                     description: The date of the upcoming event
 *                   actionType:
 *                     type: string
 *                     description: The type of action for the event (Vaccine, Routine Care, Vet Visit, etc.)
 *                   details:
 *                     type: string
 *                     description: Additional details about the event
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: User not found.
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 * 
 *   /users/notes/{userId}:
 *     get:
 *       summary: Get user notes
 *       tags:
 *        - User
 *       description: Retrieve notes for a user by their ID.
 *       parameters:
 *         - in: path
 *           name: userId
 *           required: true
 *           description: ID of the user to retrieve notes for
 *           schema:
 *             type: string
 *       responses:
 *         200:
 *           description: Successfully retrieved the user notes
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Note'
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: User not found.
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 * 
 *   /users/settings/{userId}:
 *     get:
 *       summary: Get user account settings
 *       tags:
 *        - User
 *       description: Retrieve account settings for a user by their ID.
 *       parameters:
 *        - in: path
 *          name: userId
 *          required: true
 *          description: ID of the user to retrieve account settings for
 *          schema:
 *            type: string
 *       responses:
 *         200:
 *           description: Successfully retrieved the user account settings
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   message:
 *                     type: string
 *                     example: User account settings retrieved successfully
 *                   accountSettings:
 *                     type: object
 *                     properties:
 *                       notificationPreferences:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: boolean
 *                             example: true
 *                           sms:
 *                             type: boolean
 *                             example: true
 *                       theme:
 *                         type: string
 *                         example: dark
 *                       currency:
 *                         type: string
 *                         example: USD
 *         404:
 *           description: User not found
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: User not found.
 *         500:
 *           description: Internal server error
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 *     put:
 *       summary: "Update user account settings"
 *       tags:
 *         - "User"
 *       parameters:
 *        - in: "path"
 *          name: "userId"
 *          required: true
 *          description: "ID of the user to update settings"
 *          type: "string"
 *        - in: "body"
 *          name: "updateSettings"
 *          required: true
 *          description: "New user account settings"
 *          schema:
 *            $ref: "#/components/schemas/User"
 *       responses:
 *         200:
 *           description: "User account settings updated successfully"
 *           schema:
 *             type: object
 *             properties:
 *                message:
 *                   type: string
 *                   example: User account settings updated successfully
 *         404:
 *           description: "User not found"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: User not found.
 *         500:
 *           description: "Internal server error"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   error:
 *                     type: string
 *                     example: Internal server error.
 * 
 *
*   /users/change-password:
*     put:
*       summary: "Change user password"
*       tags:
*         - "User"
*       parameters:
*        - in: "path"
*          name: "userId"
*          required: true
*          description: "ID of the user to change password"
*          type: "string"
*        - in: "body"
*          name: "changePasswordData"
*          required: true
*          description: "New and old passwords"
*          schema:
*            $ref: "#/components/schemas/User"
*       responses:
*         200:
*           description: "User password updated successfully"
*           schema:
*             type: object
*             properties:
*                message:
*                   type: string
*                   example: User password updated successfully
*         401:
*           description: "Unauthorized: Incorrect password or user not found"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: "Unauthorized: Incorrect password or user not found"
*         404:
*           description: "User not found"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: User not found.
*         500:
*           description: "Internal server error"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error.
*
*   /users/reset-password-request:
*     post:
*       summary: "Request password reset"
*       tags:
*         - "User"
*       parameters:
*         - in: "path"
*           name: "userId"
*           required: true
*           description: "ID of the user requesting password reset"
*           type: "string"
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 email:
*                   type: string
*       responses:
*         200:
*           description: "Verification code sent successfully"
*           schema:
*             type: object
*             properties:
*               message:
*                 type: string
*                 example: Verification code sent successfully
*         404:
*           description: "No user with the provided email was found"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: No user with the provided email was found
*         500:
*           description: "Internal server error"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error
*  
*   /users/reset-password-code:
*     post:
*       summary: "Reset Password Code"
*       tags:
*         - "User"
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 email:
*                   type: string
*                 code:
*                   type: string
*       responses:
*         200:
*           description: "Code is correct"
*           schema:
*             type: object
*             properties:
*               message:
*                 type: string
*                 example: Code is correct
*         401:
*           description: "Unauthorized: Incorrect code"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Sorry, that's not the right code. Please try again
*         500:
*           description: "Internal server error"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error
* 
*   /users/reset-password:
*     post:
*       summary: "Reset Password"
*       tags:
*         - "User"
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 email:
*                   type: string
*                 newPassword:
*                   type: string
*       responses:
*         200:
*           description: "Password reset successful"
*           schema:
*             type: object
*             properties:
*               message:
*                 type: string
*                 example: Password reset successful
*         500:
*           description: "Internal server error"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error
* 
*   /users/contact:
*     post:
*       summary: "Contact Us Message"
*       tags:
*         - "User"
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 messageData:
*                   type: object
*                   properties:
*                     userId:
*                       type: string
*                     name:
*                       type: string
*                     email:
*                       type: string
*                     message:
*                       type: string
*       responses:
*         201:
*           description: "Message sent successfully"
*           schema:
*             type: object
*             properties:
*               message:
*                 type: string
*                 example: Message sent successfully
*         500:
*           description: "Internal server error"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error
*
*   /users/calendar-activities/{userId}/{year}/{month}:
*     get:
*       summary: "Get user's pets activities for a specific month"
*       tags:
*         - "User"
*       parameters:
*         - in: "path"
*           name: "userId"
*           required: true
*           description: "ID of the user to get activities"
*           type: "string"
*         - in: "path"
*           name: "year"
*           required: true
*           description: "Year for the activities"
*           type: "integer"
*         - in: "path"
*           name: "month"
*           required: true
*           description: "Month for the activities"
*           type: "integer"
*       responses:
*         200:
*           description: "User's pets activities retrieved successfully"
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   $ref: "#/components/schemas/Activity"
*         404:
*           description: "User not found"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: User not found
*         500:
*           description: "Internal server error"
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   error:
*                     type: string
*                     example: Internal server error
* 
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         fullName:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         password:
 *           type: string
 *         pets:
 *           type: array
 *           items:
 *             type: string
 *         totalExpenses:
 *           type: number
 *         notificationPreferences:
 *           type: object
 *           properties:
 *             email:
 *               type: boolean
 *             vaccineTime:
 *               type: boolean
 *             routineCareTime:
 *               type: boolean
 *         theme:
 *           type: string
 *         currency:
 *           type: string
 *         imageUrl:
 *           type: string
 *         resetCode:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     Note:
 *       type: object
 *       properties:
 *         pet:
 *           type: string
 *         createdDate:
 *           type: string
 *           format: date-time
 *         updatedDate:
 *           type: string
 *           format: date-time
 *         title:
 *           type: string
 *         content:
 *           type: string
 *
 *     ActivityLog:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *         petId:
 *           type: string
 *         actionType:
 *           type: string
 *           enum:
 *             - vaccine record added
 *             - routine care added
 *             - expense added
 *             - allergy added
 *             - medication added
 *             - vet visit added
 *             - note added
 *             - pet added
 *             - pet edit
 *             - pet weight update
 *             - pet delete
 *             - note edit
 *             - note delete
 *             - profile edit
 *         details:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *
 *     Expense:
 *       type: object
 *       properties:
 *         pet:
 *           type: string
 *         category:
 *           type: string
 *           enum:
 *             - Food
 *             - Medication
 *             - vaccinations
 *             - VetVisit
 *             - Insurance
 *             - Routine Care
 *             - Toyes
 *             - Related Products
 *             - Home Products
 *             - Training
 *             - Other
 *         amount:
 *           type: number
 *         note:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         created_at:
 *           type: string
 *           format: date-time
 */