import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import { Pie } from 'react-chartjs-2'; 
import { formatDate } from '../utils/utils';
import { Currency } from '../utils/utils';
import FilterSection from './FilterSection';
import { ExpensesType } from '../utils/utils';
import ExportToCSVButton from './ExportToCSVButton';
import '../styles/ExpenseTracker.css';

const ExpenseTracker = ({expenses, from, petName}) => {
    const currencySign = Currency[useSelector((state) => state.user.currency)].sign;

    const location = useLocation();
    console.log('loaction: ', location);
    if(location.pathname && location.pathname === "/main/expenses") {
        expenses = location.state.expenses;
        from = location.state.from;
    }

    const [categoryFilter, setCategoryFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [minAmountFilter, setMinAmountFilter] = useState('');

    const handleCategoryChange = (event) => setCategoryFilter(event.target.value);
    const handleStartDateChange = (event) => setStartDateFilter(event.target.value);
    const handleEndDateChange = (event) => setEndDateFilter(event.target.value);
    const handleMinAmountChange = (event) => setMinAmountFilter(event.target.value);


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

    const filteredExpenses = allExpenses.filter((expense) => {
        console.log('expense: ', expense);
        const expenseDate = new Date(expense.date);
        const startDate = startDateFilter ? new Date(startDateFilter) : null;
        const endDate = endDateFilter ? new Date(endDateFilter) : null;
        const minAmount = minAmountFilter ? parseFloat(minAmountFilter) : null;

        return (!categoryFilter || expense.category === categoryFilter) &&
            (!startDate || expenseDate >= startDate.setHours(0, 0, 0, 0)) &&
            (!endDate || expenseDate <= endDate.setHours(23, 59, 59, 999)) &&
            (!minAmount || expense.amount >= minAmount);
    });

    const exportToCSV = () => {
        const processedData = filteredExpenses.map(item => ({
            Amount: item.amount,
            Category: item.category,
            Pet: petName == null ? (item.petId?.name || item.pet?.name) : petName,
            Date: formatDate(item.created_at),
          }));
        return processedData;
    };

    const renderExpensesTable = () => {
        return (
            (allExpenses.length > 0 ?
                <>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            {from === 'user' && <th>Pet Name</th>}
                            <th>Category</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map(expense => (
                            <tr key={expense._id}>
                                <td>{formatDate(expense.date)}</td>
                                {from === 'user' && <td>{expense.pet.name}</td>}
                                <td>{expense.category}</td>
                                <td>{expense.amount.toFixed(2)} {currencySign}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ExportToCSVButton className='btn'
                petName={petName}
                data={exportToCSV()} 
                filename={petName == null ? "expenses.csv" : petName +"-expenses.csv"}
                isExpense={true}
                />
                </>
                :
                <p>No expenses yet.</p>
            )
        );
    };

    const renderPetExpensesDataChart = () => {
        const { petExpensesData } = expenses;
        return (
            <div className='chart-container'>
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
            </div>
        );
    }

    return (
        <div className="expense-tracker">
            <h3>{from === 'user' ? 'Your Expense Tracker': 'Expenses' }</h3>
            { allExpenses.length > 0 && <FilterSection
                filterType={categoryFilter}
                handleTypeChange={handleCategoryChange}
                startDate={startDateFilter}
                handleStartDateChange={handleStartDateChange}
                endDate={endDateFilter}
                handleEndDateChange={handleEndDateChange}
                category={categoryFilter}
                handleCategoryChange={handleCategoryChange}
                minAmount={minAmountFilter}
                handleMinAmountChange={handleMinAmountChange}
                selectOptions={ExpensesType}
                isExpenseFilter={true}
            />}
            {renderExpensesTable()}
            { allExpenses.length > 0 ?
            <div className="charts-row">
                <div className="chart-container">
                    {from === 'user' ? renderPetExpensesDataChart() : null}
                </div>

                <div className="chart-container">
                    <h3>Chart Expenses By Monthly</h3>
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
                    <h3>Chart Expenses By Category</h3>
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
            :
            <></>
            }  
        </div>
    );
};

export default ExpenseTracker;
