import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPaw, faHome, faBook, faDog, faCat, faAmbulance, faMoneyCheck,
  faCog, faRightFromBracket, faSignature, faEye, faMessage, faTasks  } from '@fortawesome/free-solid-svg-icons';
  import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton } from '@mui/material';

import { fetchUserActivityLog, fetchUserUpcomingEvents, fetchUserExpensesArray } from '../services/userService';
import logoImage from "../images/logo.png"; 

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const fetchData = async () => {
    try {
        const logs = await fetchUserActivityLog(user._id, token); 
        const events = await fetchUserUpcomingEvents(user._id, token);
        const userExpenses = await fetchUserExpensesArray(user._id, token);
        setActivityLogs(logs);
        setExpenses(userExpenses);
        setUpcomingEvents(events);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const isActivityLogPath = (path) => path === '/main/activity-log';
  const isExpensesPath = (path) => path === '/main/expenses';

  const sideBarItems = [
    {title: 'Main', items: [{text: 'Dashboard', link: '/main/', icon: faHome} ]},
    {title: 'Pets', items: [{text: 'Pets Section', link: '/main/pets', icon: faPaw} ]},
    {title: 'Logs', items: [
      {text: 'Activity Log', link: '/main/activity-log', icon: faBook}, 
      {text: 'Expenses', link: '/main/expenses' , icon: faMoneyCheck},
      {text: 'Tasks', link: '/main/tasks' , icon: faTasks}
    ]},

    {title: 'Info', items: [
    {text: 'Dogs Care Routine', link: '/main/dog-care' , icon: faDog}, 
    {text: 'Dog Guide', link: '/main/dog-guide' , icon: faDog}, 
    {text: 'Cats Care Routine', link: '/main/cat-care', icon: faCat}, 
    {text: 'Cat Guide', link: '/main/cat-guide', icon: faCat}, 
    {text: 'Emergency Guide', link: '/main/emergency-guide', icon: faAmbulance}, 
    {text: 'Pet Names Idea', link: '/main/pet-names' ,icon: faSignature} 
    ]},
    {title: 'Settings', items: [
      {text: 'Account Settings', link: '/main/account-settings', icon: faCog}, 
      {text: 'User Profile', link: '/main/user-profile', icon: faEye},
      {text: 'Contact Us', link: '/main/contact-us', icon: faMessage}
    ]},
    {title: 'Authentication', items: [{text: 'Logout', link: '/login', icon: faRightFromBracket, onClick: handleLogout} ]}
  ]



  return (
    <Box
    sx={{
      width: '250px',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      flexShrink: 0,
      overflowY: 'auto',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      borderRight: '1px solid #ccc',
    }}
    >      
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <Avatar src={logoImage} alt="Project Logo" sx={{ width: 60, height: 60, marginRight: 2 }} />
        <Typography variant="h5" color="primary">
        Pet Watch
        </Typography>
      </Box>
      {sideBarItems.map((section, index) => (
        <Box key={index} sx={{ marginBottom: 2 }}>
<         Typography variant="h6" sx={{ fontSize: '14px', marginBottom: '10px', paddingLeft: 2 }}>
            {section.title}
          </Typography>          
          <List sx={{ padding: 0 }}>
            {section.items.map((item, itemIndex) => (
              <ListItem key={itemIndex} disablePadding sx={{ borderBottom: '1px solid #795B4A' }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.link}
                  onClick={item.onClick}
                  state={
                    isActivityLogPath(item.link) ? { activityLogs, upcomingEvents, petName: null } :
                    isExpensesPath(item.link) ? { expenses, from: 'user' } :
                    undefined
                  }
                  sx={{ color: 'text.primary' }}
                >
                  <ListItemIcon>
                    <FontAwesomeIcon icon={item.icon} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {index < sideBarItems.length - 1 && <Divider />}
        </Box>
      ))}
  </Box>
  );

};

export default Sidebar;
