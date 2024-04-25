require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendResetCodeEmail, sendContactEmail} = require('../services/mailService');
const {User} = require('../models/userModel');
const {ContactUs} = require('../models/contactUsModel');
const { ActivityLog } = require('../models/activityLogModel');
const { validatePhone, validateEmail, validatePassword } = require('../validators/userValidators');

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
  console.log('userWithPetsAndExpenses: ', userWithPetsAndExpenses);

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
    const userWithUpcomingEvents = await User.findById(userId).populate({
      path: 'pets',
      populate: [
          { path: 'vaccinationRecords', 
          match: { nextDate: { $gte: new Date() } },  
           populate: {path: 'pet',select: 'name'} },
          { path: 'routineCareRecords', 
          match: { nextDate: { $gte: new Date() } },
          populate: {path: 'pet', select: 'name'} },
          { path: 'vetVisits', 
          match: { nextDate: { $gte: new Date() } },
          populate: {path: 'pet', select: 'name'} }
      ]
    });
    console.log('userWithUpcomingEvents: ', userWithUpcomingEvents);
    const upcomingEvents = [];

    userWithUpcomingEvents.pets.forEach(pet => {
      pet.vaccinationRecords.forEach(vaccineRecord => {
          upcomingEvents.push({
              ...vaccineRecord.toObject(),
              actionType: 'Vaccine',
              details: `Vaccine Type: ${vaccineRecord.vaccineType}`
          });
      });

      pet.routineCareRecords.forEach(routineCareRecord => {
          upcomingEvents.push({
              ...routineCareRecord.toObject(),
              actionType: 'Routine Care',
              details: `Routine Care Type: ${routineCareRecord.activity}`
          });
      });

      pet.vetVisits.forEach(visit => {
        upcomingEvents.push({
            ...visit.toObject(),
            actionType: 'Vet Visit',
            details: `The Reason: ${visit.reason}`
        });
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
        return res.status(400).json({ error: error.message });
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
    updateUserById,
    updateUserAccountSettings,
    changePassword,
    requestPasswordReset,
    resetPasswordCode,
    resetPassword,
    ContactUsMessage
};