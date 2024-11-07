import React from 'react';
import { Checkbox } from '@mui/material';
import '../styles/TaskList.css';

const TaskItem = ({ task, onToggleComplete  }) => {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
       <Checkbox
        checked={task.completed}
        onChange={() => onToggleComplete(task)}
      />
      <span>{task.title}</span>
      {task.dueDate && <span className='overdue'> — Overdue in {Math.round((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days</span>}
    </li>
  );
};

export default TaskItem;
