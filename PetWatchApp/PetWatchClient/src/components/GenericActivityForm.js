import React, { useState } from 'react';
import { Box, Typography, TextField, Button, IconButton, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/system';

const Container = styled(Box)({
  padding: '20px',
  border: '1px solid #795B4A',
  borderRadius: '10px',
  marginTop: '5px',
  '& .input-container': {
    marginBottom: '15px',
  },
  '& .header': {
    display: 'flex',
    gap: '10px',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  '& .close-btn': {
    cursor: 'pointer',
  },
  '& .optional-section': {
    marginTop: '10px',
    fontSize: '0.9em',
    color: '#666',
  },
});

const GenericActivityForm = ({ title, fields, onSave, onClose, initialData = {}, validationRules = {}, showHeader = true }) => {
    const [formData, setFormData] = useState(() => {
        // Initialize formData with field values or defaults
        return fields.reduce((acc, field) => {
          acc[field.name] = field.value || initialData[field.name] || '';
          return acc;
        }, {});
      });
    const [errors, setErrors] = useState({});
    
    const handleInputChange = (field, value) => {
        setFormData((prevData) => {
            const updatedData = { ...prevData, [field]: value };
            return updatedData;
        });
    };

    const validateInputs = () => {
        const validationErrors = {};
        for (const field in validationRules) {
            if (!formData[field]) {
                validationErrors[field] = `${validationRules[field]} is required`;
            }
        }
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave(formData);
        }
    };

    return (
        <Container>
            {showHeader &&  
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h5">{title}</Typography>
                <IconButton onClick={onClose} >
                    <FontAwesomeIcon icon={faTimes} />
                </IconButton>
            </Box> 
            }   

            {fields.map((field) => (
                <Box key={field.name} >
                    <Typography >{field.label}</Typography> 
                    {field.type === 'radio' ? (
                         <RadioGroup
                         value={formData[field.name] || ''}
                         onChange={(e) => handleInputChange(field.name, e.target.value)}
                     >
                         {field.options.map((option) => (
                             <FormControlLabel
                                 key={option.value}
                                 value={option.value}
                                 control={<Radio />}
                                 label={option.label}
                             />
                         ))}
                     </RadioGroup>
                 ) : (
                    <TextField
                        fullWidth
                        variant="outlined"
                        type={field.type}
                        value={formData[field.name] || ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                        placeholder={field.placeholder}
                        multiline={field.type === 'textarea'}
                        minRows={field.type === 'textarea' ? 3 : 1}
                        error={!!errors[field.name]}
                        helperText={errors[field.name]}
                    />
                 )}
                </Box>
            ))}

            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                Save
            </Button>
        </Container>
    );
};

export default GenericActivityForm;
