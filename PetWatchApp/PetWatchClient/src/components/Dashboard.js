import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import Calendar from 'react-calendar';
import ReactTooltip from 'react-tooltip';
import { faPaw, faMoneyCheck, faCalendarAlt, faTasks } from '@fortawesome/free-solid-svg-icons'; 
import { getPetsByUserId } from '../services/petService'; 
import { fetchUserActivityLog, fetchUserNotes, fetchUserUpcomingEvents, fetchUserExpensesArray, fetchUserAccountSettings } from '../services/userService';
import { Currency } from '../utils/utils';
import DashboardCard from './DashboardCard';
import PetSlider from './PetSlider';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
import NoteSection from './NoteSection';
import CalendarSection from './Calendar';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const [pets, setPets] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [date, setDate] = useState(new Date());

  const fetchData = async () => {
    try {
        const userPets = await getPetsByUserId(user._id, token);
        const logs = await fetchUserActivityLog(user._id, token); 
        const notes = await fetchUserNotes(user._id, token); 
        const events = await fetchUserUpcomingEvents(user._id, token);
        const userExpenses = await fetchUserExpensesArray(user._id, token);
        const userAccountSettings  = await fetchUserAccountSettings(user._id, token);
        setPets(userPets);
        setActivityLogs(logs);
        setNotes(notes);
        setExpenses(userExpenses);
        setUpcomingEvents(events);
        setCurrency(userAccountSettings.accountSettings.currency);
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
      <div className="loading-container">
          <div className="loading-spinner"></div>
          <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='error-container'>
        <p>Failed to fetch user data. Please try again later.</p>
        <button className='btn' onClick={fetchData}>Retry</button>
      </div>
    );
  }

  const handleAddNewPetClick = () => {
    navigate('/add-pet');
  };  

  return (
    <div className="dashboard-container">
      <div className='top-row-container'>
        <div className="top-row">
          <DashboardCard 
          title="Number of Pets" 
          icon={faPaw}
          content={`${pets.length}`} />
      
          <DashboardCard 
          title="Total Expenses" 
          icon={faMoneyCheck}
          content={`${user.totalExpenses}  ${Currency[currency].sign}`} />

          <DashboardCard 
            title="Upcoming Events" 
            icon={faCalendarAlt}
            content={`${upcomingEvents.length}`} />
        </div>
          <DashboardCard 
          title="Opening Tasks" 
          icon={faTasks}
          content={`0`} />
      </div>

      <div className='slider-calendar-warpper'>
        <div className='pet-slider-wrapper'>
          <h3 className='pet-section-title'>Your pets:</h3>
          <div className="pet-section">
            <PetSlider 
            pets={pets} 
            />
          </div>
        </div>

        {/* <div className='calendar-wrapper'>
          <Calendar
            onChange={setDate}
            value={date}
          />
        </div> */}
        <CalendarSection />
      </div>    

      

      
      <ActivityLog
      activityLogs={activityLogs}
      upcomingEvents={upcomingEvents}
      petName={null}
      />

      <NoteSection 
      propsNotes={notes}
      petId={null} 
      />

      <ExpenseTracker 
      expenses={expenses}
      from={'user'}
      />

      <button className='btn' onClick={handleAddNewPetClick}>Add New Pet</button>

    </div>
  );


};

export default Dashboard;