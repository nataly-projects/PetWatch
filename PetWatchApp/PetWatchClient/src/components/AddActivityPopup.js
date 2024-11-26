import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Grid, Box, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActivityTypeObject, ExpenseCategory, RoutineCareActivityItems, VaccineRecordType } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { formFieldsConfig, FormFieldsType } from '../utils/utils';

const AddActivityPopup = ({ onActivitySelect, onClose }) => {
    const [initialItems, setInitialItems] = useState(ActivityTypeObject);
    const [expandedItems, setExpandedItems] = useState(null);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [selectedNestedActivity, setSelectedNestedActivity] = useState(null);

    const handleActivityClick = (activity) => {
        if (activity.items) {
            const itemsMap = {
                VACCINE_RECORD: VaccineRecordType,
                ROUTINE_CARE: RoutineCareActivityItems,
                EXPENSE: ExpenseCategory,
            };
            setExpandedItems(itemsMap[activity.name] || null);
            setSelectedActivity(activity);
        } else {
            setSelectedActivity(activity);
            setExpandedItems(null);
        }
    };

    const handleNestedItemClick = (item) => {
        setSelectedNestedActivity(item);
    };

    const handleSave = (data) => {
        onActivitySelect(selectedActivity, data);
        onClose();
    };
    
    const getFormFields = () => {
        return formFieldsConfig(selectedNestedActivity ? selectedNestedActivity : {})[FormFieldsType[selectedActivity.name]];
    };

    const formConfig = selectedActivity ? getFormFields() : null;
    const dialogTitle = selectedActivity ? (selectedNestedActivity ? `Add record for ${selectedActivity.value}: ${selectedNestedActivity.value}` :  `Add ${selectedActivity.value}`) : 'Choose Activity to Add';
    
    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{dialogTitle}</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
            {!selectedActivity ? (
                    <Grid container spacing={2}>
                        {initialItems.map((activity, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                                <Paper
                                    onClick={() => handleActivityClick(activity)}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: 2,
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: 'grey.200' },
                                    }}
                                >
                                    <FontAwesomeIcon icon={activity.icon} size="2x" />
                                    <Typography mt={1}>{activity.value}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : !selectedNestedActivity && expandedItems ? (
                    <Grid container spacing={2}>
                        {expandedItems.map((item, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                                <Paper
                                    onClick={() => handleNestedItemClick(item)}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        padding: 2,
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: 'grey.200' },
                                    }}
                                >
                                    {item.icon && <FontAwesomeIcon icon={item.icon} size="2x" />}
                                    <Typography mt={1}>{item.value}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <GenericActivityForm
                        title={formConfig.title}
                        fields={formConfig.fields}
                        validationRules={formConfig.validationRules}
                        onSave={handleSave}
                        onClose={onClose}
                        showHeader={false}
                    />
                    )
                }
            </DialogContent>
        </Dialog>
    );
};

export default AddActivityPopup;
