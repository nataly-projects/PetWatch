import React, { useState } from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { formFieldsConfig, FormFieldsType } from '../utils/utils';

const HealthInformation = ({ 
    medicalConditions = [], 
    allergies = [],         
    medications = [],       
    onAdd, 
    onDelete 
}) => {
    const [showAddForm, setShowAddForm] = useState({
        medicalCondition: false,
        allergy: false,
        medication: false,
    });

    const allergyFormConfig = formFieldsConfig()[FormFieldsType.ALLERGY];
    const medicationFormConfig = formFieldsConfig()[FormFieldsType.MEDICATION];
    const medicalFormConfig = formFieldsConfig()[FormFieldsType.MEDICAL_CONDITION];

    const toggleAddForm = (type) => {
        setShowAddForm((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    return (
        <Box>
            <Typography variant="h6">Section 4: Health Information</Typography>

            {/* Medical Conditions */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Medical Conditions</Typography>
            <Box sx={{ mb: 2 }}>
                {medicalConditions.map((item, index) => (
                    <Box key={index} className="activity-card">
                        <Box className="activity-card-header">
                            <Typography><strong>{item.name}</strong></Typography>
                            <FontAwesomeIcon icon={faTrash} onClick={() => onDelete('medicalConditions', index)} />
                        </Box>
                        <Typography>Description: {item.description}</Typography>
                        <Typography>Diagnose Date: {formatDate(item.dateDiagnosed)}</Typography>
                    </Box>
                ))}
            </Box>
            <Button variant="contained" onClick={() => toggleAddForm('medicalCondition')}>Add Medical Condition</Button>
            {showAddForm.medicalCondition && medicalFormConfig && (
                <GenericActivityForm
                title= {medicalFormConfig.title}
                fields={medicalFormConfig.fields}
                 onSave={(data) => onAdd('medicalConditions', data)}
                 onClose={() => toggleAddForm('medicalCondition')}
                 validationRules={medicalFormConfig.validationRules}                
                 />
            )}

            {/* Allergies */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Allergies</Typography>
            <Box sx={{ mb: 2 }}>
                {allergies.map((item, index) => (
                    <Box key={index} className="activity-card">
                        <Box className="activity-card-header">
                            <Typography><strong>{item.name}</strong></Typography>
                            <FontAwesomeIcon icon={faTrash} onClick={() => onDelete('allergies', index)} />
                        </Box>
                        <Typography>Date: {formatDate(item.date)}</Typography>
                        <Typography>Treatment: {item.treatment}</Typography>
                    </Box>
                ))}
            </Box>
            <Button variant="contained" onClick={() => toggleAddForm('allergy')}>Add Allergy</Button>
            {showAddForm.allergy && allergyFormConfig && (
                  <GenericActivityForm
                  title= {allergyFormConfig.title}
                  fields={allergyFormConfig.fields}
                   onSave={(data) => onAdd('allergies', data)}
                   onClose={() => toggleAddForm('allergies')}
                   validationRules={allergyFormConfig.validationRules}                
                   />
            )}

            {/* Medications */}
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1">Medications</Typography>
            <Box sx={{ mb: 2 }}>
                {medications.map((item, index) => (
                    <Box key={index} className="activity-card">
                        <Box className="activity-card-header">
                            <Typography><strong>{item.name}</strong></Typography>
                            <FontAwesomeIcon icon={faTrash} onClick={() => onDelete('medications', index)} />
                        </Box>
                        <Typography>Dosage: {item.dosage}</Typography>
                        <Typography>Start Date: {formatDate(item.startDate)}</Typography>
                        <Typography>End Date: {formatDate(item.endDate)}</Typography>
                    </Box>
                ))}
            </Box>
            <Button variant="contained" onClick={() => toggleAddForm('medication')}>Add Medication</Button>
            {showAddForm.medication && medicationFormConfig && (
                  <GenericActivityForm
                  title= {medicationFormConfig.title}
                  fields={medicationFormConfig.fields}
                   onSave={(data) => onAdd('medications', data)}
                   onClose={() => toggleAddForm('medications')}
                   validationRules={medicationFormConfig.validationRules}
                   />
            )}

            <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                You can add this information later in the pet profile. However, it's important to add all pet info for tracking and analysis.
            </Typography>
        </Box>
    );
};

export default HealthInformation;
