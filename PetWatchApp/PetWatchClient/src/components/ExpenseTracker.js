import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTable, useSortBy, usePagination } from 'react-table';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Box, Typography, Button, Modal, Pagination } from '@mui/material';
import { Currency } from '../utils/utils';
import FilterSection from './FilterSection';
import { ExpensesType } from '../utils/utils';
import ExportToCSVButton from './ExportToCSVButton';
import { formatDateUniversal } from '../utils/utils';
import { FormFieldsType, formFieldsConfig } from '../utils/utils';
import GenericActivityForm from './GenericActivityForm';
import { updateExpenseById, deleteExpenseById } from '../services/petService';
import useApiActions from '../hooks/useApiActions';


Chart.register(ArcElement, Tooltip, Legend);

const ExpenseTracker = ({ propsExpenses, from, petName, token }) => {
  const currencySign = Currency[useSelector((state) => state.user.currency)].sign;

const [expenses, setExpenses] = useState(propsExpenses);

  const location = useLocation();
  if (location.pathname === '/main/expenses') {
    expenses = location.state.expenses;
    from = location.state.from;
  }
  const navigate = useNavigate();
  const { execute, loading, error } = useApiActions();

  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [minAmountFilter, setMinAmountFilter] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setExpenses(propsExpenses);
  }, [propsExpenses]);

  const handleCategoryChange = (event) => setCategoryFilter(event.target.value);
  const handleStartDateChange = (event) => setStartDateFilter(event.target.value);
  const handleEndDateChange = (event) => setEndDateFilter(event.target.value);
  const handleMinAmountChange = (event) => setMinAmountFilter(event.target.value);


  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const formConfig = editMode ? formFieldsConfig(editingExpense)[FormFieldsType.EXPENSE] : formFieldsConfig()[FormFieldsType.EXPENSE];


console.log('formConfig', formConfig);
console.log('editingExpense', editingExpense);

  const handleEditClick = (expense) => {
    setEditMode(true);
    setEditingExpense(expense);
  };

  const handleEdit = async (updatedExpense) => {
    setEditingExpense(null);
      setEditMode(false);
      try {
        // await updateExpenseById(updatedExpense, token);
        await execute(updateExpenseById, [updatedExpense, token]);
        setExpenses(expenses.map((expense) => (expense._id === updatedExpense._id ? updatedExpense : expense)));
        toast.success('Expense updated successfully!');
      } catch (error) {
        console.log(error);
        if (error.response && error.response.status === 401){
          navigate('/login');
        } 
        toast.error('Failed to update expense. Please try again.');
      }
  };

  const handleDelete = async (id) => {
    try {
      await execute(deleteExpenseById, [id, token]);
      
      setExpenses(expenses.filter((expense) => expense._id !== id));
      toast.success('Expense deleted successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) navigate('/login');
      toast.error('Failed to delete expense. Please try again.');
    }
  };

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
    ...(from === 'pet'
      ? [
          {
            Header: 'Actions',
            accessor: 'actions',
            disableSortBy: true,
            Cell: ({ row }) => (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" variant="outlined" onClick={() => handleEditClick(row.original)}>Edit</Button>
                <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row.original._id)}>Delete</Button>
              </Box>
            ),
          },
        ]
      : [])
  ];

  return baseColumns;
}, [from, currencySign]);

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${currencySign} ${value.toFixed(2)}`;
          }
        }
      },
    },
    responsive: true,
    maintainAspectRatio: true,
  };

  const allExpenses = expenses?.allExpenses || [];
  const monthlyExpensesChartData = expenses?.monthlyExpensesChartData || [];
  const categoryExpensesChartData = expenses?.categoryExpensesChartData || [];
  const petExpensesData = expenses?.petExpensesData || [];

  const filteredExpenses = useMemo(() => {
    return allExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      const startDate = startDateFilter ? new Date(startDateFilter).setHours(0, 0, 0, 0) : null;
      const endDate = endDateFilter ? new Date(endDateFilter).setHours(23, 59, 59, 999) : null;
      const minAmount = minAmountFilter ? parseFloat(minAmountFilter) : null;

      return (
        (!categoryFilter || expense.category === categoryFilter) &&
        (!startDate || expenseDate >= startDate) &&
        (!endDate || expenseDate <= endDate) &&
        (!minAmount || expense.amount >= minAmount)
      );
    });
  }, [categoryFilter, startDateFilter, endDateFilter, minAmountFilter, allExpenses]);

  const expensesTableInstance = useTable(
    {
      columns,
      data: filteredExpenses || [],
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
    <Box sx={{ backgroundColor: '#fff', boxShadow: 1, border: 1, borderColor: '#ccc', p: 3, mb: 3, height: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {from === 'user' ? 'Your Expense Tracker' : 'Expenses'}
      </Typography>
      {allExpenses?.length > 0 && (
        <Box >
          <Typography variant="h6" gutterBottom>
                  Filter Options
                </Typography>
      <Box gap={2} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
        </Box>
      )}

      {allExpenses?.length > 0 ? (
        <Table instance={expensesTableInstance} />
      ) : (
        <Typography>No expenses yet.</Typography>
      )}

      {allExpenses?.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 4, mb: 2 }}>
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


      <Modal open={(editMode && formConfig)} onClose={handleDialogClose}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', width: '50%', mx: 'auto', my: '10%' }}>
        <GenericActivityForm
          title= {formConfig.title}
          fields={formConfig.fields}
          onSave={(data) => handleEdit(data)}
          onClose={() => setEditMode(false)}
          validationRules={formConfig.validationRules}    
          initialData={editingExpense}            
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
    state: { pageIndex, pageSize },
    gotoPage,
    pageCount,
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
        <Pagination
          count={pageCount}
          page={pageIndex + 1}
          onChange={(e, page) => gotoPage(page - 1)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  );
};

export default ExpenseTracker;
