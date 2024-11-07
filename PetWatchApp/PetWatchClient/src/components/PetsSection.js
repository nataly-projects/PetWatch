import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Grid } from '@mui/material';
import { getPetsByUserId } from '../services/petService'; 
import PetCard from './PetCard';
import AddPetForm from './AddPetForm';

const PetsSection = () => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isAddPetPopupOpen, setIsAddPetPopupOpen] = useState(false);

    const fetchData = async () => {
        try {
            const userPets = await getPetsByUserId(user._id, token);
            setPets(userPets);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

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
        return (
            <Box textAlign="center" mt={4}>
                <Typography variant="body1" color="error">Failed to fetch user data. Please try again later.</Typography>
                <Button variant="outlined" color="primary" onClick={fetchData} sx={{ mt: 2 }}>Retry</Button>
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
