import React, { useState } from 'react';
import '../styles/AddActivity.css';

const AllergyActivity = ({ onSave }) => {
    const [name, setName] = useState('');
    const [note, setNote] = useState('');
    const [date, setDate] = useState('');
    const [treatment, setTreatment] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!name) {
            validationErrors.name = 'Name is required';
        }
        if (!treatment) {
            validationErrors.treatment = 'Treatment is required';
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
                name, 
                note: note ? note : null,
                date, 
                treatment 
            });
        }    
    };

    return (
        <div className='container'>
            <h3>Add Allergy: </h3> 

            <div className='input-container'>
                <label className='label'>Allergy Name: </label>
                <input className='input-field'
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Allergy Name" 
                required />
            {errors.name && <div className="error-message">{errors.name}</div>} 

            </div>  

            <textarea className='textarea-field'
            type="text" 
            value={treatment} 
            onChange={(e) => setTreatment(e.target.value)} 
            placeholder="Add the treatment" 
            required />
            {errors.treatment && <div className="error-message">{errors.treatment}</div>} 

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
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="You can add note" />

            <button className='btn' onClick={handleSave}>Save</button>
        </div>
    );
};

export default AllergyActivity;
