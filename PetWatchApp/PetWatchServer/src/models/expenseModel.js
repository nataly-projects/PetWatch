const mongoose = require('mongoose');
const {ExpenseCategory} = require('../utils/enums');

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
    pet: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Pet', 
    },
    category: { 
        type: String, 
        enum: Object.values(ExpenseCategory),
        required: true 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    note: {
        type: String
    },
    date: { 
        type: Date, 
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


const Expense = mongoose.model('Expense', ExpenseSchema);

module.exports = { Expense, ExpenseSchema};

