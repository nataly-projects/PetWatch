import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faEdit, faTrash, faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskPopup';
import EditTaskModal from '../components/EditTaskModal';
import { formatDateUniversal } from '../utils/utils';
import '../styles/TaskListPage.css';

const TaskListPage = () => {
    const [tasks, setTasks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const location = useLocation();
    useEffect(() => {
        if (location && location.state && location.state.tasks) {
          setTasks(location.state.tasks);
        }
      }, [location.state]); 


    const handleAddTask = (newTask) => {
        setTasks([...tasks, newTask]);
        // Optionally, make an API call to save the new task to the backend
    };

    const handleEditTask = async (updatedTask) => {
        try {
        const response = await fetch(`/api/tasks/${updatedTask._id}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        const data = await response.json();
        setTasks(tasks.map(task => (task._id === data._id ? data : task)));
        setIsEditModalOpen(false);
        } catch (error) {
        console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete task');
        }

        setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
        console.error('Error deleting task:', error);
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

    const columns = useMemo(
        () => [
            { Header: 'Create Date', accessor: 'createdAt', Cell: ({ value }) => formatDateUniversal(new Date(value))},
            { Header: 'Title', accessor: 'title' },
            { Header: 'Description', accessor: 'description' },
            { Header: 'Due Date', accessor: 'dueDate' },
            { Header: 'Actions', accessor: 'actions' },
        ],
        []
    );

    const activityTableInstance = useTable(
        {
            columns,
            data: tasks,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    );

    const eventTableInstance = useTable(
        {
            columns,
            data: tasks,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className='task-list-page'>
        <div className='header'>
            <h3>All Tasks</h3>
            <button className='add-task-button' onClick={openAddModal}>Add Task</button>
        </div>
        {tasks.length > 0 ? (
            <Table instance={activityTableInstance}  />
        )
        :
        <p>No Tasks yet.</p>
        }
        {/* {tasks.length > 0 ? (
            <ul className='task-list'>
            {tasks.map(task => (
                <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <input 
                    type="checkbox" 
                    checked={task.completed} 
                    // onChange={() => onToggleComplete(task)}
                />
                <div>
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p>Due Date: {formatDateUniversal(new Date(task.dueDate))}</p>
                    <button onClick={() => openEditModal(task)}>Edit</button>
                    <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                </div>
                <div>
                    <FontAwesomeIcon icon={faEdit} />
                    <FontAwesomeIcon icon={faTrash} />
                </div>

                </li>
            ))}
            </ul>
        ) : (
            <p>No Tasks yet.</p>
        )} */}
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

const Table = ({ instance, }) => {
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
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between',alignItems: 'center'}}>
                        {column.render('Header')}
                        {column.isSorted ? (
                            column.isSortedDesc ? (
                                <FontAwesomeIcon icon={faSortDown} />
                            ) : (
                                <FontAwesomeIcon icon={faSortUp} />
                            )
                            ) : (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
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
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
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
