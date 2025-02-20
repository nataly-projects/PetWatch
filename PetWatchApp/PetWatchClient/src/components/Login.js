import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, InputAdornment, IconButton, Modal } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
import ForgotPassword from './ForgotPassword';
import {isValidEmail} from '../utils/utils';
import { loginUser } from '../services/userService';
import useApiActions from '../hooks/useApiActions';


const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);
  const [submitAllowed, setSubmitAllowed] = useState(false);

  const { execute, loading, error: apiError } = useApiActions();

  const navigate = useNavigate();
  const dispatch = useDispatch(); 


  useEffect(() => {
    setSubmitAllowed(!Object.values(errors).some(Boolean));
  }, [errors]);

  const openForgotPasswordModal = () => {
    setForgotPasswordModalOpen(true);
  };

  const closeForgotPasswordModal = () => {
    setForgotPasswordModalOpen(false);
  };

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'email':
        errorMessage = value
          ? isValidEmail(value)
            ? ''
            : 'Invalid email format'
          : 'Email is required';
        break;
      case 'password':
        errorMessage = value
          ? value.length >= 3
            ? ''
            : 'Password must be at least 8 characters long'
          : 'Password is required';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!submitAllowed) return;

    try {
      const { email, password } = formData;
      const loginData = await execute(loginUser, [email, password]);
      if (loginData) {
        dispatch({ type: 'SET_USER', payload: loginData });
        navigate('/main');
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred while processing your request');
  }
  };
  
  return (
    <Box
      sx={{
        padding: '24px 20px 60px',
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        border: '1px solid #ccc',
        marginBottom: '30%',
      }}
    >
      <Typography variant="h6" sx={{ color: '#795B4A', fontSize: '19px', textAlign: 'center', fontWeight: 'bold' }}>
        Welcome back to Pet Watch
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            marginTop: '20px',
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {[
            { label: 'Email', name: 'email', icon: faEnvelope, type: 'email' },
            { label: 'Password', name: 'password', icon: faLock, type: isPasswordVisible ? 'text' : 'password' },
          ].map(({ label, name, icon, type }) => (
            <Box key={name} sx={{ width: '70%', marginBottom: '26px' }}>
              <Typography component="label" sx={{ fontWeight: 'bold', color: '#795B4A' }}>
                {label}:
              </Typography>
              <TextField
                fullWidth
                required
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                error={Boolean(errors[name])}
                helperText={errors[name]}
                sx={{ mt: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={icon} style={{ color: '#795B4A' }} />
                    </InputAdornment>
                  ),
                  endAdornment:
                    name === 'password' && (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          <FontAwesomeIcon icon={isPasswordVisible ? faEye : faEyeSlash} style={{ color: '#795B4A' }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                }}
              />
            </Box>
          ))}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              height: '50px',
              width: '70%',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: '#fff',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            disabled={!submitAllowed}
          >
            Sign In
          </Button>
        </Box>
        {error && <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>{error}</Typography>}
      </form>

      <Typography
        onClick={openForgotPasswordModal}
        sx={{
          marginTop: '22px',
          opacity: 0.8,
          fontSize: '16px',
          color: '#795B4A',
          width: '70%',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': { opacity: 1 },
        }}
      >
        Forgot password?
      </Typography>

      <Modal open={isForgotPasswordModalOpen} onClose={closeForgotPasswordModal}>
        <Box sx={{ p: 4, backgroundColor: 'white', borderRadius: '8px', maxWidth: '400px', mx: 'auto', my: '10%' }}>
          <ForgotPassword onClose={closeForgotPasswordModal} />
        </Box>
      </Modal>
    </Box>
  );

};

export default Login;

