import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { resetPasswordRequest, validateResetPasswordCode, resetPassword  } from '../services/userService';
import { isValidEmail } from '../utils/utils';
import { Box, Typography, Button, TextField, Modal, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ForgotPassword = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);

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
      case 'code':
        errorMessage = value ? '' : 'Code is required';
        break;
      case 'newPassword':
        errorMessage = value
          ? value.length >= 3
            ? ''
            : 'Password must be at least 8 characters long'
          : 'Password is required';
        break;
      case 'confirmPassword':
        errorMessage = value
          ? value === formData.newPassword
            ? ''
            : 'Passwords do not match'
          : 'Confirm Password is required';
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  // handle step 1 - email input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    if (!errors.email) {
      try {
        const response = await resetPasswordRequest(formData.email);
        if (response) {
          toast.success('Email with verification code sent to your email');
          setStep(2);
        }
      } catch (error) {
        setError(error.response?.data?.error || 'An error occurred while processing your request');
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  // handle step 2 - code input
  const handleCodeSubmit = async (event) => {
    event.preventDefault();
    if (!errors.code) {
      try {
        const response = await validateResetPasswordCode(formData.email, formData.code);
        if (response) {
          setStep(3);
        }
      } catch (error) {
        setError(error.response?.data?.error || 'An error occurred while processing your request');
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  // handle step 3 - reset the password
  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!errors.newPassword && !errors.confirmPassword) {
      try {
        const response = await resetPassword(formData.email, formData.newPassword);
        if (response) {
          toast.success('Password reset successfully');
          onClose();
        }
      } catch (error) {
        setError('An error occurred while updating your password');
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <Modal open onClose={onClose}>
      <Box
        sx={{
          background: '#fff',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: 400,
          width: '100%',
          mx: 'auto',
          mt: '10%',
          position: 'relative',
        }}
      >
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <CloseIcon sx={{ color: '#795B4A' }} />
        </IconButton>
        <Typography variant="h6" sx={{ color: '#795B4A', mb: 2, textAlign: 'center' }}>
          Reset Password
        </Typography>
        <form>
          {step === 1 && (
            <>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ color: '#795B4A', mb: 1 }}>
                An email with a reset code will be sent to your email.
              </Typography>
              <Button variant="contained" fullWidth onClick={handleEmailSubmit} sx={{ mt: 1 }}>
                Continue
              </Button>
            </>
          )}
          {step === 2 && (
            <>
              <TextField
                fullWidth
                label="Reset Code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                error={Boolean(errors.code)}
                helperText={errors.code}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ color: '#795B4A', mb: 1 }}>
                Enter the verification code you received by email.
              </Typography>
              <Button variant="contained" fullWidth onClick={handleCodeSubmit} sx={{ mt: 1 }}>
                Continue
              </Button>
            </>
          )}
          {step === 3 && (
            <>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                error={Boolean(errors.newPassword)}
                helperText={errors.newPassword}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                sx={{ mb: 2 }}
              />
              <Button variant="contained" fullWidth onClick={handlePasswordSubmit} sx={{ mt: 1 }}>
                Submit
              </Button>
            </>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default ForgotPassword;
