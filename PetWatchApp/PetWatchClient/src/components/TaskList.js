import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import { IconButton } from '@mui/material';
import { Add as AddIcon, ArrowRight as ArrowRightIcon } from '@mui/icons-material';
import { addUserTask, updateUserTask } from '../services/userService';
import TaskItem from './TaskItem';
import AddTaskModal from './AddTaskPopup';
import '../styles/TaskList.css';


const TaskList = ({propTasks, token, userId}) => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        console.log('propTasks: ', propTasks);
        setTasks(propTasks);
    }, []);

    const handleAddTask = async (newTask) => {
        try{
            await addUserTask(userId, newTask, token);
            toast.success('Task added successfully!');
            setTasks([...tasks, newTask]);
          } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            }
            toast.error('Failed to adding task. Please try again.');
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleToggleComplete = async (updatedTask) => {
        setTasks(tasks.map(task => 
          task._id === updatedTask._id ? { ...task, completed: !task.completed } : task
        ));

        updatedTask.completed = !updatedTask.completed;
        console.log('updatedTask: ', updatedTask);
        try{
            await updateUserTask(userId, updatedTask, token)
          } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            }
        }
    };

    const navigateToAllTasksPage = () => {
        console.log('navigateToAllTasksPage');
        navigate( '/main/tasks');
    };

    return (
        <div className='tasks-warpper'>
            <div style={{display: 'flex', flexDirection: 'column'}}>
            <div className='header'>
                <h3 >Active Tasks: To-Dos</h3>
                <IconButton onClick={openModal} style={{ color: 'black' }}>
                    <AddIcon />
                </IconButton>
            </div>
            { tasks.length > 0 ?(
                <ul className='tasks-list'>
                    {tasks.map(task => (
                    <TaskItem 
                    key={task._id} 
                    task={task} 
                    onToggleComplete={handleToggleComplete} 
                    />
                    ))}
                </ul>
                )
                :
                <p>No Tasks yet.</p>
            }
            </div>
            
            <div className='footer' onClick={() => navigateToAllTasksPage()}>
                <h4>View all</h4>
                <IconButton>
                    <ArrowRightIcon />
                </IconButton>
            </div>

            <AddTaskModal isOpen={isModalOpen} onClose={closeModal} onAddTask={handleAddTask} />

        </div>
    );
};

export default TaskList;
