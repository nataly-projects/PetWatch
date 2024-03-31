const bcrypt = require('bcrypt');

const {User} = require('../models/userModel');
const { validatePhone, validateEmail } = require('../validators/userValidators');

async function getUserById(req, res) {
    const {userId} = req.params;
    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(200).json({user});
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: error.message });
    }
}

async function register (req, res) {
    try {
      console.log(req.body);
        const { fullName, email, phone, password } = req.body;

        // check if the email is already registered
        const existingUser = await User.findOne({ email });
    
        if (existingUser) {
          return res.status(400).json({ error: 'Email is already registered' });
        }

        // validate email and phone
        validateEmail(email);
        validatePhone(phone);
    
        // hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const newUser = new User({
          fullName,
          email,
          phone,
          password: hashedPassword,
        });

         const savedUser = await newUser.save();
         return res.json({ message: 'User signed up successfully', user: savedUser });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    } 
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
          return res.status(401).json({ error: 'No user found with that email' });
        }

        // check if the provided password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Incorrect password' });
        }
        res.status(200).json({ message: 'Signin successful', user });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });    
      }
}

module.exports = {
    register,
    login,
    getUserById,
};