import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Button, IconButton, Box, CircularProgress, Typography, Modal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash, faSortUp, faSortDown, faSort, faDownload } from '@fortawesome/free-solid-svg-icons';
import { formatDateUniversal } from '../utils/utils';
import { fetchUserTasks, updateUserTask, deleteUserTask, addUserTask } from '../services/userService';
import { FormFieldsType, formFieldsConfig } from '../utils/utils';
import GenericActivityForm from '../components/GenericActivityForm';

const TaskListPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetchUserTasks(user._id, token);
            console.log(response);
            setTasks(response);
            setLoading(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                setError(true);
                setLoading(false);
                navigate('/login');
            } else {
                console.error('Error fetching data:', error);
                setError(true);
                setLoading(false);
            }
        }
    };

    const handleDialogClose = () => {
        setIsAddTaskDialogOpen(false);
    };

    const handleAddTaskClick = () => {
        setIsAddTaskDialogOpen(true);
    };

    const handleEditClick = (task) => {
        setIsEditMode(true);
        setEditingTask(task);
    };

    const handleCheckboxChange = async (task) => {
        const updatedTask = {
            ...task,
            completed: !task.completed, 
        };
        try {
            await updateUserTask(user._id, updatedTask, token);
            console.log(tasks);
            setTasks(prevTasks => 
                prevTasks.map(t => (t._id === task._id ? updatedTask : t))
            );
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            } else {
                console.error('Error updating task:', error);
            }
        }

    };

    const columns = useMemo(
        () => [
            { Header: '', accessor: 'checkbox', disableSortBy: true, 
                Cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.original.completed}
                        onChange={() => handleCheckboxChange(row.original)}
                    />
                ),
            },
            { Header: 'Create Date', accessor: 'createdAt', Cell: ({ value }) => formatDateUniversal(new Date(value)) },
            { Header: 'Title', accessor: 'title' },
            { Header: 'Description', accessor: 'description' },
            { Header: 'Due Date', accessor: 'dueDate', Cell: ({ value }) => formatDateUniversal(new Date(value)) },
            { Header: 'Actions', accessor: 'actions', disableSortBy: true, Cell: ({ row }) => (
                <div>
                    <IconButton color="primary" onClick={() => handleEditClick(row.original)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteTask(row.original._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                </div>
            ), },
        ],
        []
    );

    const tasksTableInstance = useTable(
        {
            columns,
            data: tasks,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    );


    const handleAddTask = async (newTask) => {
        setIsAddTaskDialogOpen(false);
        try{
            const response = await addUserTask(user._id, newTask, token);
            console.log(response);
            if (response && response.task) {
                toast.success('Task added successfully!');
                setTasks([...tasks, response.task]);
            }
            
          } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            }
            toast.error('Failed to adding task. Please try again.');
        }
    };

    const handleEditTask = async (updatedTask) => {
        setIsEditMode(false);
        setEditingTask(null);

        try {
            await updateUserTask(user._id, updatedTask, token);
            setTasks(prevTasks => 
                prevTasks.map(task => (task._id === updatedTask._id ? updatedTask : task))
            );
            // setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            } else {
                console.error('Error updating task:', error);
            }
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteUserTask(user._id, taskId, token);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            } else {
                console.error('Error deleting task:', error);
            }
        }
    };


    const handleDownload = () => {
        const headers = ["Title", "Description", "Create Date", "Due Date", "Completed"];
        
        // Convert tasks data to CSV format
        const csvRows = tasks.map(task => [
            task.title,
            task.description,
            formatDateUniversal(new Date(task.createdAt)),
            task.dueDate ? formatDateUniversal(new Date(task.dueDate)) : "",
            task.completed ? "Yes" : "No"
        ]);

        // Combine headers and rows into a CSV string
        const csvContent = [
            headers.join(","), 
            ...csvRows.map(row => row.map(item => `"${item}"`).join(","))
        ].join("\n");

        // Create a blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tasks.csv');
        link.click();
    };

    if (loading) {
        return (
            <Box className="loading-container" display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
                <Typography variant="h6" ml={2}>Loading...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="error-container" display="flex" flexDirection="column" alignItems="center">
                <Typography color="error">Failed to fetch user data. Please try again later.</Typography>
                <Button variant="contained" color="primary" onClick={fetchTasks}>Retry</Button>
            </Box>
        );
    }

    const formConfig = isEditMode ? formFieldsConfig(editingTask)[FormFieldsType.TASK] : formFieldsConfig()[FormFieldsType.TASK];


    return (
        <Box style={{padding: '20px', width: '90%', margin: '0 auto'}} >
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}   mb={2}>
                <Typography variant="h4">All Tasks</Typography>
                <Box display="flex" gap="10px">
                    <IconButton color="primary" onClick={handleAddTaskClick}>
                        <FontAwesomeIcon icon={faAdd} />
                    </IconButton>
                    <IconButton color="primary" onClick={handleDownload}>
                        <FontAwesomeIcon icon={faDownload} />
                    </IconButton>
                </Box>
            </Box>
            {tasks.length > 0 ? (
                <Table instance={tasksTableInstance} />
            ) : (
                <Typography>No Tasks yet.</Typography>
            )}

            <Modal open={(isAddTaskDialogOpen && formConfig)} onClose={handleDialogClose}>
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

            <Modal open={(isEditMode && formConfig)} onClose={handleDialogClose}>
                <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', width: '50%', mx: 'auto', my: '10%' }}>
                <GenericActivityForm
                    title= {formConfig.title}
                    fields={formConfig.fields}
                    onSave={(data) => handleEditTask(data)}
                    onClose={() => setIsEditMode(false)}
                    validationRules={formConfig.validationRules}    
                    initialData={editingTask}            
                    />
                </Box>
            </Modal>
        </Box>
    );
};

const Table = ({ instance }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        state: { pageIndex, pageSize },
        previousPage,
        nextPage,
        gotoPage,
        pageCount,
    } = instance;

    const totalItems = instance.rows.length;

    return (
        <>
            <table {...getTableProps()} className='table'>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                column.show !== false && (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            {column.render('Header')}
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <FontAwesomeIcon icon={faSortDown} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faSortUp} />
                                                )
                                            ) : (   
                                                !column.disableSortBy && <FontAwesomeIcon icon={faSort} className="sort" />
                                            )}
                                        </Box>
                                    </th>
                                )
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, i) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography>
                    Showing {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems}
                </Typography>
                <Box display="flex" gap={1}>
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage}>Previous</Button>
                    {pageOptions.map((_, index) => (
                        <Button
                            key={index}
                            onClick={() => gotoPage(index)}
                            variant={pageIndex === index ? 'contained' : 'outlined'}
                        >
                            {index + 1}
                        </Button>
                    ))}
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>Next</Button>
                </Box>
            </Box>
        </>
    );
};

export default TaskListPage;
