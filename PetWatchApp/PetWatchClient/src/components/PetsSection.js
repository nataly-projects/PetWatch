import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Grid } from '@mui/material';
import { getPetsByUserId } from '../services/petService'; 
import PetCard from './PetCard';
import AddPetForm from './AddPetForm';
import useFetch from '../hooks/useFetch';

const PetsSection = () => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();

    const [isAddPetPopupOpen, setIsAddPetPopupOpen] = useState(false);

    const { data: pets, loading, error } = useFetch(
        getPetsByUserId,
        user?._id && token ? [user._id, token] : null,
        null
    );


    const handleAddNewPetClick = () => setIsAddPetPopupOpen(true);
    const handleClosePopup = () => setIsAddPetPopupOpen(false);

    if (loading) {
        return (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
              <CircularProgress />
              <Typography variant="body1" mt={2}>Loading...</Typography>
          </Box>
        );
    }
    
    if (error) {
        console.error('Error fetching dashboard data:', error);
    
        if (error.response?.status === 401) {
          navigate('/login');
          return null;
        }
    
        return (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
            <Typography>Failed to fetch dashboard data. Please try again later.</Typography>
            <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        );
    }
    
    return (
        <Box className="pets-section-container" p={3}>
            <Typography variant="h4" gutterBottom>Welcome to the Pets Section!</Typography>
            <Typography variant="body1" gutterBottom>Here you can see your pets:</Typography>
            
            {pets.length > 0 ? (
                <Grid container spacing={2} mt={2}>
                    {pets.map((pet) => (
                        <Grid item xs={12} sm={6} key={pet._id}>
                            <PetCard pet={pet} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body2">No pets added yet.</Typography>
            )}
            
            <Typography variant="body2" mt={2}>You can add a new pet:</Typography>
            <Button variant="contained" color="primary" onClick={handleAddNewPetClick} sx={{ mt: 2 }}>Add New Pet</Button>

            <AddPetForm open={isAddPetPopupOpen} handleClose={handleClosePopup} />
        </Box>
    );
};

export default PetsSection;
