import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserSettings, fetchUserAccountSettings } from '../services/userService';
import { Currency } from '../utils/utils';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';

const AccountSettings = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [loading, setLoading] = useState(true);
  const [accountSettings, setAccountSettings] = useState({});
  const [notificationPreferences, setNotificationPreferences] = useState({});
  const [theme, setTheme] = useState('');
  const [currency, setCurrency] = useState('');

  useEffect(() => {
    const fetchAccountSettings = async () => {
      try {
        const userAccountSettings = await fetchUserAccountSettings(user._id, token);
        setAccountSettings(userAccountSettings.accountSettings);
        setNotificationPreferences(userAccountSettings.accountSettings.notificationPreferences);
        setCurrency(userAccountSettings.accountSettings.currency || Currency.ILS.name);
        setTheme(userAccountSettings.accountSettings.theme || 'light');
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
        setLoading(false);
        console.error('Error fetching account settings:', error);
      }
    };

    if (user) {
      fetchAccountSettings();
    }
  }, [user, token, navigate]);

  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;
    setNotificationPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserSettings(user._id, {
        notificationPreferences,
        theme,
        currency,
      }, token);
      toast.success('Account settings updated successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
      console.error('Error updating profile:', error);
      toast.error('Failed to update account settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography variant="body1" ml={2}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" p={3} border={1} borderColor="grey.300" borderRadius={2} bgcolor="background.paper">
      <Typography variant="h5" mb={2}>Account Settings</Typography>
      <Typography variant="body1" mb={3}>
        Customize various aspects of your account to suit your preferences.
      </Typography>
      
      <FormControlLabel
        control={
          <Checkbox
            checked={notificationPreferences.email || false}
            onChange={handleNotificationChange}
            name="email"
          />
        }
        label="Email Notification"
      />
      
      {notificationPreferences.email && (
        <Box ml={3}>
          <Typography variant="subtitle1">Activity Notifications</Typography>
          <Typography variant="body2" color="textSecondary" mb={2}>Notify me via email when...</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={notificationPreferences.vaccineTime || false}
                onChange={handleNotificationChange}
                name="vaccineTime"
              />
            }
            label="Vaccine Notification"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={notificationPreferences.routineCareTime || false}
                onChange={handleNotificationChange}
                name="routineCareTime"
              />
            }
            label="Routine Care Notification"
          />
        </Box>
      )}

      <FormControl fullWidth margin="normal">
        <InputLabel>Theme</InputLabel>
        <Select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          label="Theme"
        >
          <MenuItem value="light">Light</MenuItem>
          <MenuItem value="dark">Dark</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Currency</InputLabel>
        <Select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          label="Currency"
        >
          {Object.keys(Currency).map((currencyCode) => (
            <MenuItem key={currencyCode} value={currencyCode}>
              {Currency[currencyCode].name} ({Currency[currencyCode].sign})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 3 }}
      >
        Save Settings
      </Button>
    </Box>
  );
};

export default AccountSettings;
