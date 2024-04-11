const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MedicationSchema = new Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
    },
    name: { 
        type: String, 
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    note: {
        type: String
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


const Medication = mongoose.model('Medication', MedicationSchema);

module.exports = { Medication, MedicationSchema};

