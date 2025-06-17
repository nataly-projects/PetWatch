import React from 'react';
import { Chart, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from 'react-chartjs-2';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { formatDateUniversal } from '../utils/utils';

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

const WeightTracker = ({ weightUpdateLogs }) => {
  const dates = weightUpdateLogs.map(log => formatDateUniversal(new Date(log.created_at)));

  const weights = weightUpdateLogs.map(log => {
    const weightString = log.details.match(/\d+/); 
    return weightString ? parseInt(weightString[0]) : null; 
  });

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Weight',
        data: weights,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: { align: 'start' },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const renderWeightTrackLogTable = () => (
    weightUpdateLogs.length > 0 ? (
        <Table aria-label="weight log table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Action Type</strong></TableCell>
              <TableCell><strong>Details</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weightUpdateLogs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{formatDateUniversal(new Date(log.created_at))}</TableCell>
                <TableCell>{log.actionType}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    ) : (
      <Typography>No Weight activity logs yet.</Typography>
    )
  );

  return (
    <Box sx={{ backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>Weight Tracker</Typography>
      {renderWeightTrackLogTable()}
      <Typography variant="h5" gutterBottom>Weight Changes Over Time</Typography>
      <Box sx={{ width: 500, height: 300 }}>
        <Bar data={data} options={options} />
      </Box>
    </Box>
  );
};

export default WeightTracker;
