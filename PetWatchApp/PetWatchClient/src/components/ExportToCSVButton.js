import React from 'react';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const ExportToCSVButton = ({ data, filename }) => {
  return (
    <CSVLink 
    className='export-btn' 
    data={data} 
    filename={filename} 
    target="_self">
        {/* Export to CSV */}
        <FontAwesomeIcon icon={faDownload} />
    </CSVLink>
  );
};

export default ExportToCSVButton;
