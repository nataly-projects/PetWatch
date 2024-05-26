import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddActivity.css';

const EmergencyContactsActivity = ({ onSave, onClose, contactToEdit  }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [type, setType] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (contactToEdit) {
            setName(contactToEdit.name);
            setPhone(contactToEdit.phone);
            setType(contactToEdit.type);
        }
    }, [contactToEdit]);

    const validateInputs = () => {
        const validationErrors = {};
        if (!name) {
            validationErrors.name = 'Contact Name is required';
        }
        if (!phone) {
            validationErrors.phone = 'Contact Phone number is required';
        }
        if (!type) {
            validationErrors.type = 'Contact Type is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            const updatedContact = 
            contactToEdit 
            ? { ...contactToEdit, name, phone, type } 
            : { name, phone, type };
            onSave(updatedContact);
        } 
    };

    return (
        <div className='container'>
            <div className='header'>
                <h3>{contactToEdit ? 'Edit the contact' : 'Add new emergency contact'}</h3> 
                <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
            </div>
            
            <div className='input-container'>
                <label className='label'>Name: </label>
                <input className='input-field'
                type="text" 
                value={name} onChange={(e) => setName(e.target.value)} 
                required
                />
            {errors.name && <div className="error-message">{errors.name}</div>} 
            </div>

            <div className='input-container'>
                <label className='label'>Phone: </label>
                <input className='input-field'
                type="phone" 
                value={phone} onChange={(e) => setPhone(e.target.value)} 
                required
                />
            {errors.phone && <div className="error-message">{errors.phone}</div>} 
            </div>

            <div className='input-container'>
                <label className='label'>Type: </label>
                <input className='input-field'
                type="text" 
                placeholder='e.g. Vet'
                value={type} onChange={(e) => setType(e.target.value)} 
                required
                />
            {errors.type && <div className="error-message">{errors.type}</div>} 
            </div>

            <button className='btn' onClick={handleSave}>{contactToEdit ? 'Update' : 'Save'}</button>
        </div>
    );
};

export default EmergencyContactsActivity;
