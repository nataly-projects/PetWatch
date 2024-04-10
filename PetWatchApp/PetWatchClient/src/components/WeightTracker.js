import React from 'react';
import { Chart, CategoryScale,LinearScale,BarController, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar  } from 'react-chartjs-2';
import { formatDate } from '../utils/utils';

const WeightTracker = ({ weightUpdateLogs }) => {
  Chart.register( CategoryScale,LinearScale,BarController, BarElement, Title, Tooltip, Legend); 

  const dates = weightUpdateLogs.map(log => new Date(log.created_at).toLocaleDateString());

  const weights = weightUpdateLogs.map(log => {
    const weightString = log.details.match(/\d+/); // Extracts digits from the string
    return weightString ? parseInt(weightString[0]) : null; // Parses the first matched digits as an integer
  });

  // Structure data for the bar graph
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Weight',
        data: weights,
        backgroundColor: 'rgba(54, 162, 235, 0.2)', 
        borderColor: 'rgba(54, 162, 235, 1)', 
        borderWidth: 1
      }
    ]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true // Start the y-axis at 0
      }
    }
  };


    const renderWeightTrackLogTable = () => {
      return (
        (weightUpdateLogs.length > 0 ? 
          <table className='table'>
               <thead>
                   <tr>
                   <th>Date</th>
                   <th>Action Type</th>
                   <th>Details</th>
                   </tr>
               </thead>
               <tbody>
                   {weightUpdateLogs.map(log => (
                       <tr key={log._id}>
                           <td>{formatDate(log.created_at)}</td>
                           <td>{log.actionType}</td>
                           <td>{log.details}</td>
                       </tr>
                   ))}
               </tbody>
           </table>
           : 
           <p>No Weight activity logs yet.</p>
        )
      );
    }

    return (
      <div>
        <h2>Weight Tracker Activity Log</h2>
        {renderWeightTrackLogTable()}
        <h2>Weight Changes Over Time</h2>
        <Bar data={data} options={options} />
      </div>
    );
  
};

export default WeightTracker;
