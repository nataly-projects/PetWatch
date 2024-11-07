import React from 'react';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';

const ExportToCSVButton = ({ data, filename }) => {
  return (
    <Button
      startIcon={<FontAwesomeIcon icon={faDownload} />}
     
    >
      <CSVLink data={data} filename={filename} target="_self" style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Export to CSV */}
      </CSVLink>
    </Button>
  );
};

export default ExportToCSVButton;
