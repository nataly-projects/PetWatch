import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash, faSortUp, faSortDown, faSort, faDownload } from '@fortawesome/free-solid-svg-icons';
import AddTaskModal from '../components/AddTaskPopup';
import EditTaskModal from '../components/EditTaskModal';
import { formatDateUniversal } from '../utils/utils';
import { fetchUserTasks, updateUserTask, deleteUserTask } from '../services/userService';
import '../styles/TaskListPage.css';

const TaskListPage = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const [tasks, setTasks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetchUserTasks(user._id, token);
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

    const columns = useMemo(
        () => [
            { Header: '', accessor: 'checkbox', disableSortBy: true, 
                Cell: ({ row }) => (
                    <input
                        type="checkbox"
                        checked={row.original.completed}
                        // onChange={() => handleToggleComplete(row.original)}
                    />
                ),
            },
            { Header: 'Create Date', accessor: 'createdAt', Cell: ({ value }) => formatDateUniversal(new Date(value)) },
            { Header: 'Title', accessor: 'title' },
            { Header: 'Description', accessor: 'description' },
            { Header: 'Due Date', accessor: 'dueDate', Cell: ({ value }) => formatDateUniversal(new Date(value)) },
            { Header: 'Actions', accessor: 'actions', disableSortBy: true, Cell: ({ row }) => (
                <div>
                    <FontAwesomeIcon
                        icon={faEdit}
                        onClick={() => openEditModal(row.original)}
                        style={{ cursor: 'pointer', marginRight: '10px' }}
                    />
                    <FontAwesomeIcon
                        icon={faTrash}
                        onClick={() => handleDeleteTask(row.original._id)}
                        style={{ cursor: 'pointer' }}
                    />
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

    const handleAddTask = (newTask) => {
        setTasks([...tasks, newTask]);
        // Optionally, make an API call to save the new task to the backend
    };

    const handleEditTask = async (updatedTask) => {
        try {
            await updateUserTask(user._id, updatedTask, token)
            setTasks(tasks.map(task => (task._id === updatedTask._id ? updatedTask : task)));
            setIsEditModalOpen(false);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('UNAUTHORIZED_ERROR');
                navigate('/login');
            } else {
                console.error('Error updated task:', error);
            }
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await deleteUserTask(user._id, taskId);
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

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const openEditModal = (task) => {
        setCurrentTask(task);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='error-container'>
                <p>Failed to fetch user data. Please try again later.</p>
                <button className='btn' onClick={fetchTasks}>Retry</button>
            </div>
        );
    }

    return (
        <div className='task-list-page'>
            <div className='header'>
                <h3>All Tasks</h3>
                {/* <button className='add-task-button' onClick={openAddModal}>Add Task</button> */}
                <div style={{display: 'flex', gap: '10px', cursor: 'pointer'}}>
                    <FontAwesomeIcon icon={faAdd} onClick={openAddModal}/>
                    <FontAwesomeIcon icon={faDownload} />
                </div>
              
            </div>
            {tasks.length > 0 ? (
                <Table instance={tasksTableInstance} />
            ) : (
                <p>No Tasks yet.</p>
            )}
            <AddTaskModal isOpen={isAddModalOpen} onClose={closeModal} onAddTask={handleAddTask} />
            <EditTaskModal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                task={currentTask}
                onEditTask={handleEditTask}
            />
        </div>
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
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {column.render('Header')}
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <FontAwesomeIcon icon={faSortDown} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faSortUp} />
                                                )
                                            ) : (   
                                                column.disableSortBy ? null : 
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <FontAwesomeIcon icon={faSort} className="sort" />
                                                </div>
                                            )}
                                        </div>
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
            <div className="pagination">
                <span className="pagination-info">
                    Showing: {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems}
                </span>
                <div className="pagination-controls">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </button>
                    {pageOptions.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => gotoPage(index)}
                            className={pageIndex === index ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default TaskListPage;
