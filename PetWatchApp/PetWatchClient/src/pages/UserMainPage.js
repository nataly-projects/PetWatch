import React from 'react';
import { Box } from '@mui/material';
import AppRoutes from '../components/AppRoutes';
import Sidebar from '../components/SideBar';


const UserMainPage = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh', 
        width: '100%'
      }}
    >
      <Sidebar />
      <Box 
        sx={{
          flex: 1,
          padding: '20px',
          backgroundColor: 'background.default', 
          height: '100%',
          marginLeft: '270px',
        }}
      >
         <AppRoutes isUserRoute /> 
      </Box>
    </Box>
  );
};

export default UserMainPage;


