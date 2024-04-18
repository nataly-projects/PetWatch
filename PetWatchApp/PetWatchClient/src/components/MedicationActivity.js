import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddActivity.css';

const MedicationActivity = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [dosage, setDosage] = useState('');
    const [note, setNote] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!name) {
            validationErrors.name = 'Name is required';
        }
        if (!dosage) {
            validationErrors.dosage = 'Dosage is required';
        }
        if (!startDate) {
            validationErrors.startDate = 'Start Date is required';
        }
        if (!endDate) {
            validationErrors.endDate = 'End Date is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave({ 
                name, 
                dosage, 
                startDate,
                endDate, 
                note: note ? note : null
            });
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <h3>Add Medication: </h3>   
                <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
            </div>
            
            <div className='input-container'>
                <label className='label'>Medication Name: </label>
                <input className='input-field'
                type="text" 
                value={name} onChange={(e) => setName(e.target.value)} 
                placeholder="Medication Name" 
                required
                />
            {errors.name && <div className="error-message">{errors.name}</div>} 
            </div>
           
            <div className='input-container'>
                <label className='label'>Medication Dosage: </label>
                <input className='input-field'
                type="text" 
                value={dosage} 
                onChange={(e) => setDosage(e.target.value)} 
                placeholder="Dosage" 
                required
                />
            {errors.dosage && <div className="error-message">{errors.dosage}</div>} 
            </div>
           

            <div className='input-container'>
                <label className='label'>Start Date: </label>
                <input className='input-field'
                type="datetime-local" 
                id="appointmentDateTime" 
                name="appointmentDateTime" 
                onChange={(event) => setStartDate(event.target.value)} 
                value={startDate} 
                required
                />    
            {errors.startDate && <div className="error-message">{errors.startDate}</div>} 
            </div>

            <div className='input-container'>
                <label className='label'>End Date: </label>
                <input className='input-field'
                type="datetime-local" 
                id="appointmentDateTime" 
                name="appointmentDateTime" 
                onChange={(event) => setEndDate(event.target.value)}
                value={endDate}
                required
                />     
            {errors.endDate && <div className="error-message">{errors.endDate}</div>} 
            </div>

            <textarea className='textarea-field'
            type="text" 
            value={note} onChange={(e) => setNote(e.target.value)} 
            placeholder="You can add note" />

            <button className='btn' onClick={handleSave}>Save</button>
        </div>
    );
};

export default MedicationActivity;
