import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardActions, Button, Typography, Avatar, Collapse, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import petDefaultImage from '../images/paw.png';

const PetCard = ({ pet }) => {
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = (e) => {
        e.stopPropagation();
        setExpanded((prev) => !prev);
    };

    const onPetClick = (e) => {
        e.stopPropagation();
        navigate(`/main/pet-profile/${pet._id}`, { state: { pet } });
    };

    return (
        <Card 
            onClick={toggleExpand} 
            sx={{
                width: 300,
                margin: '20px auto',
                boxShadow: 3,
                transition: 'box-shadow 0.3s ease',
                '&:hover': {
                    boxShadow: 6,
                    cursor: 'pointer'
                }
            }}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                    src={pet.image ? `http://localhost:5001/${pet.image.replace(/\\/g, '/')}` : petDefaultImage}
                    alt={pet.name}
                    sx={{ width: 80, height: 80, border: '1px solid #ccc' }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h5">{pet.name}</Typography>
                    <FontAwesomeIcon icon={pet.species === 'MALE' ? faMars : faVenus} />
                </Box>
            </CardContent>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ mt: 1 }}>
                    <Typography variant="body1">Breed: {pet.breed}</Typography>
                    <Typography variant="body1">Age: {pet.age}</Typography>
                    <Typography variant="body1">Weight: {pet.weight}</Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" color="primary" onClick={onPetClick}>
                        View Pet Page
                    </Button>
                </CardActions>
            </Collapse>
        </Card>
    );
};

PetCard.propTypes = {
  pet: PropTypes.object.isRequired,
};

export default PetCard;
