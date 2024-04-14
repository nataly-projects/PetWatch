import React from 'react';
import { useLocation } from 'react-router-dom';
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import { Pie } from 'react-chartjs-2'; 
import { formatDate } from '../utils/utils';
import '../styles/ExpenseTracker.css';

const ExpenseTracker = ({expenses, from}) => {
    const location = useLocation();
    console.log('loaction: ', location);
    if(location.pathname && location.pathname == "/main/expenses") {
        expenses = location.state.expenses;
        from = location.state.from;
    }

    
    Chart.register(ArcElement, Tooltip, Legend);


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

     
    const {  allExpenses, monthlyExpensesChartData, categoryExpensesChartData } = expenses;

    const renderExpensesTable = () => {
        return (
            (allExpenses.length > 0 ?
                <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        {from == 'user' && <th>Pet Name</th>}
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {allExpenses.map(expense => (
                        <tr key={expense._id}>
                            <td>{formatDate(expense.date)}</td>
                            {from == 'user' && <td>{expense.pet.name}</td>}
                            <td>{expense.category}</td>
                            <td>${expense.amount.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
                :
                <p>No expenses yet.</p>
            )
  
        );
       
    };

    const renderPetExpensesDataChart = () => {
        const { petExpensesData } = expenses;
        return (
            <>
            <h3>Chart Expenses By Pet</h3>
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
            </>
        );
    }

    return (
        <div className="expense-tracker">
            <h3>{from == 'user' ? 'Your Expense Tracker': 'Expenses' }</h3>

            {renderExpensesTable()}
            { allExpenses.length > 0 ?
            <>
                <div className="chart-container">
            {from == 'user' ? renderPetExpensesDataChart() : null}
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
            </>
            :
            <></>
            }
         

        </div>
    );
};

export default ExpenseTracker;
