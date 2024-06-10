import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import petDefaultImage from '../images/paw.png';
import '../styles/PetCard.css';

const PetCard = ({ pet }) => {
    if(pet.image) {
        console.log(pet.image.replace(/\\/g, '/'))
    }
    const navigate = useNavigate();

    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const onPetClick = () => {
        navigate( `/pet-profile/${pet._id}`,  { state: { pet }});
      };

    return (
        <div className="pet-card" onClick={toggleExpand}>
            <div className='pet-basic-details'>
                <img className='img-profile'
                src={pet.image ? `http://localhost:5001/${pet.image}` : petDefaultImage} alt={pet.name} 
                />
                <div className='name-species-section'>
                    <h3>{pet.name}</h3>
                    {pet.species === 'MALE' ? (
                    <FontAwesomeIcon icon={faMars}  /> 
                    ) : (
                    <FontAwesomeIcon icon={faVenus}  /> 
                    )} 
                </div>
            </div>
        
        {expanded && (
            <div className="extended-details">
                {/* <p>About {pet.name}: {pet.description}</p> */}
                <p>Breed: {pet.breed}</p>
                <p>Age: {pet.age}</p>
                <p>Weight: {pet.weight}</p>
                <button className='btn' onClick={onPetClick}> View Pet Page </button>
            </div>
            )}
        </div>
    );
};

PetCard.propTypes = {
  pet: PropTypes.object.isRequired,
};

export default PetCard;
