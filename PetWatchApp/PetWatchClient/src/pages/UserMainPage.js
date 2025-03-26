import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/SideBar';
import { Outlet } from 'react-router-dom';


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
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserMainPage;


