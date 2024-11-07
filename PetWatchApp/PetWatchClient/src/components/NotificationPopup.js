import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserUpcomingEvents } from '../services/userService';
import { Box, Paper, Typography, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDateUniversal } from '../utils/utils';

const NotificationPopup = ({ onClose }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (user) {
            const fetchData = async () => {
                try {
                    const events = await fetchUserUpcomingEvents(user._id, token);
                    setEvents(events);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.error('UNAUTHORIZED_ERROR');
                        navigate('/login');
                    }
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }
    }, [user]);

    return (
        <Paper
            sx={{
                position: 'absolute',
                top: '50px',
                right: '200px',
                minWidth: '400px',
                maxWidth: '600px',
                backgroundColor: '#f0f0f0',
                borderRadius: '10px',
                padding: '20px',
                zIndex: 9999,
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
                overflowY: 'auto',
                maxHeight: '400px'
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Upcoming Events</Typography>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {events.length > 0 ? (
                events.map((event, index) => (
                    <Box
                        key={index}
                        sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px',
                            backgroundColor: '#fff',
                            marginBottom: '10px'
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <NotificationsIcon color="primary" />
                            <Typography variant="subtitle1">{event.actionType}</Typography>
                        </Box>
                        <Typography variant="body2">Pet: {event.pet.name}</Typography>
                        <Typography variant="body2">Details: {event.details}</Typography>
                        <Typography variant="body2">
                            Date: {formatDateUniversal(new Date(event.nextDate))}
                        </Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="body2">No Upcoming Events</Typography>
            )}
        </Paper>
    );
};

export default NotificationPopup;
