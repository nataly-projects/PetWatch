const mongoose = require('mongoose');
const {ActivityLogType, ActivityType} = require('../utils/enums');

const Schema = mongoose.Schema;

const activityLogSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    type: {
        type: String,
        enum: Object.values(ActivityType),
    },
    actionType: {
        type: String,
        enum: Object.values(ActivityLogType),
        required: true
    },
    details: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = { ActivityLog, activityLogSchema};
