import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { formatDateForInput } from '../utils/utils';
import '../styles/AddActivity.css';

const MealPlannerActivity = ({ onSave, onClose, mealToEdit  }) => {
    const [date, setDate] = useState('');
    const [food, setFood] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (mealToEdit) {
            setDate(formatDateForInput(mealToEdit.date));
            setFood(mealToEdit.food);
            setAmount(mealToEdit.amount);
            setNote(mealToEdit.note);
        }
    }, [mealToEdit]);

    const validateInputs = () => {
        const validationErrors = {};
        if (!date) {
            validationErrors.date = 'Meal Date is required';
        }
        if (!food) {
            validationErrors.food = 'Meal Food is required';
        }
        if (!amount) {
            validationErrors.amount = 'Meal Amount is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            const updatedMeal = 
            mealToEdit 
            ? { ...mealToEdit, date, food, amount, note } 
            : { date, food, amount, note };
            onSave(updatedMeal);
        } 
    };

    return (
        <div className='container'>
            <div className='header'>
                <h3>{mealToEdit ? 'Edit the meal' : 'Add new meal planner'}</h3> 
                <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
            </div>
            
            <div className='input-container'>
                <label className='label'>Date: </label>
                <input className='input-field'
                type="datetime-local" 
                value={date} onChange={(e) => setDate(e.target.value)} 
                required
                />
            {errors.date && <div className="error-message">{errors.date}</div>} 
            </div>

            <div className='input-container'>
                <label className='label'>Food: </label>
                <input className='input-field'
                type="text" 
                value={food} onChange={(e) => setFood(e.target.value)} 
                required
                />
            {errors.food && <div className="error-message">{errors.food}</div>} 
            </div>

            <div className='input-container'>
                <label className='label'>Amount: </label>
                <input className='input-field'
                type="text" 
                value={amount} onChange={(e) => setAmount(e.target.value)} 
                required
                />
            {errors.amount && <div className="error-message">{errors.amount}</div>} 
            </div>

            <textarea className='textarea-field'
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Add your note"
            />

            <button className='btn' onClick={handleSave}>{mealToEdit ? 'Update' : 'Save'}</button>
        </div>
    );
};

export default MealPlannerActivity;
