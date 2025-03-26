import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const mainColor = '#795B4A';

const InfoGridItem = ({ to, labelText, imageSrc }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none', color: mainColor  }}>
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            border: `2px solid ${mainColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 10px',
            position: 'relative',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Box
            component="img"
            src={imageSrc}
            alt={`Icon representing ${labelText}`}
            sx={{
              width: { xs: 60, sm: 70, md: 80 },
              height: { xs: 60, sm: 70, md: 80 },
              objectFit: 'cover',
              position: 'absolute',
            }}
          />
        </Box>
        <Typography variant="body1" sx={{ fontSize: 18 }}>{labelText}</Typography>
      </Box>
    </Link>
  );
};

export default InfoGridItem;
