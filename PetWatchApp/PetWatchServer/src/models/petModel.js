const mongoose = require('mongoose');
const { PetGender } = require('../utils/enums');


const Schema = mongoose.Schema;


const petSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: Object.values(PetGender), 
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    chipNumber: {
        type: String,
    },
    additionalImages: [{
        type: String,
    }],
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category',
    //     required: true
    // },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


const Pet = mongoose.model('Pet', petSchema);

module.exports = { Pet, petSchema};




