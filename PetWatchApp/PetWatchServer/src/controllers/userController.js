require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {User} = require('../models/userModel');
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
        res.json({ message: 'User signed up successfully', user: newUser });
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
    allUserExpenses: allExpenses,
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
    getUserNotes
};