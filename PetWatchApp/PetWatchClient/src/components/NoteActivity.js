import React, { useState } from 'react';
import '../styles/AddActivity.css';

const NoteActivity = ({ onSave }) => {
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!content) {
            validationErrors.content = 'Note Content is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave({ 
                content 
            });
        } 
    };

    return (
        <div className='container'>
            <h3>Add your note: </h3>   
            <textarea className='textarea-field'
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            placeholder="Add your note"
            required 
            />
            {errors.content && <div className="error-message">{errors.content}</div>} 

            <button className='btn' onClick={handleSave}>Save</button>
        </div>
    );
};

export default NoteActivity;
