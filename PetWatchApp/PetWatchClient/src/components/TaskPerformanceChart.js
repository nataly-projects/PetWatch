import React, { useState, useEffect } from 'react';
import { RadialBarChart, RadialBar, Legend, Tooltip } from 'recharts';
import '../styles/TaskPerformanceChart.css';


const TaskPerformanceChart = ({tasks}) => {
    console.log('tasks: ', tasks);
    const [data, setData] = useState([]);
    const [assigned, setAssigned] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (tasks.length > 0) {
            // Process tasks to get counts for "Assigned", "Completed", and "Active"
            const assignedCount  = tasks.length;
            const completedCount  = tasks.filter(task => task.completed === true).length;
            const activeCount  = tasks.filter(task => task.completed === false).length;

            // Set counts
            setAssigned(assignedCount);
            setCompleted(completedCount);
            setActive(activeCount);
    
            // Set data for the RadialBarChart
            setData([
                { name: 'Assigned', value: assignedCount, fill: '#007bff' },
                { name: 'Completed', value: completedCount, fill: 'green' },
                { name: 'Active', value: activeCount, fill: 'darkblue' }
            ]);
        }
    }, [tasks]);

    const getPercentage = (count, total) => {
        return total > 0 ? ((count / total) * 100) : 0;
    };

  return (
    <div className='tasks-chart-container'>
      <h3 className='chart-title'>Tasks Performance</h3>
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
        {/* <Legend
          iconSize={10}
          width={120}
          height={140}
          layout='vertical'
          verticalAlign='middle'
          wrapperStyle={style}
        /> */}
        <Tooltip />
       
      </RadialBarChart>
      <div className='info'>
        <span><span className="dot assigned"></span> {getPercentage(assigned, assigned)}% Assigned</span>
        <span><span className="dot completed"></span> {getPercentage(completed, assigned)}% Completed</span>
        <span><span className="dot active"></span> {getPercentage(active, assigned)}% Active</span>
      </div>
    </div>
  );
};

export default TaskPerformanceChart;
