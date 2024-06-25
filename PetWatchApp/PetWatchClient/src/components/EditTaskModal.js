import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditTaskModal = ({ isOpen, onClose, task, onEditTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditTask({ ...task, title, description, dueDate });
  };

  if (!isOpen){
    return null;
  } 

  return (
    <div className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <h2>Edit Task</h2>
          <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
        </div>

        <div className='input-container'>
          <label className='label'>Title:</label>
          <input className='input-field'
          type="text"
           value={title} 
           onChange={(e) => setTitle(e.target.value)} 
           required 
           />
        </div>
         
        <div className='input-container'>
        <label className='label'>Description:</label>
          <textarea className='textarea-field'
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
          />
        </div>
          

        <div className='input-container'>
          <label className='label'>Due Date:</label>
          <input className='input-field'
          type="date" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          />
        </div>
        
        <div className='actions'>
          <button className='btn' onClick={handleSubmit}>Add Task</button>
          <button className='btn' onClick={onClose}>Cancel</button>
        </div>
      </div>
      
    </div>
  );
};

export default EditTaskModal;
