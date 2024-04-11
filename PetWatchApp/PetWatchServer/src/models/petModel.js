const mongoose = require('mongoose');
const { PetSpecies } = require('../utils/enums');
const VaccinationRecord = require('./vaccinationRecordModel');
const RoutineCareRecord = require('./routineCareRecordModel');
const Note = require('./noteModel');
const Expense = require('./expenseModel');
const Medication = require('./medicationModel');
const Allergy = require('./allergyModel');

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
    birthday: {
        type: Date,
    },
    image: {
        type: String,
        // required: true //TODO - need to make it requires
    },
    chipNumber: {
        type: String,
    },
    chipNumber: {
        type: String,
    },
    medications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
    }],
    allergies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Allergy',
    }],
    vetVisits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VetVisit',
    }],
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




