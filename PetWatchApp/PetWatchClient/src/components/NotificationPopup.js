import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserUpcomingEvents } from '../services/userService';
import { Box, Paper, Typography, IconButton, Divider, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { formatDateUniversal } from '../utils/utils';
import useFetch from '../hooks/useFetch';

const StyledPaper = styled(Paper)({
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
});


const NotificationPopup = ({ onClose }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const { data: events, loading, error } = useFetch(
        fetchUserUpcomingEvents,
        user?._id && token ? [user._id, token] : null,
        null
    );

    if (loading) {
        return (
            <StyledPaper>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
            <CircularProgress />
            <Typography mt={2}>Loading...</Typography>
          </Box>
          </StyledPaper>
        );
    }
    
    if (error) {
        console.error('Error fetching dashboard data:', error);
    
        if (error.response?.status === 401) {
          navigate('/login');
          return null;
        }
    
        return (
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
            <Typography>Failed to fetch dashboard data. Please try again later.</Typography>
            <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
              Retry
            </Button>
          </Box>
        );
    }

    return (
        <StyledPaper >
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
        </StyledPaper>
    );
};

export default NotificationPopup;
