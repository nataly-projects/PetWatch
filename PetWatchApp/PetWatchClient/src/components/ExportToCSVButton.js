import React from 'react';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@mui/material';

const ExportToCSVButton = ({ data, filename }) => {
  return (
      <CSVLink data={data} filename={filename} target="_self" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-block', alignItems: 'center' }}>
        <Button variant="contained" startIcon={<FontAwesomeIcon icon={faDownload} />} sx={{ textTransform: 'none', padding: '6px 12px' }}>
          Export
        </Button>
      </CSVLink>
  );
};

export default ExportToCSVButton;
