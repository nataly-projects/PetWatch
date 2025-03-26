import React, { useState, useEffect, useReducer, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEyeSlash, faEye, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import { Box, Typography, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import {isValidEmail, hashPassword, isValidPhoneNumber} from '../utils/utils';
import { signupUser } from '../services/userService';
import useApiActions from '../hooks/useApiActions';

const initialState = {
  formData: {
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  },
  errors: {},
  isPasswordVisible: false,
  submitAllowed: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      const updatedFormData = { ...state.formData, [action.field]: action.value };
      const updatedErrors = validateField(action.field, action.value, state);
      return {
        ...state,
        formData: updatedFormData,
        errors: updatedErrors,
        submitAllowed: Object.values(updatedFormData).every(value => value.trim() !== '') &&
               !Object.values(updatedErrors).some(Boolean),
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'TOGGLE_PASSWORD':
      return { ...state, isPasswordVisible: !state.isPasswordVisible };
    case 'SET_SUBMIT_ALLOWED':
      return { ...state, submitAllowed: action.value };
    default:
      return state;
  }
};

const validateField = (name, value, state) => {
  let errorMessage = '';
  switch (name) {
    case 'fullName':
      errorMessage = value ? '' : 'Full Name is required';
      break;
    case 'email':
      errorMessage = value ? (isValidEmail(value) ? '' : 'Invalid email format') : 'Email is required';
      break;
    case 'phoneNumber':
      errorMessage = value ? (isValidPhoneNumber(value) ? '' : 'Invalid phone number format') : 'Phone Number is required';
      break;
    case 'password':
      errorMessage = value ? (value.length >= 3 ? '' : 'Password must be at least 8 characters long') : 'Password is required';
      break;
    case 'confirmPassword':
      errorMessage = value ? (value === state.formData.password ? '' : 'Passwords do not match') : 'Confirm Password is required';
      break;
    default:
      break;
  }
  return { ...state.errors, [name]: errorMessage };
};

const Register = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const reduxDispatch = useDispatch();
  const { execute, loading, error: apiError } = useApiActions();

  const formFields = [
    { label: 'Full Name', name: 'fullName', icon: faUser, type: 'text' },
    { label: 'Email', name: 'email', icon: faEnvelope, type: 'email' },
    { label: 'Phone', name: 'phoneNumber', icon: faPhone, type: 'number' },
    { label: 'Password', name: 'password', icon: faLock, type: state.isPasswordVisible ? 'text' : 'password' },
    { label: 'Confirm Password', name: 'confirmPassword', icon: faLock, type: state.isPasswordVisible ? 'text' : 'password' },
  ];
  
  const togglePasswordVisibility = () => {
    dispatch({ type: 'TOGGLE_PASSWORD' });
  };

  
  const handleChange = useCallback((e) => {
    dispatch({ type: 'SET_FIELD', field: e.target.name, value: e.target.value });

  }, []);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!state.submitAllowed) return;

    try {
      const { fullName, email, phoneNumber, password } = state.formData;
      const registerUser = await execute(signupUser, [fullName, email, phoneNumber, password]);

      if (registerUser) {
        reduxDispatch({ type: 'SET_USER', payload: registerUser });
        navigate('/dashboard/adopt');
      }
    } catch (error) {

      console.error(error);
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
      <Typography variant="h6" sx={{ fontSize: '19px', textAlign: 'center', fontWeight: 'bold' }}>
        Become a Pet Watch member
      </Typography>
      <Typography variant="body1" sx={{ fontSize: '16px', textAlign: 'center', marginBottom: '10px' }}>
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
          {formFields.map(({ label, name, icon, type }) => (
            <Box key={name} sx={{ width: '70%', marginBottom: '26px' }}>
              <Typography component="label" sx={{ fontWeight: 'bold' }}>
                {label}:
              </Typography>
              <TextField
                fullWidth
                required
                name={name}
                type={type}
                value={state.formData[name]}
                onChange={handleChange}
                error={Boolean(state.errors[name])}
                helperText={state.errors[name]}
                sx={{ mt: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FontAwesomeIcon icon={icon}/>
                    </InputAdornment>
                  ),
                  endAdornment:
                    name.includes('password') && (
                      <InputAdornment position="end">
                        <IconButton onClick={togglePasswordVisibility} edge="end">
                          <FontAwesomeIcon icon={state.isPasswordVisible ? faEye : faEyeSlash} />
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
            disabled={!state.submitAllowed}
          >
            Sign Up
          </Button>
        </Box>
      
      </form>
    </Box>
  );

};

export default Register;