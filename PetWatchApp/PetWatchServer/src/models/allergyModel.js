const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AllergySchema = new Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
    },
    name: { 
        type: String, 
        required: true 
    },
    note: {
        type: String
    },
    treatment: {
        type: String,
        required: true
    },
    date: { 
        type: Date, 
        required: true 
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});


const Allergy = mongoose.model('Allergy', AllergySchema);

module.exports = { Allergy, AllergySchema};

