import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
import { faPaw, faMoneyCheck } from '@fortawesome/free-solid-svg-icons'; // Importing sample icons
import { getPetsByUserId } from '../services/petService'; 
import { fetchUserActivityLog, fetchUserNotes } from '../services/userService';
import DashboardCard from './DashboardCard';
import PetSlider from './PetSlider';
import { formatDate } from '../utils/utils';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [pets, setPets] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [notes, setNotes] = useState([]);
    const user = useSelector((state) => state.user);

    const fetchUserPets = async () => {
      try {
        const userPets = await getPetsByUserId(user._id);
        console.log('userPets: ', userPets);
        setPets(userPets);
      } catch (error) {
        console.error('Error fetching pets:', error);
      }
    };

    const getUserActivityLog = async () => {
      try {
        console.log('fetchUserActivityLog');
        const logs = await fetchUserActivityLog(user._id); 
        console.log('logs: ', logs);
        setActivityLogs(logs);
        
      } catch (error) {
        console.error('Error fetching activity logs:', error);
      }
    };

    const getUserNotes = async () => {
      try {
        const notes = await fetchUserNotes(user._id); 
        console.log('notes: ', notes);
        setNotes(notes);
        
      } catch (error) {
        console.error('Error fetching activity notes:', error);
      }
    };


    useEffect(() => {
       if (user) {
        fetchUserPets();
        getUserActivityLog();
        getUserNotes();
       }
           
      }, [user]);




      const renderUserActivityLogTable = () => {
        return (
          <>
          {activityLogs.length > 0 ? (
            <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Pet Name</th>
                <th>Action Type</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map(log => (
                <tr key={log._id}>
                  <td>{formatDate(log.created_at)}</td>
                  <td>{log.petId.name}</td>
                  <td>{log.actionType}</td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
          ) : (
            <p>No activity log yet</p>
          )}
          </>
        );
      };

      //TODO -  render user notes table
      const renderUserNotesTable = () => {
        return (
          <>
          {activityLogs.length > 0 ? 
          ( <table>
          <thead>
            <tr>
              <th>Created Date</th>
              <th>Updated Date</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {notes.map(note => (
              <tr key={note._id}>
                <td>{formatDate(note.createdDate)}</td>
                <td>{note.updatedDate ? formatDate(note.updatedDate) : '-'}</td>
                <td>{note.content}</td>
              </tr>
            ))}

          </tbody>
        </table> )
        : (
          <p>No Notes yet</p>
        )}
          </>
        );
        
      }
     

      return (
        <div className="dashboard-container">
            <div className="top-row">
                <DashboardCard 
                title="Number of Pets" 
                icon={faPaw}
                content={pets.length} />
            
                <DashboardCard 
                title="Total Expenses" 
                icon={faMoneyCheck}
                content={user.totalExpenses} />
            </div>
         
          <h2>Your pets:</h2>
          <div className="pet-section">
            <PetSlider pets={pets} />
          </div>
    
          
          <div className="activity-log">
            {/* TODO - add the activity log component */}
            <h3>Your Activity Log</h3>
            {renderUserActivityLogTable()}
          </div>

          <div className="notes">
            {/* TODO - add the notes for the user */}
            <h3>Your Notes</h3>
            {renderUserNotesTable()}
          </div>

          <ExpenseTracker />
    
    
          <div className="add-pet">
            <button className='add-btn'>Add New Pet</button>
          </div>
        </div>
      );

    
    // const [totalPets, setTotalPets] = useState(0);
    // const [petsData, setPetsData] = useState([]);
    // const [activityLogs, setActivityLogs] = useState([]);
    // const [expenses, setExpenses] = useState([]);

    // useEffect(() => {
    //     // Fetch total number of pets and their profile data
    //     const fetchPetData = async () => {
    //         try {
    //             const petData = await getPetData(); // Assuming API function to fetch pet data
    //             setTotalPets(petData.length);
    //             setPetsData(petData);
    //         } catch (error) {
    //             console.error('Error fetching pet data:', error);
    //         }
    //     };

    //     // Fetch activity logs
    //     const fetchActivityLogs = async () => {
    //         try {
    //             const logs = await getActivityLog(); // Assuming API function to fetch activity logs
    //             setActivityLogs(logs);
    //         } catch (error) {
    //             console.error('Error fetching activity logs:', error);
    //         }
    //     };

    //     // Fetch expense data
    //     const fetchExpenses = async () => {
    //         try {
    //             const expenseData = await getExpenseData(); // Assuming API function to fetch expense data
    //             setExpenses(expenseData);
    //         } catch (error) {
    //             console.error('Error fetching expense data:', error);
    //         }
    //     };

    //     fetchPetData();
    //     fetchActivityLogs();
    //     fetchExpenses();
    // }, []);

    // return (
    //     <div className="dashboard">
    //         <h1>Dashboard</h1>
    //         <div className="dashboard-stats">
    //             <h2>Total Pets: {totalPets}</h2>
    //         </div>
    //         <div className="pet-profile-section">
    //             <h2>Your Pets</h2>
    //             <div className="pet-cards">
    //                 {petsData.map(pet => (
    //                     <PetCard key={pet.id} pet={pet} />
    //                 ))}
    //             </div>
    //         </div>
    //         <ActivityLog logs={activityLogs} />
    //         <ExpenseTracker expenses={expenses} />
    //     </div>
    // );
};

export default Dashboard;