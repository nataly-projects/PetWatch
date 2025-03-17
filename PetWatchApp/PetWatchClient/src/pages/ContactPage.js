import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import {isValidEmail} from '../utils/utils';
import { sendContactMessage } from '../services/userService';
import pawBackground from '../images/paw_background.jpg';

const ContactPage = () => {
  const user = useSelector((state) => state.user);
  
  const defaultFormData = useMemo(() => ({
    email: user?.email || '',
    name: user?.fullName || '',
    message: '',
  }), [user]);
  const [formData, setFormData] = useState(defaultFormData);

  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const validationErrors = {};

    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      validationErrors.email = 'Invalid email format';
    }

    if (!formData.name) {
      validationErrors.name = 'Name is required';
    }

    if (!formData.message) {
      validationErrors.message = 'Message is required';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    try {
      const userId = user?._id || null;
      const response = await sendContactMessage({ userId, ...formData });
      if (response) {
        toast.success('Message sent successfully');
        setFormData(defaultFormData);
        setErrors({});
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again later.');
    }
    
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: `linear-gradient(rgba(255,255,255, 0.7), rgba(255,255,255, 0.7)), url(${pawBackground})`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 5,
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          width: '100%',
          backgroundColor: '#f9f9f9',
          padding: 3,
          borderRadius: 2,
          border: '1px solid #ccc',
          mt: 3,
          mb: 5,
        }}
      >
        <Typography variant="h4" sx={{textAlign: 'center', mb: 2 }}>
          Contact Us
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please fill out the form below to contact us with any questions or feedback. <br />
          We will get back to you as soon as possible. <br />
          Thank you for your interest in Pet Watch!
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1">
            Email: petwatch07@gmail.com
          </Typography>
          <Typography variant="body1">
            Address: 123 Pet Avenue, Watch Valley
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {[{ name: 'name', type: 'text' },
            { name: 'email', type: 'email' },
            { name: 'message', type: 'text', multiline: true, rows: 4 },].map(({name, type, multiline, rows}) => (
            <TextField
              key={name}
              fullWidth
              required
              label={name.charAt(0).toUpperCase() + name.slice(1)}
              name={name}
              type={type}
              value={formData[name]}
              onChange={handleChange}
              error={Boolean(errors[name])}
              helperText={errors[name]}
              multiline={multiline}
              rows={rows}
              sx={{ mb: 2 }}
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: '#007bff',
              color: '#fff',
              height: '50px',
              fontSize: '16px',
              mt: 2,
              borderRadius: '5px',
              '&:hover': { backgroundColor: '#0056b3' },
            }}
          >
            Submit
          </Button>
        </form>
        {/* {error && (
          <Typography sx={{ color: 'red', textAlign: 'center', mt: 2 }}>{error}</Typography>
        )} */}
      </Box>
    </Box>
  );
};

export default ContactPage;
