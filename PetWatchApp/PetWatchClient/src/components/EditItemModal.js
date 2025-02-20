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
