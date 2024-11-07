import React, {useState} from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { formFieldsConfig, FormFieldsType } from '../utils/utils';

const VetVisits = ({vetVisitsRecord, onAdd, onDelete}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    console.log(formFieldsConfig()[FormFieldsType.VET_VISIT]);

     const formConfig = formFieldsConfig()[FormFieldsType.VET_VISIT];
    
     const toggleAddForm = () => {
        setShowAddForm((prev) => (!prev));
    };

    return (
        <Box className="form-section">
            <Typography variant="h5">Section 8: Vet Visits Record</Typography>

            {vetVisitsRecord.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                        Vet Visits Records
                    </Typography>
                    <Box className="activity-section">
                        {vetVisitsRecord.map((item, index) => (
                            <Box key={index} className="activity-card" sx={{ mb: 2 }}>
                                <Box
                                    className="activity-card-header"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Typography variant="subtitle1"><strong>{item.reason}</strong></Typography>
                                    <FontAwesomeIcon
                                        className="activity-card-icon"
                                        icon={faTrash}
                                        onClick={() => onDelete('vetVisitsRecord', index)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Box>
                                {item.examination && <Typography>Examination: {item.examination}</Typography>}
                                <Typography>Date: {formatDate(item.date)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            <Typography variant="h6">Add Vet Visit:</Typography>
            <Button variant="contained" onClick={toggleAddForm}>
                Add new vet visit
            </Button>

            {showAddForm && formConfig && (
                <GenericActivityForm
                title="Add Vet Visit"
                fields={formConfig.fields}
                onSave={(data) => onAdd('vetVisitsRecord', data)}
                 onClose={toggleAddForm}
                validationRules={formConfig.validationRules}                   
                />
            )}

            <Typography variant="body2" className="optional-section">
                You can add this information later in the pet profile. However, it's important to add all pet info for tracking and analysis.
            </Typography>
        </Box>
    );
};

export default VetVisits;
