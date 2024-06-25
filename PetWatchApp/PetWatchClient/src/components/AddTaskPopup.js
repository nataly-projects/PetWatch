import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import '../styles/AddTaskModal.css';

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errors, setErrors] = useState({});

    const handleAddTask = () => {
        if (validateInputs()) {
            onAddTask({ title, description, dueDate });
            onClose();
        }
    };

    if (!isOpen){
        return null;
    } 

    const validateInputs = () => {
        const validationErrors = {};
        if (!title) {
            validationErrors.title = 'title is required';
        }
        if (!description) {
            validationErrors.description = 'Description is required';
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return (
        <div className='modal'>
            <div className='modal-content'>
                
                <div className='modal-header'>
                    <h2>Add New Task</h2>
                    <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
                </div>
                

                <div className='input-container'>
                    <label className='label'>Title</label>
                    <input className='input-field'
                    type='text' 
                    value={title} 
                    required
                    onChange={(e) => setTitle(e.target.value)} 
                    />
                {errors.title && <div className="error-message">{errors.title}</div>} 
                </div>
            
                <div className='input-container'>
                    <label className='label'>Description</label>
                    <textarea className='textarea-field'
                    value={description} 
                    required
                    onChange={(e) => setDescription(e.target.value)}
                    ></textarea> 
                {errors.description && <div className="error-message">{errors.description}</div>} 
                </div>
                
                <div className='input-container'>
                    <label className='label'>Due Date</label>
                    <input className='input-field'
                    type='date' 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    />
                </div>

                <div className='actions'>
                    <button className='btn' onClick={handleAddTask}>Add Task</button>
                    <button className='btn' onClick={onClose}>Cancel</button>
                </div>
                

            </div>
        </div>
    );
};

export default AddTaskModal;
