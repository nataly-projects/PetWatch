const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VetVisitSchema = new Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
    },
    reason: { 
        type: String, 
        required: true
    },
    note: {
        type: String
    },
    examination: {
        type: String
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


const VetVisit = mongoose.model('VetVisit', VetVisitSchema);

module.exports = { VetVisit, VetVisitSchema};

