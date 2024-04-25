import React, { useState, useEffect  } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { updateUserSettings, fetchUserAccountSettings } from '../services/userService';
import { Currency } from '../utils/utils';
import '../styles/AccountSettings.css';

const AccountSettings = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const token = useSelector(state => state.token);

  const [loading, setLoading] = useState(true);
  const [accountSettings, setAccountSettings] = useState({});
  const [notificationPreferences, setNotificationPreferences] = useState({});

  const [theme, setTheme] = useState('');
  const [currency, setCurrency] = useState('');


  useEffect(() => {
      const fetchAccountSettings = async () => {
          try {
            const userAccountSettings  = await fetchUserAccountSettings(user._id, token);
            console.log('accountSettings: ', userAccountSettings.accountSettings);
            setAccountSettings(userAccountSettings.accountSettings);
            setNotificationPreferences(userAccountSettings.accountSettings.notificationPreferences);
            setCurrency(userAccountSettings.accountSettings.currency ? userAccountSettings.accountSettings.currency : Currency.ILS.name);
            setTheme(userAccountSettings.accountSettings.theme ? userAccountSettings.accountSettings.theme : 'light');

            console.log('notificationPreferences: ', notificationPreferences);
            setLoading(false);
          } catch (error) {
            if (error.response && error.response.status === 401) {
              console.error('UNAUTHORIZED_ERROR');
              setLoading(false);
              navigate('/login');
            }
            console.error('Error fetching account settings:', error);
          }
      };

      if (user) {
          fetchAccountSettings();
      }
  }, [user]);

  const handleNotificationChange = (event) => {
      const { name, checked } = event.target;
      setNotificationPreferences(prevState => ({ ...prevState, [name]: checked }));
  };

   
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    await updateUserSettings(user._id, {
        notificationPreferences,
        theme,
        currency
    }, token);
    toast.success('Account settings updated successfully!');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        setLoading(false);
        navigate('/login');
      }
      console.error('Error updating profile:', error);
      toast.error('Failed to update account settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className='account-settings-container'>
        <h2>Account Settings</h2>
        <p>
            Welcome to your account settings page! Here, you can customize various
            aspects of your account to suit your preferences.
        </p>
        <div className="notification-option">
          <div className='notification-header'>
            <h4>Email Notification</h4>
            <p>Do you want to get email notifications?</p>
          </div>
          <input type="checkbox" name="email" checked={notificationPreferences.email} onChange={handleNotificationChange} />
          <label className="notification-label" htmlFor="emailNotification">Email Notification</label>
        </div>
        {notificationPreferences.email && (
            <div className="other-options">
              <div className='notification-header'>
                {/* Other options related to email notification */}
                <h4>Activity Notifications</h4>
                <p>Notify me via email when...</p>
              </div>  
              <div>
                  <input type="checkbox" name="vaccineTime" checked={notificationPreferences.vaccineTime} onChange={handleNotificationChange} />
                  <label className="notification-label" htmlFor="vaccineNotification">Vaccine Notification</label>
              </div>
              <div>
                  <input type="checkbox" name="routineCareTime" checked={notificationPreferences.routineCareTime} onChange={handleNotificationChange} />
                  <label className="notification-label" htmlFor="routineCareNotification">Routine Care Notification</label>
              </div>   
            </div>
        )}
         <div className='select-container'>
          <label className="select-label">Theme:</label>
          <select
            className="select"
            value={theme}
            onChange={(e) => setTheme(e.target.value)} >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className='select-container'>
          <label className="select-label">Currency:</label>
          <select
            className="select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)} >
            {/* Render the curreny options */}
            {Object.keys(Currency).map(currencyCode => (
              <option key={currencyCode} value={currencyCode}>
                  {Currency[currencyCode].name} ({Currency[currencyCode].sign})
              </option>
            ))}
          </select>
        </div>

        <button className='save-button' onClick={handleSubmit} >Save Settings</button>
    </div>
  );
};

export default AccountSettings;
