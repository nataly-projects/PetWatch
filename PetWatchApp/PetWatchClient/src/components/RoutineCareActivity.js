import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddActivity.css';

const RoutineCareActivity = ({ onSave, routineCareType, onClose }) => {
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [nextDate, setNextDate] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!date) {
            validationErrors.date = 'Date is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave({ 
                activity: routineCareType.value, 
                note: note ? note : null,
                date, 
                nextDate 
            });
        }
    };

    return (
        <div className='container'>       
            <div className='header'>
                <h3>Add record for routine care Type: {routineCareType.value}</h3>  
                <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
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

            <div className='input-container'>
                <label className='label'>Next Date: </label>
                <input className='input-field'
                type="datetime-local" 
                id="appointmentDateTime" 
                name="appointmentDateTime" 
                onChange={(event) => setNextDate(event.target.value)}
                value={nextDate}
                />           
            </div>

            <textarea className='textarea-field'
            type="text" 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="You can add note" />

            <button className='btn' onClick={handleSave}>Save</button>
        </div>
    );
};

export default RoutineCareActivity;
