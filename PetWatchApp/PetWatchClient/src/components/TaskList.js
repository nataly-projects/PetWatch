import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import { IconButton, Typography, Box, Modal } from '@mui/material';
import { Add as AddIcon, ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import { addUserTask, updateUserTask } from '../services/userService';
import TaskItem from './TaskItem';
import { FormFieldsType, formFieldsConfig } from '../utils/utils';
import GenericActivityForm from '../components/GenericActivityForm';
import useApiActions from '../hooks/useApiActions';

const TaskList = ({propTasks, token, userId}) => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

    const { execute, loading, error: apiError } = useApiActions();

    useEffect(() => {
        setTasks(propTasks);
    }, []);

    const handleAddTask = async (newTask) => {
        try {
            await execute(userId, newTask, token);
            toast.success('Task added successfully!');
            setTasks([...tasks, newTask]);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            }
            toast.error('Failed to add task. Please try again.');
        }
    };

    const handleDialogClose = () => {
        setIsAddTaskDialogOpen(false);
    };

    const handleAddTaskClick = () => {
        setIsAddTaskDialogOpen(true);
    };

    const handleToggleComplete = async (updatedTask) => {
        setTasks(tasks.map(task =>
            task._id === updatedTask._id ? { ...task, completed: !task.completed } : task
        ));

        updatedTask.completed = !updatedTask.completed;
        try {
            await execute(updateUserTask, [userId, updatedTask, token]);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            }
        }
    };

    const navigateToAllTasksPage = () => {
        navigate('/main/tasks');
    };

    const formConfig = formFieldsConfig()[FormFieldsType.TASK];

    return (
        <Box sx={{ padding: 2, width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff',
            border: '1px solid #ccc', justifyContent: 'space-between', flex: '1' }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="h5">Active Tasks: To-Dos</Typography>
                <IconButton onClick={handleAddTaskClick} color="primary">
                    <AddIcon />
                </IconButton>
            </Box>

            {tasks.length > 0 ? (
                <Box component="ul" sx={{ listStyle: 'none', padding: 0 }}>
                    {tasks.map(task => (
                        <TaskItem 
                            key={task._id} 
                            task={task} 
                            onToggleComplete={handleToggleComplete} 
                        />
                    ))}
                </Box>
            ) : (
                <Typography variant="body1" sx={{ color: 'gray' }}>No Tasks yet.</Typography>
            )}

            <Box 
                sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    cursor: 'pointer', 
                }} 
                onClick={navigateToAllTasksPage}
            >
                <Typography variant="h6" >View all</Typography>
                <IconButton >
                    <ArrowRightIcon />
                </IconButton>
            </Box>

            <Modal open={(isAddTaskDialogOpen)} onClose={handleDialogClose}>
                <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', width: '50%', mx: 'auto', my: '10%' }}>
                    <GenericActivityForm
                        title= {formConfig.title}
                        fields={formConfig.fields}
                        onSave={(data) => handleAddTask(data)}
                        onClose={handleDialogClose}
                        validationRules={formConfig.validationRules}                
                    />
                </Box>
            </Modal>
        </Box>
    );
};

export default TaskList;
