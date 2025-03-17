import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { Tooltip, Box, Typography, CircularProgress, Button, Paper, Grid } from '@mui/material';
import { fetchUserPetsActivitiesForMonth } from '../services/userService';
import useFetch from '../hooks/useFetch';

const CalendarSection = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [date, setDate] = useState(new Date());

  const { data: activities, loading, error } = useFetch(
    fetchUserPetsActivitiesForMonth,
    [user._id, token, date.getFullYear(), date.getMonth() + 1],
    date
  );

  const handleMonthChange = ({ activeStartDate }) => {
    setDate(activeStartDate);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const activity = activities.find(activity =>
        new Date(activity.date).toDateString() === date.toDateString() ||
        new Date(activity.nextDate).toDateString() === date.toDateString()
      );

      if (activity) {
        return (
          <Tooltip title={`${activity.pet.name} - ${activity.vaccineType || activity.activity || 'Vet Visit'}`}>
            <Box
              sx={{
                width: 28,
                height: 28,
                bgcolor: activity.vaccineType ? 'success.light' : activity.activity ? 'warning.light' : 'info.light',
                color: 'black',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                margin: '0 auto',
                mt: 1,
              }}
            >
              {activity.pet.name[0]}
            </Box>
          </Tooltip>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {

      const today = new Date().toDateString();
      const isToday = date.toDateString() === today;
  
      const activity = activities.find(activity =>
        new Date(activity.date).toDateString() === date.toDateString() ||
        new Date(activity.nextDate).toDateString() === date.toDateString()
      );

      let classNames = [];

      if (activity) {
        if (activity.vaccineType) {
          classNames.push('tile-vaccine-type');
        } else if (activity.activity) {
          classNames.push('tile-routine-care');
        } else {
          classNames.push('tile-vet-visit');
        }
      }

      if (isToday) {
        classNames.push('current-day');
      }

      return classNames.length > 0 ? classNames.join(' ') : null;
    }
    return null;
  };



  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3 }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography>Failed to fetch user data. Please try again later.</Typography>
        <Button variant="contained" onClick={() => setDate(new Date())}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Grid container justifyContent="center" sx={{ mt: 4 }}>
      <Grid item xs={12} >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          '.react-calendar': {
            border: '1px solid #ccc',
            boxShadow: 2,
            p: 2,
            width: '100%', 
          },
          '& .react-calendar__navigation': {
            width: '70%',
            display: 'flex',
            margin: '0 auto',
            paddingBottom: '10px',
          },
          '& .react-calendar__navigation button': {
            fontSize: '1.2rem',
            fontWeight: 'bold',
          },
          '.react-calendar__tile.current-day': {
            backgroundColor: '#007bff !important',
            color: 'white !important',
            fontWeight: 'bold',
            
          },
          '.react-calendar__tile--active': {
            backgroundColor: '#007bff',
            color: 'white',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          },
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}>
          Pet Activities Calendar
        </Typography>
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
          onActiveStartDateChange={handleMonthChange}
          className="custom-calendar"
          locale="en-US"
          tileDisabled={() => false}
        />
        </Paper>
      </Grid>
    </Grid>
  );

};

export default CalendarSection;
