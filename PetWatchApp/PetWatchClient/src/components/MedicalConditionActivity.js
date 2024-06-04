import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddActivity.css';

const MedicalConditionActivity = ({ onSave, onClose }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [continuedTreatment, setContinuedTreatment] = useState('');
    const [dateDiagnosed, setDateDiagnosed] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!name) {
            validationErrors.name = 'Name is required';
        }
        if (!description) {
            validationErrors.description = 'Description is required';
        }
        if (!dateDiagnosed) {
            validationErrors.dateDiagnosed = 'Diagnose Date is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave({ 
                name, 
                description, 
                continuedTreatment,
                dateDiagnosed, 
                note: note ? note : null
            });
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <h3>Add Medical Condition: </h3>   
                <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
            </div>
            
            <div className='input-container'>
                <label className='label'>Medical Condition Name: </label>
                <input className='input-field'
                type="text" 
                value={name} onChange={(e) => setName(e.target.value)} 
                required
                />
            {errors.name && <div className="error-message">{errors.name}</div>} 
            </div>
           
            <div className='input-container'>
                <label className='label'>Desciption: </label>
                <input className='input-field'
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required
                />
            {errors.description && <div className="error-message">{errors.description}</div>} 
            </div>
           

            <div className='input-container'>
                <label className='label'>Diagnose Date: </label>
                <input className='input-field'
                type="datetime-local" 
                id="appointmentDateTime" 
                name="appointmentDateTime" 
                onChange={(event) => setDateDiagnosed(event.target.value)} 
                value={dateDiagnosed} 
                required
                />    
            {errors.dateDiagnosed && <div className="error-message">{errors.dateDiagnosed}</div>} 
            </div>

            <div className='input-container'>
                <label className='label'>Continued Treatment: </label>
                <input className='input-field'
                type="text" 
                value={continuedTreatment} 
                onChange={(e) => setContinuedTreatment(e.target.value)} 
                />
            </div>

            <textarea className='textarea-field'
            type="text" 
            value={note} onChange={(e) => setNote(e.target.value)} 
            placeholder="You can add note" />

            <button className='btn' onClick={handleSave}>Save</button>
        </div>
    );
};

export default MedicalConditionActivity;
