import React, { useState } from 'react';
import '../styles/AddActivity.css';

const ExpenseActivity = ({ onSave, expenseCategory }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!date) {
            validationErrors.date = 'Date is required';
        }
        if (!amount) {
            validationErrors.amount = 'Amount is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave({ 
                category: expenseCategory.value, 
                amount, 
                note: note ? note : null,
                date 
            });
        }
    };

    return (
        <div className='container'>
            <h3>Add record for expense Type: {expenseCategory.value}</h3>        

            <div className='input-container'>
                <label className='label'>Amount: </label>
                <input className='input-field'
                type="number" 
                value={amount} onChange={(e) => setAmount(e.target.value)} 
                placeholder="Amount" 
                required
                />
            {errors.amount && <div className="error-message">{errors.amount}</div>} 
            </div>
           
            
            <div className='input-container'>
                <label className='label'>Date: </label>
                <input className='input-field'
                type="datetime-local" 
                id="appointmentDateTime" 
                name="appointmentDateTime" 
                onChange={(event) => setDate(event.target.value)} 
                value={date} 
                required
                />      
            {errors.date && <div className="error-message">{errors.date}</div>} 
            </div>

            <textarea className='textarea-field'
            type="text" 
            value={note} onChange={(e) => setNote(e.target.value)} 
            placeholder="You can add note" />

            <button className='btn' onClick={handleSave}>Save</button>
        </div>
    );
};

export default ExpenseActivity;
