import React, { useState, useEffect, useRef }  from 'react';
import { useSelector } from 'react-redux';
import { fetchUserExpensesArray } from '../services/userService';
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import { Pie } from 'react-chartjs-2'; 
import '../styles/ExpenseTracker.css';

const ExpenseTracker = () => {
    Chart.register(ArcElement, Tooltip, Legend);
    const user = useSelector((state) => state.user);
    const [expenses, setExpenses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const pieChartOptions = { 
        plugins: {
            legend: {
                position: 'top', 
            },
            tooltip: {
                enabled: true, 
            },
        },
        responsive: true,
        maintainAspectRatio: false
     };

     const fetchData = async () => {
        try {
          const data = await fetchUserExpensesArray(user._id);
          console.log('data: ', data);
          setExpenses(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching expense data:', error);
          setError(true);
          setLoading(false);
        }
      };

    useEffect(() => {
        fetchData();
    }, [user._id]);

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
            <div>
                <p>Failed to fetch expense data. Please try again later.</p>
                <button onClick={fetchData}>Retry</button>
            </div>
        );
    }

    const { allUserExpenses, petExpensesData, monthlyExpensesChartData, categoryExpensesChartData } = expenses;

    const renderExpensesTable = () => {
        return (
            <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Pet Name</th>
                    <th>Category</th>
                    <th>Amount</th>
                </tr>
            </thead>
            <tbody>
                {allUserExpenses.map(expense => (
                    <tr key={expense._id}>
                        <td>{expense.date}</td>
                        <td>{expense.pet.name}</td>
                        <td>{expense.category}</td>
                        <td>${expense.amount.toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        );
       
    };

    return (
        <div className="expense-tracker">
            <h2>Expense Tracker</h2>
            {renderExpensesTable()}
            <div className="chart-container">
                <h2>Chart Expenses By Pet</h2>
                <div className="chart-wrapper">
                    <Pie data={{
                        labels: petExpensesData.map(item => item.petName),
                        datasets: [{
                        label: 'Total Expenses',
                        data: petExpensesData.map(item => item.totalExpenses),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                        }]
                    }}
                    options={pieChartOptions}
                     />
                </div>
            </div>
            

            <div className="chart-container">
                <h2>Chart Expenses By Monthly</h2>
                <div className="chart-wrapper">
                    <Pie data={{
                        labels: monthlyExpensesChartData.map(item => item.month),
                        datasets: [{
                        label: 'Total Expenses',
                        data: monthlyExpensesChartData.map(item => item.amount),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                        }]
                    }} 
                    options={pieChartOptions}/>
                </div>
            </div>

            <div className="chart-container">
                <h2>Chart Expenses By Category</h2>
                    <div className="chart-wrapper">
                    <Pie data={{
                        labels: categoryExpensesChartData.map(item => item.category),
                        datasets: [{
                        label: 'Total Expenses',
                        data: categoryExpensesChartData.map(item => item.amount),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                        }]
                    }}
                    options={pieChartOptions} />
                </div>
            </div>

        </div>
    );
};

export default ExpenseTracker;
