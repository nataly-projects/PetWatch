import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { Grid, Typography, Button, CircularProgress, Box } from '@mui/material';
import { faPaw, faMoneyCheck, faCalendarAlt, faTasks } from '@fortawesome/free-solid-svg-icons'; 
import { getPetsByUserId } from '../services/petService'; 
import { fetchUserActivityLog, fetchUserNotes, fetchUserUpcomingEvents, fetchUserExpensesArray, 
  fetchUserAccountSettings, fetchUserTasks } from '../services/userService';
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

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [pets, setPets] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isAddPetPopupOpen, setIsAddPetPopupOpen] = useState(false);

  const fetchData = async () => {
    try {
        const userPets = await getPetsByUserId(user._id, token);
        const logs = await fetchUserActivityLog(user._id, token); 
        const notes = await fetchUserNotes(user._id, token); 
        const events = await fetchUserUpcomingEvents(user._id, token);
        const userExpenses = await fetchUserExpensesArray(user._id, token);
        const userAccountSettings  = await fetchUserAccountSettings(user._id, token);
        const userTasks = await fetchUserTasks(user._id, token); 
        setPets(userPets);
        setActivityLogs(logs);
        setNotes(notes);
        setExpenses(userExpenses);
        setUpcomingEvents(events);
        setCurrency(userAccountSettings.accountSettings.currency);
        setTasks(userTasks);
        setLoading(false);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        setError(true);
        setLoading(false);
        navigate('/login');
      }
      console.error('Error fetching data:', error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } 
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
        <CircularProgress />
        <Typography mt={2}>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={4}>
        <Typography>Failed to fetch pet data. Please try again later.</Typography>
        <Button variant="contained" onClick={fetchData} sx={{ mt: 2 }}>Retry</Button>
      </Box>
    );
  }


  const handleAddNewPetClick = () => {
    // navigate('/add-pet');
    setIsAddPetPopupOpen(true);
  };  

  const handleClosePopup = () => {
    setIsAddPetPopupOpen(false);
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
          content={`${user.totalExpenses} ${Currency[currency].sign}`}
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

    <ExpenseTracker expenses={expenses} from="user" />

    <Grid container spacing={3} mb={4}>
      <Grid item xs={12} md={8}>
          <NoteSection propsNotes={notes} />
          <CalendarSection />
      </Grid>
      <Grid item xs={12} md={4}>
        <Box display="flex" flexDirection="column" gap="10px" p={1}>
          <TaskList propTasks={tasks} token={token} userId={user._id} />
          <TaskPerformanceChart tasks={tasks} />
        </Box>
      </Grid>
    </Grid>  

    <Box display="flex" mt={4}>
      <Button variant="contained" onClick={handleAddNewPetClick}>Add New Pet</Button>
    </Box>

    <AddPetForm open={isAddPetPopupOpen} handleClose={handleClosePopup} />

  </Box>

  );


};

export default Dashboard;