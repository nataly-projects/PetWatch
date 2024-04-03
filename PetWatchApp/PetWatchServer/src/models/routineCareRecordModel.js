const mongoose = require('mongoose');
const {RoutineCareActivity} = require('../utils/enums').default;


const Schema = mongoose.Schema;


const RoutineCareRecordSchema  = new Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
        required: true 
    },
    activity: { 
        type: String, 
        enum: Object.values(RoutineCareActivity),
        required: true 
    },
    note: {
        type: String
    },
    cost: {
        type: Number
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


const RoutineCareRecord = mongoose.model('RoutineCareRecord', RoutineCareRecordSchema);

module.exports = { RoutineCareRecord, RoutineCareRecordSchema};




