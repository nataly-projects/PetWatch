import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faEye, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Box, IconButton, Typography, Avatar } from '@mui/material';

const UserPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleClick = (event) => {
    onClose();
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });

  };

  return (
    <Box 
      sx={{
        position: 'absolute', 
        top: 50, 
        right: 20, 
        width: 200, 
        backgroundColor: '#fff', 
        borderRadius: 2, 
        boxShadow: '0 2px 5px rgba(0.3, 0.3, 0.3, 0.3)', 
        zIndex: 9999
      }}
      onClick={handleClick}
    >
    
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 1, borderBottom: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
        
        {user.imageUrl ? (
          <Avatar 
            alt={user.fullName} 
            src={`http://localhost:5001/${user.imageUrl}`} 
            sx={{ width: 30, height: 30 }} 
          />
        ) : (
          <FontAwesomeIcon icon={faUser} style={{ fontSize: '30px', color: '#333' }} />
        )}

        <Typography variant="body1" sx={{ flexGrow: 1, marginLeft: 1, fontWeight: 'bold', color: '#333' }}>
          {user.fullName}
        </Typography>

        
        <IconButton onClick={onClose} >
          <FontAwesomeIcon icon={faTimes} />
        </IconButton>
      </Box>

    
      <Box component="ul" sx={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <Box component="li" sx={{ padding: 2, borderBottom: '1px solid #ccc', '&:hover': { backgroundColor: '#f0f0f0' } }}>
          <Link to="/user-profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: '#333' }}>
            <FontAwesomeIcon icon={faEye} style={{ marginRight: '8px' }} />
            <Typography variant="body2">Profile</Typography>
          </Link>
        </Box>

        <Box component="li" sx={{ padding: 2, borderBottom: '1px solid #ccc', '&:hover': { backgroundColor: '#f0f0f0' } }}>
          <Link to="/main/account-settings" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: '#333' }}>
            <FontAwesomeIcon icon={faCog} style={{ marginRight: '8px' }} />
            <Typography variant="body2">Settings</Typography>
          </Link>
        </Box>

        <Box component="li" sx={{ padding: 2, '&:hover': { backgroundColor: '#f0f0f0' } }}>
          <Link 
            onClick={handleLogout} 
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', color: '#333' }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
            <Typography variant="body2">Logout</Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default UserPopup;
