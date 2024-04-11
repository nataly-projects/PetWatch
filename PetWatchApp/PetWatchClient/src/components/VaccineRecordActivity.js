import React, { useState } from 'react';
import '../styles/AddActivity.css';

const VaccineRecordActivity = ({ onSave, vaccineType }) => {
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [nextDate, setNextDate] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!date) {
            validationErrors.date = 'Date is required';
        }
        if (!nextDate) {
            validationErrors.nextDate = 'Next Date is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        console.log('date: ', date);
        console.log('is valid: ', validateInputs());
        if (validateInputs()) {
            onSave({ 
                vaccineType: vaccineType.name,
                note: note ? note : null,
                date,
                nextDate 
            });
        }
        
    };

    return (
        <div className='container'>
            <h3>Add record for vaccine Type: {vaccineType.value}</h3>        
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
                required
                />
            {errors.nextDate && <div className="error-message">{errors.nextDate}</div>} 
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

export default VaccineRecordActivity;
