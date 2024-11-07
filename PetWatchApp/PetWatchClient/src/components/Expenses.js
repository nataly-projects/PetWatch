import React, {useState} from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { ExpenseCategory } from '../utils/utils';
import { formatDate } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { formFieldsConfig, FormFieldsType } from '../utils/utils';

const Expenses= ({expensesRecord, onAdd, onDelete}) => {
    const [expenseType, setExpenseType] = useState(null);

    const formConfig = expenseType ? formFieldsConfig(expenseType)[FormFieldsType.EXPENSE] : null;

    return (
        <Box className="form-section">
            <Typography variant="h5">Section 7: Expenses Record</Typography>

            {expensesRecord.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                        Expenses Records
                    </Typography>
                    <Box className="activity-section">
                        {expensesRecord.map((item, index) => (
                            <Box key={index} className="activity-card">
                                <Box
                                    className="activity-card-header"
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <Typography variant="subtitle1"><strong>{item.category}</strong></Typography>
                                    <FontAwesomeIcon
                                        className="activity-card-icon"
                                        icon={faTrash}
                                        onClick={() => onDelete('expensesRecord', index)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Box>
                                <Typography>Amount: {item.amount}</Typography>
                                <Typography>Date: {formatDate(item.date)}</Typography>
                            </Box>
                        ))}
                    </Box>
                </>
            )}

            <Typography variant="h6">Add Expense:</Typography>
            <Typography>Choose the type of the expense</Typography>
            <Box sx={{ padding: 2 }}>
                <Grid container spacing={2} className="activity-items-grid">
                    {ExpenseCategory.map((item, idx) => (
                        <Grid 
                            item 
                            xs={6} 
                            sm={4} 
                            md={3} 
                            key={idx} 
                            className="activity-items-card" 
                            onClick={() => setExpenseType(item)}
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

            {expenseType && formConfig && (
                <GenericActivityForm
                title={formConfig.title}
                fields={formConfig.fields}
                 onSave={(data) => onAdd('expensesRecord', data)}
                 onClose={() => setExpenseType(null)}
                 validationRules={formConfig.validationRules}                
                 />
            )}

            <Typography variant="body2" className="optional-section">
                You can add this information later in the pet profile. However, it's important to add all pet info for tracking and analysis.
            </Typography>
        </Box>
    );
};

export default Expenses;
