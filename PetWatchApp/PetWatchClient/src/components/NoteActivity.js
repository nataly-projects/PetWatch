import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddActivity.css';

const NoteActivity = ({ onSave, onClose, noteToEdit  }) => {
    console.log('noteToEdit: ', noteToEdit);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (noteToEdit) {
            setTitle(noteToEdit.title);
            setContent(noteToEdit.content);
        }
    }, [noteToEdit]);

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
            const updatedNote = noteToEdit 
            ? { ...noteToEdit, title, content } 
            : { title, content };
            onSave(updatedNote);

            // onSave({ 
            //     title,
            //     content 
            // });
        } 
    };

    return (
        <div className='container'>
            <div className='header'>
                <h3>{noteToEdit ? 'Edit your note' : 'Add your note'}</h3> 
                <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
            </div>
            
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

            <button className='btn' onClick={handleSave}>{noteToEdit ? 'Save' : 'Update'}</button>
        </div>
    );
};

export default NoteActivity;
