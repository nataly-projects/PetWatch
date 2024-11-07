import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Tooltip } from 'recharts';
import { Box, Typography } from '@mui/material';

const TaskPerformanceChart = ({ tasks }) => {
  const [data, setData] = useState([]);
  const [assigned, setAssigned] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (tasks.length > 0) {
      const assignedCount = tasks.length;
      const completedCount = tasks.filter((task) => task.completed).length;
      const activeCount = tasks.filter((task) => !task.completed).length;

      setAssigned(assignedCount);
      setCompleted(completedCount);
      setActive(activeCount);

      setData([
        { name: 'Assigned', value: assignedCount, fill: '#007bff' },
        { name: 'Completed', value: completedCount, fill: 'green' },
        { name: 'Active', value: activeCount, fill: 'darkblue' },
      ]);
    }
  }, [tasks]);

  const getPercentage = (count, total) => {
    return total > 0 ? ((count / total) * 100).toFixed(2) : 0;
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        boxShadow: 2,
        border: '1px solid #ccc',
        p: 3,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'text.primary' }}>
        Tasks Performance
      </Typography>
      <RadialBarChart
        width={500}
        height={300}
        cx={150}
        cy={150}
        innerRadius={20}
        outerRadius={140}
        barSize={10}
        data={data}
      >
        <RadialBar
          minAngle={15}
          label={{ position: 'insideStart', fill: '#fff' }}
          background
          clockWise
          dataKey="value"
        />
        <Tooltip />
      </RadialBarChart>
      <Box
        sx={{
          fontSize: '1rem',
          mt: 3,
          borderTop: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-around',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ bgcolor: '#007bff', width: 10, height: 10, borderRadius: '50%', mr: 1 }} />
          <Typography>{getPercentage(assigned, assigned)}% Assigned</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ bgcolor: 'green', width: 10, height: 10, borderRadius: '50%', mr: 1 }} />
          <Typography>{getPercentage(completed, assigned)}% Completed</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ bgcolor: 'darkblue', width: 10, height: 10, borderRadius: '50%', mr: 1 }} />
          <Typography>{getPercentage(active, assigned)}% Active</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskPerformanceChart;
