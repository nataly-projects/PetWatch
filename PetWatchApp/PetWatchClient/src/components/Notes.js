import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { formFieldsConfig, FormFieldsType } from '../utils/utils';

const Notes = ({ notesRecord, onAdd, onDelete, noteToEdit }) => {
    const [showAddForm, setShowAddForm] = useState(false);

    const formConfig = formFieldsConfig()[FormFieldsType.NOTE];

    const toggleAddForm = () => {
        setShowAddForm((prev) => !prev);
    };

    return (
        <Box className="form-section">
            <Typography variant="h5">Section 9: Notes Record</Typography>

            {notesRecord.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                        Notes Records
                    </Typography>
                    <Box className="activity-section">
                        {notesRecord.map((item, index) => (
                            <Box key={index} className="activity-card" sx={{ mb: 2 }}>
                                <Box
                                    className="activity-card-header"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{item.content}</Typography>
                                    <FontAwesomeIcon
                                        className="activity-card-icon"
                                        icon={faTrash}
                                        onClick={() => onDelete('notesRecord', index)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Box>
                                <Typography>Date: {formatDate(Date.now())}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            <Typography variant="h6">Add Note:</Typography>
            <Button variant="contained" onClick={toggleAddForm}>
                Add new note
            </Button>

            {showAddForm && formConfig && (
                <GenericActivityForm
                    title= {noteToEdit ? 'Edit your note' : formConfig.title}
                    fields={formConfig.fields}
                    onSave={(data) => onAdd('notesRecord', data)}
                    onClose={toggleAddForm}
                    validationRules={formConfig.validationRules}
                    initialData={noteToEdit}
                />
            )}

            <Typography variant="body2" className="optional-section">
                You can add this information later in the pet profile. However, it's important to add all pet info for tracking and analysis.
            </Typography>
        </Box>
    );
};

export default Notes;
