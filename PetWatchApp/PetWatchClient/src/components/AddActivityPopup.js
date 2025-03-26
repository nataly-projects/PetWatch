import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Grid, Box, Typography, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActivityTypeObject, ExpenseCategory, RoutineCareActivityItems, VaccineRecordType } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { formFieldsConfig, FormFieldsType } from '../utils/utils';

const AddActivityPopup = ({ onActivitySelect, onClose }) => {
    const [activities, setActivities] = useState({ selected: null, nested: null, expanded: null });

    const handleActivityClick = (activity) => {
            const itemsMap = {
                VACCINE_RECORD: VaccineRecordType,
                ROUTINE_CARE: RoutineCareActivityItems,
                EXPENSE: ExpenseCategory,
            };
            setActivities({
                selected: activity,
                nested: null,
                expanded: activity.items ? itemsMap[activity.name] || null : null,
            });
    };

    const handleNestedItemClick = (item) => {
        setActivities((prev) => ({ ...prev, nested: item }));
    };

    const handleSave = (data) => {
        let updatedData = { ...data };
        if (activities.nested) {
            const fieldMap = {
                EXPENSE: 'category',
                ROUTINE_CARE: 'activity',
                VACCINE_RECORD: 'vaccineType',
            };
            const fieldName = fieldMap[activities.selected.name];
            if (fieldName) updatedData[fieldName] = activities.nested.name;
        }
        onActivitySelect(activities.selected, updatedData);
        onClose();
    };
    
    const formConfig = activities.selected 
        ? formFieldsConfig(activities.nested || {})[FormFieldsType[activities.selected.name]]
        : null;

    const dialogTitle = activities.selected 
    ? activities.nested 
        ? `Add record for ${activities.selected.value}: ${activities.nested.value}`
        : `Add ${activities.selected.value}`
    : 'Choose Activity to Add';
    
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
            {!activities.selected ? (
                    <Grid container spacing={2}>
                        {ActivityTypeObject.map((activity, index) => (
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
                ) : !activities.nested && activities.expanded ? (
                    <Grid container spacing={2}>
                        {activities.expanded.map((item, index) => (
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
                    formConfig && ( <GenericActivityForm
                        title={formConfig.title}
                        fields={formConfig.fields}
                        validationRules={formConfig.validationRules}
                        onSave={handleSave}
                        onClose={onClose}
                        showHeader={false}
                    />
                    )
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AddActivityPopup;
