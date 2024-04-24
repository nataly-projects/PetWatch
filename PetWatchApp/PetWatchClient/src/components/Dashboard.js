import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { faPaw, faMoneyCheck } from '@fortawesome/free-solid-svg-icons'; // Importing sample icons
import { getPetsByUserId } from '../services/petService'; 
import { fetchUserActivityLog, fetchUserNotes, fetchUserUpcomingEvents, fetchUserExpensesArray, fetchUserAccountSettings } from '../services/userService';
import { Currency } from '../utils/utils';
import DashboardCard from './DashboardCard';
import PetSlider from './PetSlider';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
import NoteSection from './NoteSection';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const user = useSelector((state) => state.user);

  const [pets, setPets] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [notes, setNotes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
        const userPets = await getPetsByUserId(user._id);
        const logs = await fetchUserActivityLog(user._id); 
        const notes = await fetchUserNotes(user._id); 
        const events = await fetchUserUpcomingEvents(user._id);
        const userExpenses = await fetchUserExpensesArray(user._id);
        const userAccountSettings  = await fetchUserAccountSettings(user._id);
        setPets(userPets);
        setActivityLogs(logs);
        setNotes(notes);
        setExpenses(userExpenses);
        setUpcomingEvents(events);
        setCurrency(userAccountSettings.accountSettings.currency);
        setLoading(false);
    } catch (error) {
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

  return (
    <div className="dashboard-container">
        <div className="top-row">
            <DashboardCard 
            title="Number of Pets" 
            icon={faPaw}
            content={`${pets.length}`} />
        
            <DashboardCard 
            title="Total Expenses" 
            icon={faMoneyCheck}
            content={`${user.totalExpenses}  ${Currency[currency].sign}`} />

        </div>
      
      <h3>Your pets:</h3>
      <div className="pet-section">
        <PetSlider 
        pets={pets} 
        currencySign={`${Currency[currency].sign}`}
        />
      </div>

      
      <div className="activity-log">
        <ActivityLog
        activityLogs={activityLogs}
        upcomingEvents={upcomingEvents}
        petName={null}
        />
      </div>

      <div className="notes">
        <NoteSection 
        propsNotes={notes}
        petId={null} />
      </div>

      <ExpenseTracker 
      expenses={expenses}
      from={'user'}
      />


      <div className="add-pet">
        <button className='add-btn'>Add New Pet</button>
      </div>
    </div>
  );


};

export default Dashboard;