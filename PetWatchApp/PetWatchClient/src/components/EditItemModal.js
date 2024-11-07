import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatDateAndTimeForInput, formFieldsConfig } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { FormFieldsType } from '../utils/utils';

const EditItemModal = ({ item, type, onClose, onSubmit }) => {
    const [updatedItem, setUpdatedItem] = useState({ ...item });

    useEffect(() => {
        setUpdatedItem({ ...item });
    }, [item]);

    const handleSave = (data) => {
        onSubmit(data, type);
        onClose();
    };

    const formConfig = formFieldsConfig(updatedItem)[type];

    // const petFormConfig = {
    //     title: `Edit ${item.name} Details`,
    //     fields: [
    //         { name: 'name', label: 'Name', type: 'text', value: updatedPetDetails.name },
    //         {
    //             name: 'species',
    //             label: 'Species',
    //             type: 'radio',
    //             options: [
    //                 { label: 'Male', value: 'MALE' },
    //                 { label: 'Female', value: 'FEMALE' }
    //             ],
    //             value: updatedPetDetails.species,
    //         },
    //         { name: 'breed', label: 'Breed', type: 'text', value: updatedPetDetails.breed },
    //         { name: 'age', label: 'Age', type: 'number', value: updatedPetDetails.age },
    //         { name: 'weight', label: 'Weight', type: 'number', value: updatedPetDetails.weight },
    //         {
    //             name: 'birthday',
    //             label: 'Birthday',
    //             type: 'datetime-local',
    //             value: updatedPetDetails.birthday ? formatDateAndTimeForInput(updatedPetDetails.birthday) : '',
    //         },
    //         {
    //             name: 'description',
    //             label: `About ${updatedPetDetails.name}`,
    //             type: 'textarea',
    //             value: updatedPetDetails.description,
    //         },
    //         { name: 'chipNumber', label: 'Chip Number', type: 'text', value: updatedPetDetails.chipNumber },
    //     ],
    //     validationRules: {
    //         name: 'Name',
    //         age: 'Age',
    //         weight: 'Weight',
    //         breed: 'Breed',
    //         species: 'Species',
    //         description: 'Description'
    //     },
    // };

    // // Define form fields dynamically based on `updatedItem` properties
    // const healthFields = () => {
    //     const fields = [];
        
    //     if (updatedItem.name !== undefined) {
    //         fields.push({ name: 'name', label: 'Name', type: 'text', required: true });
    //     }
    //     if (updatedItem.dosage !== undefined) {
    //         fields.push({ name: 'dosage', label: 'Dosage', type: 'text' });
    //     }
    //     if (updatedItem.description !== undefined) {
    //         fields.push({ name: 'description', label: 'Description', type: 'text' });
    //     }
    //     if (updatedItem.continuedTreatment !== undefined) {
    //         fields.push({ name: 'continuedTreatment', label: 'Continued Treatment', type: 'textarea' });
    //     }
    //     if (updatedItem.treatment !== undefined) {
    //         fields.push({ name: 'treatment', label: 'Treatment', type: 'textarea' });
    //     }
    //     if (updatedItem.note !== undefined) {
    //         fields.push({ name: 'note', label: 'Note', type: 'textarea' });
    //     }
    //     if (updatedItem.date !== undefined) {
    //         fields.push({ name: 'date', label: 'Date', type: 'datetime-local', defaultValue: formatDateAndTimeForInput(updatedItem.date) });
    //     }
    //     if (updatedItem.dateDiagnosed !== undefined) {
    //         fields.push({ name: 'dateDiagnosed', label: 'Date Diagnosed', type: 'datetime-local', defaultValue: formatDateAndTimeForInput(updatedItem.dateDiagnosed) });
    //     }
    //     if (updatedItem.startDate !== undefined) {
    //         fields.push({ name: 'startDate', label: 'Start Date', type: 'datetime-local', defaultValue: formatDateAndTimeForInput(updatedItem.startDate) });
    //     }
    //     if (updatedItem.endDate !== undefined) {
    //         fields.push({ name: 'endDate', label: 'End Date', type: 'datetime-local', defaultValue: formatDateAndTimeForInput(updatedItem.endDate) });
    //     }

    //     return fields;
    // };

    // const formFields = type === 'pet' ? petFormConfig : getFields();

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5">{type === FormFieldsType.PET ? formConfig.title : `Edit ${type}`}</Typography>
                <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                { type === FormFieldsType.PET ? (
                    <GenericActivityForm
                    title={formConfig.title}
                    fields={formConfig.fields}
                    validationRules={formConfig.validationRules}
                    initialData={updatedItem}
                    onSave={handleSave}
                    onClose={onClose}
                    showHeader={false}
                    />
                )
                :
                (  <GenericActivityForm
                    title={formConfig.title ? formConfig.title : null}
                    showHeader={formConfig.title ? true : false}
                    fields={formConfig.fields}
                    initialData={updatedItem}
                    onSave={handleSave}
                    onClose={onClose}
                    />
                )
                }
                
            </DialogContent>
        </Dialog>
    );
};

export default EditItemModal;
