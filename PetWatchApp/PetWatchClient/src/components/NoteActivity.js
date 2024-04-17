import React, { useState } from 'react';
import '../styles/AddActivity.css';

const NoteActivity = ({ onSave }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const validationErrors = {};
        if (!title) {
            validationErrors.title = 'Note Title is required';
        }
        if (!content) {
            validationErrors.content = 'Note Content is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave({ 
                title,
                content 
            });
        } 
    };

    return (
        <div className='container'>
            <h3>Add your note: </h3>   

            <div className='input-container'>
                <label className='label'>Title: </label>
                <input className='input-field'
                type="text" 
                value={title} onChange={(e) => setTitle(e.target.value)} 
                placeholder="Note Title" 
                required
                />
            {errors.title && <div className="error-message">{errors.title}</div>} 
            </div>

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
