import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const TaskModal = ({ isOpen, onClose, onSubmit, task, isEditMode }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEditMode && task) {
            setTitle(task.title || '');
            setDescription(task.description || '');
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        } else {
            setTitle('');
            setDescription('');
            setDueDate('');
        }
    }, [task, isEditMode]);

    const validateInputs = () => {
        const validationErrors = {};
        if (!title) validationErrors.title = 'Title is required';
        if (!description) validationErrors.description = 'Description is required';
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateInputs()) {
            onSubmit({ title, description, dueDate });
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {isEditMode ? 'Edit Task' : 'Add New Task'}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        error={!!errors.title}
                        helperText={errors.title}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        error={!!errors.description}
                        helperText={errors.description}
                        fullWidth
                        multiline
                        rows={3}
                        required
                    />
                    <TextField
                        label="Due Date"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {isEditMode ? 'Save Changes' : 'Add Task'}
                </Button>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskModal;
