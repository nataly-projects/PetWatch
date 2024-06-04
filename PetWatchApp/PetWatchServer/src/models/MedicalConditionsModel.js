const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const medicalConditionSchema = new Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    continuedTreatment: {
        type: String
    },
    dateDiagnosed: {
        type: Date,
        required: true
    },
    note: {
        type: String
    },
    updatedDate: { 
        type: Date, 
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const MedicalCondition = mongoose.model('MedicalCondition', medicalConditionSchema);
module.exports = {MedicalCondition, medicalConditionSchema};
