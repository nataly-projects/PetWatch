import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Calendar from 'react-calendar';
import { Tooltip, Box, Typography, CircularProgress, Button } from '@mui/material';
import { fetchUserPetsActivitiesForMonth } from '../services/userService';
import ExportToCSVButton from './ExportToCSVButton';

const CalendarSection = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [activities, setActivities] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchActivitiesForMonth = async (year, month) => {
    try {
      const allActivities = await fetchUserPetsActivitiesForMonth(user._id, token, year, month + 1);
      setActivities(allActivities);
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivitiesForMonth(date.getFullYear(), date.getMonth());
  }, [date]);

  const handleMonthChange = ({ activeStartDate }) => {
    setDate(activeStartDate);
    fetchActivitiesForMonth(activeStartDate.getFullYear(), activeStartDate.getMonth());
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
      const activity = activities.find(activity =>
        new Date(activity.date).toDateString() === date.toDateString() ||
        new Date(activity.nextDate).toDateString() === date.toDateString()
      );

      if (activity) {
        return activity.vaccineType
          ? 'tile-vaccine-type'
          : activity.activity
          ? 'tile-routine-care'
          : 'tile-vet-visit';
      }
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
        <Button variant="contained" onClick={() => fetchActivitiesForMonth(date.getFullYear(), date.getMonth())}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box   
    sx={{
       backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      '.react-calendar': {
        border: '1px solid #ccc',
        boxShadow: '2',
        p: 2,
      },
      '.react-calendar__navigation': {
        display: 'flex',
        justifyContent: 'space-between',
        mb: 2,
        button: {
          color: '#007bff',
          fontSize: '1rem',
          fontWeight: 'bold',
          '&:hover': {
            color: '#0056b3',
          },
        },
      },
      '.react-calendar__month-view__weekdays': {
        fontWeight: 'bold',
        color: '#555',
        mb: 1,
      },
      '.react-calendar__tile': {
        textAlign: 'center',
        p: 1,
        borderRadius: 1,
        '&:hover': {
          backgroundColor: '#f5f5f5',
        },
      },
      '.react-calendar__tile--now': {
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
      },
      '.react-calendar__tile--active': {
        backgroundColor: '#007bff',
        color: 'white',
        fontWeight: 'bold',
        '&:hover': {
          backgroundColor: '#0056b3',
        },
      },
      '.react-calendar__tile--hasActive': {
        backgroundColor: 'rgba(0, 123, 255, 0.15)',
      },
    }}>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent}
        onActiveStartDateChange={handleMonthChange}
        tileClassName={tileClassName}
        className="custom-calendar"
      />
      {/* <Box sx={{ mt: 2 }}>
        <ExportToCSVButton
          data={activities}
          filename={`activities-${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.csv`}
        />
      </Box> */}
    </Box>
  );
};

export default CalendarSection;
