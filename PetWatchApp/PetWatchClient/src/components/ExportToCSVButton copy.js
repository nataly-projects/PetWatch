import React from 'react';
import { formatDate } from '../utils/utils';
import { CSVLink } from 'react-csv';

const exportToCSV = (data, petName, isExpense) => {
  let processedData;

  if (isExpense) {
    processedData = data.map(item => ({
      Amount: item.amount,
      Category: item.category,
      Pet: petName == null ? (item.petId?.name || item.pet?.name) : petName,
      Date: formatDate(item.created_at),
    }));
  } else {
    processedData = data.map(item => ({
      Details: item.details,
      ActionType: item.actionType,
      Pet: petName == null ? (item.petId?.name || item.pet?.name) : petName,
      Date: formatDate(item.created_at),
    }));
  }
 

  return processedData;
};

const ExportToCSVButton = ({ data, filename, petName, isExpense }) => {

  const filteredData = exportToCSV(data, petName, isExpense);

  return (
    <CSVLink 
    className='btn' 
    data={filteredData} 
    filename={filename} 
    target="_self">
        Export to CSV
    </CSVLink>
  );
};

export default ExportToCSVButton;
