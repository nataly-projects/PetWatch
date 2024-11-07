import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DashboardCard = ({ title, icon, content }) => {
  return (
    <Box
      sx={{
        backgroundColor: '#f9fafb',
        border: '1px solid #ccc',
        p: 3,
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderRadius: 2,
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <FontAwesomeIcon icon={icon} size="2x" />
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" component="h3">
            {content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired, 
  content: PropTypes.string.isRequired,
};

export default DashboardCard;
