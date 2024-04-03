const mongoose = require('mongoose');
const {VaccineRecordType} = require('../utils/enums').default;

const Schema = mongoose.Schema;


const VaccinationRecordSchema  = new Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
        required: true 
    },
    vaccineType: { 
        type: String, 
        enum: Object.values(VaccineRecordType),
        required: true 
    },
    note: {
        type: String
    },
    date: { 
        type: Date, 
        required: true 
    },
    nextDate: {
        type: Date,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


const VaccinationRecord = mongoose.model('VaccinationRecord', VaccinationRecordSchema);

module.exports = { VaccinationRecord, VaccinationRecordSchema};




