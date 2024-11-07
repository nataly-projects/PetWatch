import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import { Box, Divider } from '@mui/material';
import pawBackground from '../images/paw_background.jpg';

const SignupLoginPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        background: `linear-gradient(rgba(255,255,255, 0.7), rgba(255,255,255, 0.7)), url(${pawBackground})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '45%',
          paddingLeft: '20px',
          paddingRight: '20px',
          paddingTop: '20px',
        }}
      >
        <Divider
          sx={{
            width: '53px',
            height: '2px',
            margin: '17px auto 33px',
            backgroundColor: '#795B4A',
          }}
          className="signup-login-page-line"
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '25px',
            marginLeft: '-1%',
          }}
          className="signup-login-page-nav"
        >
          <Box
            onClick={() => setIsLoginPage(false)}
            sx={{
              width: '30%',
              marginLeft: '5%',
              opacity: isLoginPage ? 0.5 : 1,
              fontSize: '19px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLoginPage ? '#494949' : '#795B4A',
              borderBottom: isLoginPage ? '2px solid #494949' : '2px solid #795B4A',
              height: '50px',
              cursor: 'pointer',
              fontWeight: isLoginPage ? 'normal' : 'bold',
            }}
            className="nav-option"
          >
            Sign Up
          </Box>
          <Box
            onClick={() => setIsLoginPage(true)}
            sx={{
              width: '30%',
              marginLeft: '5%',
              opacity: isLoginPage ? 1 : 0.5,
              fontSize: '19px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLoginPage ? '#795B4A' : '#494949',
              borderBottom: isLoginPage ? '2px solid #795B4A' : '2px solid #494949',
              height: '50px',
              cursor: 'pointer',
              fontWeight: isLoginPage ? 'bold' : 'normal',
            }}
            className="nav-option"
          >
            Sign In
          </Box>
        </Box>
        {isLoginPage ? <Login /> : <Register />}
      </Box>
    </Box>
  );
};

export default SignupLoginPage;
