import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons";
import { useSelector  } from "react-redux";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Box, Badge } from '@mui/material';
import logoImage from "../images/logo.png"; 
import UserPopup from "./UserPopup";
import NotificationPopup from './NotificationPopup';

const navLinkStyles = {
    textDecoration: 'none',
    color: '#795B4A',
    margin: '0 10px',
    '&:hover': {
      color: 'lightblue',
    },
};

const NavBar = () => {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const user = useSelector((state) => state.user);
    const [isUserPopupVisible, setUserPopupVisible] = useState(false);
    const [isNotificationPopupVisible, setNotificationPopupVisible] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [anchorElNotification, setAnchorElNotification] = useState(null);
    
    const handleUserIconClick = () => {
        setUserPopupVisible(!isUserPopupVisible);
    };

    const handleNotificationIconClick = () => {
        setNotificationPopupVisible(!isNotificationPopupVisible);
    };


    const renderGuestNavBar = () => {
        return (
        <AppBar position='static'>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center">
                    <Avatar src={logoImage} alt="Logo" sx={{ marginRight: 2 }} />
                    {/* <Typography variant="h6" component="div">
                        PetWatch
                    </Typography> */}
                </Box>
                <Box>
                <NavLink
                    to="/about"
                    style={({ isActive }) =>
                    isActive
                        ? { ...navLinkStyles, fontWeight: 'bold' }
                        : navLinkStyles
                    } >
                    About
                </NavLink>
                <NavLink
                    to="/info"
                    style={({ isActive }) =>
                    isActive
                        ? { ...navLinkStyles, fontWeight: 'bold' }
                        : navLinkStyles
                    } >
                    Information
                </NavLink>
                <NavLink
                    to="/contact"
                    style={({ isActive }) =>
                    isActive
                        ? { ...navLinkStyles, fontWeight: 'bold' }
                        : navLinkStyles
                    }>
                    Contact
                </NavLink>
                    <Link to="/login">
                        <IconButton color="inherit">
                            <FontAwesomeIcon icon={faUser} />
                        </IconButton>
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
        )
    };

    const renderUserNavBar = () => {
        return (
        <AppBar >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Box display="flex" alignItems="center">
                    <Avatar src={logoImage} alt="Logo" sx={{ marginRight: 2 }} />
                    <Typography variant="h6" component="div">
                        PetWatch
                    </Typography>
                </Box>
                <Box>
                    <IconButton color="inherit" onClick={handleNotificationIconClick}>
                        <Badge color="secondary" variant="dot">
                            <FontAwesomeIcon icon={faBell} />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleUserIconClick}>
                        <FontAwesomeIcon icon={faUser} />
                        <Typography variant="body1" sx={{ marginLeft: 1 }}>
                            {user.fullName}
                        </Typography>
                    </IconButton>
                    {isNotificationPopupVisible && <NotificationPopup onClose={() => setNotificationPopupVisible(false)} />}
                    {isUserPopupVisible && <UserPopup onClose={() => setUserPopupVisible(false)} />}
                </Box>
            </Toolbar>
        </AppBar>
        )
    };


    return (
        (isLoggedIn ?
        renderUserNavBar()
        :
        renderGuestNavBar()
        )  
    )
};

export default NavBar