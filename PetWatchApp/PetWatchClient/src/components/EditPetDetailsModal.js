import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, Radio, RadioGroup, FormControl, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateAndTimeForInput } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';

const EditPetDetailsModal = ({ pet, onClose, onSubmit }) => {
    const [updatedPetDetails, setUpdatedPetDetails] = useState({ ...pet });
    const type = 'pet';

    useEffect(() => {
        setUpdatedPetDetails({ ...pet });
    }, [pet]);

 
    const handleSave = (data) => {
        onSubmit(data, type);  
        onClose();
    };

    const formConfig = {
        title: `Edit ${updatedPetDetails.name} Details`,
        fields: [
            { name: 'name', label: 'Name', type: 'text', value: updatedPetDetails.name },
            {
                name: 'species',
                label: 'Species',
                type: 'radio',
                options: [
                    { label: 'Male', value: 'MALE' },
                    { label: 'Female', value: 'FEMALE' }
                ],
                value: updatedPetDetails.species,
            },
            { name: 'breed', label: 'Breed', type: 'text', value: updatedPetDetails.breed },
            { name: 'age', label: 'Age', type: 'number', value: updatedPetDetails.age },
            { name: 'weight', label: 'Weight', type: 'number', value: updatedPetDetails.weight },
            {
                name: 'birthday',
                label: 'Birthday',
                type: 'datetime-local',
                value: updatedPetDetails.birthday ? formatDateAndTimeForInput(updatedPetDetails.birthday) : '',
            },
            {
                name: 'description',
                label: `About ${updatedPetDetails.name}`,
                type: 'textarea',
                value: updatedPetDetails.description,
            },
            { name: 'chipNumber', label: 'Chip Number', type: 'text', value: updatedPetDetails.chipNumber },
        ],
        validationRules: {
            name: 'Name',
            age: 'Age',
            weight: 'Weight',
            breed: 'Breed',
            species: 'Species',
            description: 'Description'
        },
    };

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{formConfig.title}</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </DialogTitle>
        <DialogContent dividers>
            <GenericActivityForm
                title={formConfig.title}
                fields={formConfig.fields}
                validationRules={formConfig.validationRules}
                initialData={updatedPetDetails}
                onSave={handleSave}
                onClose={onClose}
            />
        </DialogContent>
    </Dialog>
    );
};

export default EditPetDetailsModal;
