import React, {useState} from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../utils/utils';
import { VaccineRecordType } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { formFieldsConfig, FormFieldsType } from '../utils/utils';

const VaccinationRecords = ({ vaccinationRecords, onAdd, onDelete}) => {
    const [vaccineType, setVaccineType] = useState(null);

    const formConfig = vaccineType ? formFieldsConfig(vaccineType)[FormFieldsType.VACCINE_RECORD] : null;
    
    return (
        <Box className="form-section">
            <Typography variant="h5">Section 5: Vaccination Record</Typography>

            {vaccinationRecords.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                        Vaccination Records
                    </Typography>
                    <Box className="activity-section">
                        {vaccinationRecords.map((item, index) => (
                            <Box key={index} className="activity-card">
                                <Box className="activity-card-header">
                                    <Typography variant="subtitle1"><strong>{item.vaccineType}</strong></Typography>
                                    <FontAwesomeIcon 
                                        className="activity-card-icon" 
                                        icon={faTrash} 
                                        onClick={() => onDelete('vaccinationRecord', index)} 
                                    />
                                </Box>
                                <Typography>Date: {formatDate(item.date)}</Typography>
                                <Typography>Next Date: {formatDate(item.nextDate)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            <Typography variant="h6">Add Vaccine:</Typography>
            <Typography>Choose the type of the vaccine</Typography>
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2} className="activity-items-grid">
                    {VaccineRecordType.map((item, idx) => (
                        <Grid 
                            item 
                            xs={6} 
                            sm={4} 
                            md={3} 
                            key={idx} 
                            className="activity-items-card" 
                            onClick={() => setVaccineType(item)}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: 1,
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: '#f5f5f5',
                                },
                            }}
                        >
                            {item.icon && <FontAwesomeIcon className="icon" icon={item.icon} />}
                            <Box component="span">{item.value}</Box>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {vaccineType && formConfig &&(
                <GenericActivityForm
                 title={formConfig.title}
                 fields={formConfig.fields}
                 onSave={(data) => onAdd('vaccinationRecord', data)}
                 onClose={() => setVaccineType(null)}
                 validationRules={formConfig.validationRules}                
                 />
            )}

            <Typography variant="body2" className="optional-section">
                You can add this information later in the pet profile. However, it's important to add all pet info for tracking and analysis.
            </Typography>
        </Box>
    );
};

export default VaccinationRecords;
