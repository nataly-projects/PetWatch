import React from 'react';
import { CSVLink } from 'react-csv';

const ExportToCSVButton = ({ data, filename }) => {
  return (
    <CSVLink 
    className='btn' 
    data={data} 
    filename={filename + '.csv'} 
    target="_self">
        Export to CSV
    </CSVLink>
  );
};

export default ExportToCSVButton;
