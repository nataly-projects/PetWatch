require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {User} = require('../models/userModel');
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

// function genreateSecretKey () {
//   const secretKey = crypto.randomBytes(32).toString('hex');
//   // Write the secret key to the .env file
//   fs.writeFileSync('.env', `SECRET_KEY=${secretKey}`);
// }

module.exports = {
    register,
    login,
    getUserById,
};