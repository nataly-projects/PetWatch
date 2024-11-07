import React from 'react';
import { Box, Typography, IconButton, Paper } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ActivityType } from '../utils/utils';

const HealthInformationSection = ({ 
  medicalConditions, 
  medications, 
  allergies, 
  onEdit, 
  onDelete 
}) => {

  const handleEdit = (item, type) => {
    onEdit(item, type);
  };

  const handleDelete = (item, type) => {
    onDelete(item, type);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Health Information</Typography>

      {/* Medical Conditions */}
      <Typography variant="h6" sx={{ mb: 1 }}>Medical Conditions:</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {medicalConditions.length > 0 ? (
          medicalConditions.map((condition) => (
            <Paper key={condition._id} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{condition.name}</Typography>
                <Box>
                  <IconButton onClick={() => handleEdit(condition, ActivityType.MEDICAL_CONDITION)} size="small">
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(condition, ActivityType.MEDICAL_CONDITION)} size="small">
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Box>
              </Box>
              <Typography><strong>Description:</strong> {condition.description}</Typography>
              {condition.note && <Typography><strong>Note:</strong> {condition.note}</Typography>}
              {condition.continuedTreatment && <Typography><strong>Continued Treatment:</strong> {condition.continuedTreatment}</Typography>}
              <Typography><strong>Date Diagnosed:</strong> {new Date(condition.dateDiagnosed).toLocaleDateString()}</Typography>
            </Paper>
          ))
        ) : (
          <Typography>No Medical Conditions</Typography>
        )}
      </Box>

      {/* Medications */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Medications:</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {medications.length > 0 ? (
          medications.map((medication) => (
            <Paper key={medication._id} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{medication.name}</Typography>
                <Box>
                  <IconButton onClick={() => handleEdit(medication, ActivityType.MEDICATION)} size="small">
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(medication, ActivityType.MEDICATION)} size="small">
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Box>
              </Box>
              <Typography><strong>Dosage:</strong> {medication.dosage}</Typography>
              {medication.note && <Typography><strong>Note:</strong> {medication.note}</Typography>}
              <Typography>
                <strong>Start Date:</strong> {new Date(medication.startDate).toLocaleDateString()} - 
                <strong> End Date:</strong> {new Date(medication.endDate).toLocaleDateString()}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography>No Medications</Typography>
        )}
      </Box>

      {/* Allergies */}
      <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Allergies:</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
        {allergies.length > 0 ? (
          allergies.map((allergy) => (
            <Paper key={allergy._id} sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{allergy.name}</Typography>
                <Box>
                  <IconButton onClick={() => handleEdit(allergy, ActivityType.ALLERGY)} size="small">
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(allergy, ActivityType.ALLERGY)} size="small">
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </Box>
              </Box>
              <Typography><strong>Treatment:</strong> {allergy.treatment}</Typography>
              {allergy.note && <Typography><strong>Note:</strong> {allergy.note}</Typography>}
              <Typography><strong>Date:</strong> {new Date(allergy.date).toLocaleDateString()}</Typography>
            </Paper>
          ))
        ) : (
          <Typography>No Allergies</Typography>
        )}
      </Box>
    </Box>
  );
};

export default HealthInformationSection;
