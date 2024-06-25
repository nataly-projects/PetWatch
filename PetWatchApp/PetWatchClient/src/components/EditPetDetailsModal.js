import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { formatDateAndTimeForInput } from '../utils/utils';
import '../styles/PetEditModal.css';

const EditPetDetailsModal = ({ pet, onClose, onSubmit }) => {
    const [updatedPetDetails, setUpdatedPetDetails] = useState({ ...pet });
    const type = 'pet';

    useEffect(() => {
        setUpdatedPetDetails({ ...pet });
    }, [pet]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedPetDetails((prevState) => ({
        ...prevState,
        [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(updatedPetDetails, type);
    };

    return (
        <Modal isOpen className="modalContent" contentLabel="Edit Item">
            <div className='hedaer-container'>
                <h2>Edit {updatedPetDetails.name} Details:</h2>
                <button className="close-btn" onClick={onClose}>X</button>
            </div>
        
        <form onSubmit={handleSubmit}>

            <div className='input-container'>
            <label className='label'>Name:</label>
            <input className='input-field' name="name" type="text" value={updatedPetDetails.name} onChange={handleChange} />
            </div>

            <div className='input-container'>
            <label className='label'>Species:</label>
            <input className='input-field' name="species" type="text" value={updatedPetDetails.species} onChange={handleChange} />
            </div>

            <div className='input-container'>
                <label className='label'>Species:</label>
                <div className='radio-buttons'> 
                    <div>
                        <input
                            type="radio"
                            id="male"
                            name="species"
                            value="MALE"
                            checked={updatedPetDetails.species === 'MALE'}
                            onChange={handleChange}
                        />
                        <label htmlFor="male">Male</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="female"
                            name="species"
                            value="FEMALE"
                            checked={updatedPetDetails.species === 'FEMALE'}
                            onChange={handleChange}
                        />
                        <label htmlFor="female">Female</label>
                    </div>
                </div>
            </div>
            
            <div className='input-container'>
                <label className='label'>Breed:</label>
                <input className='input-field' name="breed" type="text" value={updatedPetDetails.breed} onChange={handleChange} />
            </div>

            <div className='input-container'>
            <label className='label'>Age:</label>
            <input className='input-field' name="age" type="number" value={updatedPetDetails.age} onChange={handleChange} />
            </div>

            <div className='input-container'>
            <label className='label'>Weight:</label>
            <input className='input-field' name="weight" type="number" value={updatedPetDetails.weight} onChange={handleChange} />
            </div>

            <div className='input-container'>
            <label className='label'>Birthday:</label>
            <input className='input-field' name="birthday" type="datetime-local" value={updatedPetDetails.birthday ? formatDateAndTimeForInput(updatedPetDetails.birthday): ''} onChange={handleChange} />
            </div> 
            
            <div className='textarea-container'>
                <label className='label'>About {updatedPetDetails.name}:</label>
                <textarea className='textarea-field' name="description" value={updatedPetDetails.description} onChange={handleChange} />
            </div>
            
            <div className='input-container'>
            <label className='label'>Chip Number:</label>
            <input className='input-field' name="chipNumber" type="text" value={updatedPetDetails.chipNumber} onChange={handleChange} />
            </div>

            <div className='actions'>
                <button className='btn' type="submit">Save</button>
                <button className='btn' type="button" onClick={onClose}>Cancel</button>
            </div>
            
        </form>
        </Modal>
    );
};

export default EditPetDetailsModal;
