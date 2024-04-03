const mongoose = require('mongoose');
const { PetSpecies } = require('../utils/enums');


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
    species: {
        type: String,
        enum: Object.values(PetSpecies), 
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
        // required: true //TODO - need to make it requires
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
        ref: 'User',
        required: true
    },
    vaccinationRecords: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'VaccinationRecord' 
    }],
    routineCareRecords: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'RoutineCareRecord' 
    }],
    notes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Note' 
    }],
    expenses: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Expense' 
    }],
    created_at: {
        type: Date,
        default: Date.now()
    }
});


const Pet = mongoose.model('Pet', petSchema);

module.exports = { Pet, petSchema};




