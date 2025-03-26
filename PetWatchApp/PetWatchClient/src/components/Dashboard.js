import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Grid, Typography, Button, CircularProgress, Box } from '@mui/material';
import { faPaw, faMoneyCheck, faCalendarAlt, faTasks } from '@fortawesome/free-solid-svg-icons'; 
import { Currency } from '../utils/utils';
import DashboardCard from './DashboardCard';
import PetSlider from './PetSlider';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
import NoteSection from './NoteSection';
import CalendarSection from './Calendar';
import TaskList from './TaskList';
import TaskPerformanceChart from './TaskPerformanceChart';
import AddPetForm from './AddPetForm';
import { fetchUserDashboardData } from '../services/userService';
import useFetch  from '../hooks/useFetch';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [isAddPetPopupOpen, setIsAddPetPopupOpen] = useState(false);


  const { data: dashboardData, loading, error, refetch } = useFetch(
    fetchUserDashboardData,
    user?._id && token ? [user._id, token] : null
  );

  useEffect(() => {
    refetch(); 
  }, []);


  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading...</Typography>
      </Box>
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

  const { userData, activityLogs, notes, events: upcomingEvents, expenses } = dashboardData || {};
  const pets = userData?.pets || [];
  const tasks = userData?.tasks || [];
  const currency = user?.currency;

  const handleAddNewPetClick = () => {
    // navigate('/add-pet');
    setIsAddPetPopupOpen(true);
  };  

  const handleClosePopup = () => {
    setIsAddPetPopupOpen(false);
  };

  const handleDataUpdated = async () => {
    refetch();
  };

  return (
    <Box px={3} py={2} >
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard 
          title="Number of Pets" 
          icon={faPaw}
          content={`${pets.length}`} 
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard 
          title="Total Expenses" 
          icon={faMoneyCheck}
          content={`${userData?.totalExpenses} ${Currency[currency]?.sign}`}
          />
        </Grid>
       
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard 
            title="Upcoming Events" 
            icon={faCalendarAlt}
            content={`${upcomingEvents.length}`}
            />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard 
            title="Open Tasks" 
            icon={faTasks}
            content={`${tasks.filter(task => !task.completed).length}`}
          />
        </Grid>
      </Grid>


    <Box sx={{backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3, mt: 3}}>
      <Typography variant="h6">Your Pets:</Typography>
      <PetSlider pets={pets} />
    </Box>
       
    <ActivityLog activityLogs={activityLogs} upcomingEvents={upcomingEvents} />
    <Box mb={3} />
    <ExpenseTracker propsExpenses={expenses} from="user"/>

    <Grid container spacing={3}>

    <Grid item xs={12} md={8}>
      <Box display="flex" flexDirection="column" gap={3}>
        <NoteSection propsNotes={notes} />
        <CalendarSection />
      </Box>
      <Box display="flex" mt={4}>
      <Button variant="contained" onClick={handleAddNewPetClick}>Add New Pet</Button>
    </Box>
    </Grid>

    <Grid item xs={12} md={4}>
      <Box display="flex" flexDirection="column" gap={3}>
        <TaskList propTasks={tasks} token={token} userId={user?._id} />
        <TaskPerformanceChart tasks={tasks} />
      </Box>
    </Grid>
  </Grid>

    

  <AddPetForm open={isAddPetPopupOpen} handleClose={handleClosePopup} />

  </Box>

  );


};

export default Dashboard;