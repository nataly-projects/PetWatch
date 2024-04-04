import React, { useState, useEffect } from 'react';
// import PetCard from './PetCard';
import ActivityLog from './ActivityLog';
import ExpenseTracker from './ExpenseTracker';
// import { getPetData, getActivityLog, getExpenseData } from '../api'; // Assuming API functions for fetching data

const Dashboard = () => {

    return (
        <div>
            <h1>This is the Dashboard</h1>
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