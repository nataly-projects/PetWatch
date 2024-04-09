import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import WeightTracker from './WeightTracker';
import NoteSection from './NoteSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import { getPetActivityLog, getPetUpcomingEvents, getPetExpensesArrays } from '../services/petService';
import { formatDate } from '../utils/utils';
import '../styles/PetProfile.css';
import {Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import { Pie } from 'react-chartjs-2'; 

const PetProfile = () => {
  Chart.register(ArcElement, Tooltip, Legend);
  const pieChartOptions = { 
    plugins: {
        legend: {
            position: 'top', 
        },
        tooltip: {
            enabled: true, 
        },
    },
    responsive: true,
    maintainAspectRatio: false
 };

  const location = useLocation();
  const { pet } = location.state;

  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expenses, setExpenses] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
        const logs = await getPetActivityLog(pet._id);
        const events = await getPetUpcomingEvents(pet._id);
        const petExpenses = await getPetExpensesArrays(pet._id);
        console.log('####petExpenses: ', petExpenses);
        setActivityLogs(logs);
        setUpcomingEvents(events);
        setExpenses(petExpenses);
        setLoading(false);
    } catch (error) {
        console.error('Error fetching data:', error);
        setError(true);
        setLoading(false);
    }
  };

  useEffect(() => {
    if (pet) {
        fetchData();
    }
  }, [pet]);


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
          <div>
              <p>Failed to fetch expense data. Please try again later.</p>
              <button onClick={fetchData}>Retry</button>
          </div>
      );
  }

  const {  monthlyExpensesChartData, categoryExpensesChartData } = expenses;

  const renderPetExpensesCharts = () => {
    return (
      <div>
        <div className="chart-container">
          <h2>Chart Expenses By Month</h2>
          <div className="chart-wrapper">
            <Pie data={{
              labels: monthlyExpensesChartData.map(item => item.month),
              datasets: [{
              label: 'Expenses By Month',
              data: monthlyExpensesChartData.map(item => item.amount),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
              }]
            }}
            options={pieChartOptions}
            />
          </div>
      </div>
      <div className="chart-container">
          <h2>Chart Expenses By Category</h2>
          <div className="chart-wrapper">
            <Pie data={{
              labels: categoryExpensesChartData.map(item => item.category),
              datasets: [{
              label: 'Expenses By Category',
              data: categoryExpensesChartData.map(item => item.amount),
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
              }]
            }}
            options={pieChartOptions}
          />
         </div>
      </div>
      </div>

      );
  }

  return (
    <div className="pet-profile-container">
      <div className="pet-details-card">
        <img src={pet.image} alt={pet.name} />
        <div className='name-species-section'>
                <h3>{pet.name}</h3>
                {pet.species === 'MALE' ? (
                <FontAwesomeIcon icon={faMars}  /> 
                ) : (
                <FontAwesomeIcon icon={faVenus}  /> 
                )} 
          </div>
        <p> Breed: {pet.breed}</p>
        <p> Age: {pet.age} </p>
        <p> Weight: {pet.weight} kg</p>
        <p> About {pet.name}: {pet.description}</p>
        <p>Chip Number: {pet.chipNumber ? pet.chipNumber : 'No chip number'}</p>
       
      </div>

      <div className="health-information">
        <h3>Health Information</h3>
        <p>Medications: {pet.medications.length > 0 ? pet.medications : 'No Medications'}</p>
        <p>Allergies: {pet.allergies.length > 0 ? pet.allergies : 'No Allergies'}</p>

        {/* <p>Vaccination Records: {pet.vaccinationRecords}</p>
        <p>Medications: {pet.medications}</p>
        <p>Allergies: {pet.allergies}</p>
        <p>Medical Conditions: {pet.medicalConditions}</p> */}
      </div>

      <div className="activity-log">
        <h3> {pet.name} Activity Log: </h3>
        {/* TODO - Display recent activity log for the specific dog */}
        <table className='table'>
                <thead>
                    <tr>
                    <th>Date</th>
                    <th>Action Type</th>
                    <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {activityLogs.map(log => (
                        <tr key={log._id}>
                            <td>{formatDate(log.created_at)}</td>
                            <td>{log.actionType}</td>
                            <td>{log.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3> {pet.name} Upcoming Events</h3>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Action Type</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {upcomingEvents.map(event => (
                        <tr key={event._id}>
                            <td>{formatDate(event.nextDate)}</td>
                            <td>{event.actionType}</td>
                            <td>{event.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
      </div>

      <div className="weight-tracker">
        <h3>Weight Tracker</h3>
        {/* TODO - Display weight tracking graph */}
        {/* <WeightTracker pet={pet} /> */}
      </div>

      <div className="expenses">
        <h3>Expenses</h3>
        {/* TODO - add 2 pie chart for the pet expenses - by month, and by category - 
        change the server function as needed */}
        {renderPetExpensesCharts()}
      </div>

      <div className="meal-planner">
        <h3>Meal Planner</h3>
        {/* TODO -Allow users to plan and schedule meals */}
      </div>

      <div className="gallery">
        <h3>Gallery</h3>
        {/* TODO - Display pet photos in a gallery */}
      </div>

      <div className="notes">
        <h3>Notes</h3>
        {/* TODO - Allow users to add and view notes -
            show like a table - with column - 
            date created, update date, note, actions (edit, remove)
            and option to add row,
            and for each row - option to delte or remove
         */}
         <NoteSection petNote={pet.notes} />
      </div>

      {/* <div className="emergency-contacts">
        <h3>Emergency Contacts</h3>
        {// Display emergency contact information }
      </div> */}

      <div className="edit-delete-options">
        {/* TODO - Provide options to edit or delete pet profile */}
      </div>
    </div>
  );
};

export default PetProfile;
