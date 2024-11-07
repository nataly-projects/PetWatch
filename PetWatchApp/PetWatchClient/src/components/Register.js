import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEyeSlash, faEye, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import {isValidEmail, hashPassword, isValidPhoneNumber} from '../utils/utils';
import { signupUser } from '../services/userService';


const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submitAllowed, setSubmitAllowed] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    setSubmitAllowed(!Object.values(errors).some(Boolean));
  }, [errors]);

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'fullName':
        errorMessage = value ? '' : 'Full Name is required';
        break;
      case 'email':
        errorMessage = value
          ? isValidEmail(value)
            ? ''
            : 'Invalid email format'
          : 'Email is required';
        break;
      case 'phoneNumber':
        errorMessage = value
          ? isValidPhoneNumber(value)
            ? ''
            : 'Invalid phone number format'
          : 'Phone Number is required';
        break;
      case 'password':
        errorMessage = value
          ? value.length >= 3
            ? ''
            : 'Password must be at least 8 characters long'
          : 'Password is required';
        break;
      case 'confirmPassword':
        errorMessage = value
          ? value === formData.password
            ? ''
            : 'Passwords do not match'
          : 'Confirm Password is required';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!submitAllowed) return;

    try {
      const { fullName, email, phoneNumber, password } = formData;
      const registerUser = await signupUser(fullName, email, phoneNumber, password);
      if (registerUser) {
        dispatch({ type: 'SET_USER', payload: registerUser });
        navigate('/dashboard/adopt');
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
        Become a Pet Watch member
      </Typography>
      <Typography variant="body1" sx={{ color: '#795B4A', fontSize: '16px', textAlign: 'center', marginBottom: '10px' }}>
        Sign up to get the most of Pet Watch website
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
            { label: 'Full Name', name: 'fullName', icon: faUser },
            { label: 'Email', name: 'email', icon: faEnvelope },
            { label: 'Phone', name: 'phoneNumber', icon: faPhone },
            { label: 'Password', name: 'password', icon: faLock, type: isPasswordVisible ? 'text' : 'password' },
            { label: 'Confirm Password', name: 'confirmPassword', icon: faLock, type: isPasswordVisible ? 'text' : 'password' },
          ].map(({ label, name, icon, type = 'text' }) => (
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
                    name.includes('password') && (
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
            Sign Up
          </Button>
        </Box>
        {error && <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>{error}</Typography>}
      </form>
    </Box>
  );

};

export default Register;