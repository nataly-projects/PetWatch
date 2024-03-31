const mongoose = require('mongoose');
const { validatePhone, validateEmail } = require('../validators/userValidators');


const Schema = mongoose.Schema;


const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true ,
        validate: {
            validator: validateEmail,
            message: 'Invalid email address'
        }

    },
    phone: {
        type: String,
        required: true,
        validate: {
            validator: validatePhone,
            message: 'Invalid phone number'
        }
    },
    password: {
        type: String,
        required: true
    },
    // imageUrl: {
    //     type: String,
    //     default: null
    // },
    // passVerificationCode: {
    //    type: String 
    // },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

// method that remove sensitive information from the schema
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    // remove the password field from the object
    delete userObject.password;
    return userObject;
  };

const User = mongoose.model('User', userSchema);

module.exports = { User, userSchema };


