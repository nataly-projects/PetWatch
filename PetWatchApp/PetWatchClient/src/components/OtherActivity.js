import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddActivity.css';

const OtherActivity = ({ onSave, onClose }) => {
    const [type, setType] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!type) {
            validationErrors.type = 'Activity Type is required';
        }
        if (!note) {
            validationErrors.note = 'Note is required';
        }
        if (!date) {
            validationErrors.date = 'Date is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave({ 
                type, 
                note, 
                date 
            });
        }  
    };

    return (
        <div className='container'>
            <div className='header'>
                <h3>Add Other Activity: </h3>  
                <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
            </div>

            <div className='input-container'>
                <label className='label'>Activity Type: </label>
                <input className='input-field'
                type="text" 
                value={type} 
                onChange={(e) => setType(e.target.value)} 
                placeholder="Activity Type" 
                required />   
            {errors.type && <div className="error-message">{errors.type}</div>} 
            </div>
           

            <textarea className='textarea-field'
            type="text" 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="Enter your desciption" 
            required />
            {errors.note && <div className="error-message">{errors.note}</div>} 


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

            <button className='btn' onClick={handleSave}>Save</button>
        </div>
    );
};

export default OtherActivity;
