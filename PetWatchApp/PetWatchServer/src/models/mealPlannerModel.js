const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mealPlannerSchema = new Schema({
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    food: {
        type: String,
        required: true
    },
    amount: {
        type: String,
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

const MealPlanner = mongoose.model('MealPlanner', mealPlannerSchema);

module.exports = { MealPlanner, mealPlannerSchema};
