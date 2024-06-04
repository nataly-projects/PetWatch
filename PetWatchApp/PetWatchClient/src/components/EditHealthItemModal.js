import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { formatDateForInput } from '../utils/utils';
import '../styles/PetEditModal.css';

const EditHealthItemModal = ({ item, type, onClose, onSubmit }) => {
    const [updatedItem, setUpdatedItem] = useState({ ...item });

    useEffect(() => {
        setUpdatedItem({ ...item });
    }, [item]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem((prevState) => ({
        ...prevState,
        [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(updatedItem, type);
    };

    return (
        <Modal isOpen className="modalContent" contentLabel="Edit Item">
            <div className='hedaer-container'>
                <h2>Edit {type}</h2>
                <button className="close-btn" onClick={onClose}>X</button>
            </div>
        

        <form onSubmit={handleSubmit}>

            <div className='input-container'>
            <label className='label'>Name:</label>
            <input className='input-field' name="name" type="text" value={updatedItem.name} onChange={handleChange} />
            </div>

            {updatedItem.dosage && 
            ( <div className='input-container'>
                <label className='label'>Dosage:</label>
                <input className='input-field' name="dosage" type="text" value={updatedItem.dosage} onChange={handleChange} />
            </div>
            )}

            {updatedItem.description && (
            <div className='input-container'>
            <label className='label'>Description:</label>
            <input className='input-field' name="description" type="text" value={updatedItem.description} onChange={handleChange} />
            </div>
            )}

            {updatedItem.continuedTreatment && (
            <div className='textarea-container'>
                <label className='label'>Continued Treatment:</label>
                <textarea className='textarea-field' name="continuedTreatment" value={updatedItem.continuedTreatment} onChange={handleChange} />
            </div>
            )}

            {updatedItem.treatment && (
            <div className='textarea-container'>
                <label className='label'>Treatment:</label>
                <textarea className='textarea-field' name="treatment" value={updatedItem.treatment} onChange={handleChange} />
            </div>
            )}

            {updatedItem.note && (
            <div className='textarea-container'>
                <label className='label'>Note:</label>
                <textarea className='textarea-field' name="note" value={updatedItem.note} onChange={handleChange} />
            </div>
            )}
            {updatedItem.date && ( 
            <div className='input-container'>
            <label className='label'>Date:</label>
            <input className='input-field' name="date" type="datetime-local" value={formatDateForInput(updatedItem.date)} onChange={handleChange} />
            </div> 
            )}

            {updatedItem.dateDiagnosed && (
            <div className='input-container'>
            <label className='label'>Date Diagnose:</label>
            <input className='input-field' name="dateDiagnosed" type="datetime-local" value={formatDateForInput(updatedItem.dateDiagnosed)} onChange={handleChange} />
            </div> 
            )}

            {updatedItem.startDate && (
            <div className='input-container'>
            <label className='label'>Start Date:</label>
            <input className='input-field' name="startDate" type="datetime-local" value={formatDateForInput(updatedItem.startDate)} onChange={handleChange} />
            </div> 
            )}

        {updatedItem.endDate && (
            <div className='input-container'>
            <label className='label'>End Date:</label>
            <input className='input-field' type="datetime-local" name="endDate" value={formatDateForInput(updatedItem.endDate)} onChange={handleChange} />
            </div> 
            )}

            <div className='actions'>
                <button className='btn' type="submit">Save</button>
                <button className='btn' type="button" onClick={onClose}>Cancel</button>
            </div>
            
        </form>
        </Modal>
    );
};

export default EditHealthItemModal;
