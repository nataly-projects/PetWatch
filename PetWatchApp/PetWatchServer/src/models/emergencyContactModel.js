const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emergencyContactsSchema = new Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    relationship: {
        type: String,
        required: true
    },
    updatedDate: { 
        type: Date, 
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactsSchema);

module.exports = { EmergencyContact, emergencyContactsSchema};
