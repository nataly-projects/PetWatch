import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const InfoGridItem = ({ to, labelText, imageSrc }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: '#795B4A' }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            border: '2px solid #795B4A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={labelText}
            sx={{ width: 80, height: 80, objectFit: 'cover', position: 'absolute' }}
          />
        </Box>
        <Typography variant="body1" sx={{ fontSize: 18 }}>{labelText}</Typography>
      </Box>
    </Link>
  );
};

export default InfoGridItem;
