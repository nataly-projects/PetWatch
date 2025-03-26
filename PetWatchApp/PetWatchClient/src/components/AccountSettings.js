import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserSettings, fetchUserAccountSettings } from '../services/userService';
import { Currency } from '../utils/utils';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button, Checkbox, FormControlLabel, CircularProgress } from '@mui/material';
import useFetch from '../hooks/useFetch';

const AccountSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const currentTheme = useSelector((state) => state.theme); 
  const [notificationPreferences, setNotificationPreferences] = useState({});
  const [currency, setCurrency] = useState('');
  const [tempTheme, setTempTheme] = useState(currentTheme);

  const { data: accountSettingsData, loading, error } = useFetch(
    fetchUserAccountSettings,
    [user._id, token],
    null
  );

  const accountSettings = accountSettingsData?.accountSettings || {};
  const userCurrency = accountSettings?.currency || Currency.ILS.name;

  useEffect(() => {
    if (accountSettings?.notificationPreferences) {
      setNotificationPreferences(accountSettings.notificationPreferences);
    }
    setCurrency(userCurrency);
  }, [accountSettings]);


  const handleNotificationChange = (event) => {
    const { name, checked } = event.target;
    setNotificationPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleThemeChange = (event) => {
    setTempTheme(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserSettings(user._id, {
        notificationPreferences,
        theme: tempTheme,
        currency,
      }, token);
      dispatch({ type: 'SET_THEME', payload: tempTheme });
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

  if (error) {
    console.error('Error fetching account settings:', error);
    if (error.response && error.response.status === 401) {
      navigate('/login');
      return null;
    }
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="body1">Failed to fetch account settings. Please try again later.</Typography>
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
          value={tempTheme || 'light'}
          onChange={handleThemeChange}
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
            <MenuItem key={currencyCode} value={Currency[currencyCode].value}>
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
