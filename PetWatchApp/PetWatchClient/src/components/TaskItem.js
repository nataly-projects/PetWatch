import React from 'react';
import { Checkbox, Typography, Box } from '@mui/material';

const TaskItem = ({ task, onToggleComplete }) => {

  const backgroundColor = task.completed ? '#f5f5f5' : 'white';
  const textDecoration = task.completed ? 'line-through' : 'none';

  return (
    <Box
    component="li"
    sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: backgroundColor,
      borderBottom: '1px solid #ddd',
      '&:hover': {
        backgroundColor: '#f1f1f1',
      },
    }}
  >
      <Checkbox
        checked={task.completed}
        onChange={() => onToggleComplete(task)}
        sx={{
          marginRight: '15px',
          color: task.completed ? '#4caf50' : '#1976d2',
          '&.Mui-checked': {
            color: '#4caf50',
          },
        }}
      />
      <Typography
        variant="body1"
        sx={{
          textDecoration: textDecoration,
          flexGrow: 1,
        }}
      >
        {task.title}
      </Typography>
      {!task.completed && task.dueDate && (
        <Typography
          variant="body2"
          sx={{
            color: 'red',
            fontStyle: 'italic',
            marginLeft: '10px',
          }}
        >
          — Overdue in {Math.round((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24))} days
        </Typography>
      )}
    </Box>
  );
};

export default TaskItem;
