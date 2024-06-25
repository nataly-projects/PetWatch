import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Currency } from '../utils/utils';
import FilterSection from './FilterSection';
import { ExpensesType } from '../utils/utils';
import ExportToCSVButton from './ExportToCSVButton';
import { formatDateUniversal } from '../utils/utils';
import '../styles/ExpenseTracker.css';

Chart.register(ArcElement, Tooltip, Legend);

const ExpenseTracker = ({ expenses, from, petName }) => {
  const currencySign = Currency[useSelector((state) => state.user.currency)].sign;

  const location = useLocation();
  if (location.pathname === '/main/expenses') {
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

  const columns = useMemo(
    () => [
      { Header: 'Date', accessor: 'date', Cell: ({ value }) => formatDateUniversal(new Date(value)) },
    //   { Header: 'Pet Name', accessor: 'petName' },
      petName == null ? { Header: 'Pet Name', accessor: 'petName', show: petName == null } : { Header: 'Pet Name', accessor: 'petName', show: false },
      { Header: 'Category', accessor: 'category' },
      { Header: 'Amount', accessor: 'amount', Cell: ({ value }) => value.toFixed(2) },
    ],
    []
  );

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
    maintainAspectRatio: false,
  };

  const { allExpenses, monthlyExpensesChartData, categoryExpensesChartData } = expenses;

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const startDate = startDateFilter ? new Date(startDateFilter) : null;
      const endDate = endDateFilter ? new Date(endDateFilter) : null;
      const minAmount = minAmountFilter ? parseFloat(minAmountFilter) : null;

      return (
        (!categoryFilter || expense.category === categoryFilter) &&
        (!startDate || expenseDate >= startDate.setHours(0, 0, 0, 0)) &&
        (!endDate || expenseDate <= endDate.setHours(23, 59, 59, 999)) &&
        (!minAmount || expense.amount >= minAmount)
      );
    });
  }, [categoryFilter, startDateFilter, endDateFilter, minAmountFilter, allExpenses]);

  const expensesTableInstance = useTable(
    {
      columns,
      data: filteredExpenses,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination
  );

  const exportToCSV = () => {
    const processedData = filteredExpenses.map((item) => ({
      Amount: item.amount,
      Category: item.category,
      Pet: petName == null ? item.petName : petName,
      Date: formatDateUniversal(new Date(item.date)),
    }));
    return processedData;
  };

  const renderExpensesTable = () => {
    return allExpenses.length > 0 ? (
      <>
        <Table instance={expensesTableInstance} />
      </>
    ) : (
      <p>No expenses yet.</p>
    );
  };

  const renderPetExpensesDataChart = () => {
    const { petExpensesData } = expenses;
    return (
      <div className="chart-container">
        <h3>Chart Expenses By Pet</h3>
        <div className="chart-wrapper">
          <Pie
            data={{
              labels: petExpensesData.map((item) => item.petName),
              datasets: [
                {
                  label: 'Total Expenses',
                  data: petExpensesData.map((item) => item.totalExpenses),
                  backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                },
              ],
            }}
            options={pieChartOptions}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="expense-tracker">
      <h3>{from === 'user' ? 'Your Expense Tracker' : 'Expenses'}</h3>
      {allExpenses.length > 0 && (
        <div className='table-filter-container'>
            <FilterSection
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
            />
             <ExportToCSVButton
                className="btn"
                petName={petName}
                data={exportToCSV()}
                filename={petName == null ? 'expenses.csv' : petName + '-expenses.csv'}
                isExpense={true}
                />
        </div>
      )}
      {renderExpensesTable()}
      {allExpenses.length > 0 && (
        <div className="charts-row">
          {from === 'user' && (
            <div className="chart-container">
              {renderPetExpensesDataChart()}
            </div>
          )}
          <div className="chart-container">
            <h3>Chart Expenses By Monthly</h3>
            <div className="chart-wrapper">
              <Pie
                data={{
                  labels: monthlyExpensesChartData.map((item) => item.month),
                  datasets: [
                    {
                      label: 'Total Expenses',
                      data: monthlyExpensesChartData.map((item) => item.amount),
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    },
                  ],
                }}
                options={pieChartOptions}
              />
            </div>
          </div>
          <div className="chart-container">
            <h3>Chart Expenses By Category</h3>
            <div className="chart-wrapper">
              <Pie
                data={{
                  labels: categoryExpensesChartData.map((item) => item.category),
                  datasets: [
                    {
                      label: 'Total Expenses',
                      data: categoryExpensesChartData.map((item) => item.amount),
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    },
                  ],
                }}
                options={pieChartOptions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Table = ({ instance }) => {
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
  } = instance;

  const totalItems = instance.rows.length;

  return (
    <>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(
                (column) =>
                  column.show !== false && (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {column.render('Header')}
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FontAwesomeIcon icon={faSortDown} />
                          ) : (
                            <FontAwesomeIcon icon={faSortUp} />
                          )
                        ) : (
                          !column.disableSortBy && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <FontAwesomeIcon icon={faSort} className="sort" />
                            </div>
                          )
                        )}
                      </div>
                    </th>
                  )
              )}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(
                  (cell) =>
                    cell.show !== false && <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                )}
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

export default ExpenseTracker;
