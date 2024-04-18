import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddActivity.css';

const VetVisitActivity = ({ onSave, onClose }) => {
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [nextDate, setNextDate] = useState('');
    const [examination, setExamination] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!reason) {
            validationErrors.reason = 'Visit Reason is required';
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
                note: note ? note : null,
                date, 
                nextDate: nextDate ? nextDate : null,
                reason, 
                examination: examination ? examination : null
            });
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <h3>Add Vet Visit:</h3> 
                <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
            </div>

            <div className='input-container'>
                <label className='label'>Visit Reason: </label>
                <input className='input-field'
                type="text" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder="Vet visit reason" 
                required />   
            {errors.reason && <div className="error-message">{errors.reason}</div>} 
            </div>
            
            
            <textarea className='textarea-field'
            type="text" 
            value={examination} 
            onChange={(e) => setExamination(e.target.value)} 
            placeholder="Enter the examination" />
            
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

export default VetVisitActivity;
