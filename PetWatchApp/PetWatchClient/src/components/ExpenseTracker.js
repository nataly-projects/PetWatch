import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons';
import { Box, Typography, Button, Modal } from '@mui/material';
import { Currency } from '../utils/utils';
import FilterSection from './FilterSection';
import { ExpensesType } from '../utils/utils';
import ExportToCSVButton from './ExportToCSVButton';
import { formatDateUniversal } from '../utils/utils';
import { FormFieldsType, formFieldsConfig } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';

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
  const [isAddExpenseDialogOpen, setIsAddExpenseDialogOpen] = useState(false);

  const handleCategoryChange = (event) => setCategoryFilter(event.target.value);
  const handleStartDateChange = (event) => setStartDateFilter(event.target.value);
  const handleEndDateChange = (event) => setEndDateFilter(event.target.value);
  const handleMinAmountChange = (event) => setMinAmountFilter(event.target.value);

  const handleAddExpenseClick = () => {
    setIsAddExpenseDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAddExpenseDialogOpen(false);
  };

  const formConfig = formFieldsConfig()[FormFieldsType.EXPENSE];


  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: 'Date',
        accessor: 'date',
        Cell: ({ value }) => formatDateUniversal(new Date(value)),
      },
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }) => `${currencySign} ${value.toFixed(2)}`,
      },
    ];

    // Conditionally add the Pet Name column
    if (from === 'user') {
      baseColumns.splice(1, 0, {
        Header: 'Pet Name',
        accessor: 'pet.name',
      });
    }

    return baseColumns;
  }, [from, currencySign]);

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

  const { allExpenses, monthlyExpensesChartData, categoryExpensesChartData, petExpensesData } = expenses;

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

  return (
    <Box sx={{ backgroundColor: '#fff', boxShadow: 1, border: 1, borderColor: '#ccc', p: 3, mb: 3, height: '100vh' }}>
      <Typography variant="h5" gutterBottom>
        {from === 'user' ? 'Your Expense Tracker' : 'Expenses'}
      </Typography>
      {allExpenses.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <FilterSection
            filterType={categoryFilter}
            handleTypeChange={handleCategoryChange}
            startDate={startDateFilter}
            handleStartDateChange={handleStartDateChange}
            endDate={endDateFilter}
            handleEndDateChange={handleEndDateChange}
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
        </Box>
      )}

      {allExpenses.length > 0 ? (
        <Table instance={expensesTableInstance} />
      ) : (
        <Typography>No expenses yet.</Typography>
      )}

      {allExpenses.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4 }}>
          {from === 'user' && (
            <Box sx={{ width: 300, height: 300 }}>
              <Typography variant="h6" align="center">Chart Expenses By Pet</Typography>
              <Pie
                data={{
                  labels: petExpensesData.map((item) => item.petName),
                  datasets: [{ data: petExpensesData.map((item) => item.totalExpenses), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }],
                }}
                options={pieChartOptions}
              />
            </Box>
          )}
          <Box sx={{ width: 300, height: 300 }}>
            <Typography variant="h6" align="center">Chart Expenses By Monthly</Typography>
            <Pie
              data={{
                labels: monthlyExpensesChartData.map((item) => item.month),
                datasets: [{ data: monthlyExpensesChartData.map((item) => item.amount), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }],
              }}
              options={pieChartOptions}
            />
          </Box>
          <Box sx={{ width: 300, height: 300 }}>
            <Typography variant="h6" align="center">Chart Expenses By Category</Typography>
            <Pie
              data={{
                labels: categoryExpensesChartData.map((item) => item.category),
                datasets: [{ data: categoryExpensesChartData.map((item) => item.amount), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] }],
              }}
              options={pieChartOptions}
            />
          </Box>
        </Box>
      )}
      {
        from === 'pet' && (
          <Button variant="contained" sx={{ mt: 5 }} onClick={handleAddExpenseClick}>Add Expense</Button>
        )
      }
      <Modal open={(isAddExpenseDialogOpen && formConfig)} onClose={handleDialogClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', width: '50%', mx: 'auto', my: '10%' }}>
          <GenericActivityForm
            title= {formConfig.title}
            fields={formConfig.fields}
            // onSave={(data) => handleAddContact(data)}
            onClose={handleDialogClose}
            validationRules={formConfig.validationRules}                
            />
        </Box>
      </Modal>
    </Box>
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
      <Box component="table" {...getTableProps()} sx={{ width: '100%', borderCollapse: 'collapse', mb: 2 }}>
        <Box component="thead">
          {headerGroups.map((headerGroup) => (
            <Box component="tr" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => column.show !== false && (
                <Box component="th" {...column.getHeaderProps(column.getSortByToggleProps())} sx={{ border: 1, borderColor: '#ddd', p: 1, bgcolor: '#f2f2f2' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {column.render('Header')}
                    {column.isSorted && (column.isSortedDesc ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />)}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
        <Box component="tbody" {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <Box component="tr" {...row.getRowProps()} sx={{ '&:nth-of-type(even)': { bgcolor: '#f2f2f2' } }}>
                {row.cells.map((cell) => (
                  <Box component="td" {...cell.getCellProps()} sx={{ border: 1, borderColor: '#ddd', p: 1 }}>
                    {cell.render('Cell')}
                  </Box>
                ))}
              </Box>
            );
          })}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography>Showing {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems}</Typography>
        <Box>
          <Button onClick={previousPage} disabled={!canPreviousPage} sx={{ mr: 1 }}>Previous</Button>
          {pageOptions.map((page, index) => (
            <Button key={index} onClick={() => gotoPage(index)} variant={pageIndex === index ? 'contained' : 'outlined'} sx={{ mx: 0.5 }}>
              {index + 1}
            </Button>
          ))}
          <Button onClick={nextPage} disabled={!canNextPage} sx={{ ml: 1 }}>Next</Button>
        </Box>
      </Box>
    </>
  );
};

export default ExpenseTracker;
