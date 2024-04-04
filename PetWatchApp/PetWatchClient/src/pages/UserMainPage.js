import React from 'react';
import { Route, Routes } from 'react-router-dom';

import UserProfile from './UserProfile';
import Sidebar from '../components/SideBar';
import ActivityLog from '../components/ActivityLog';
import Dashboard from '../components/Dashboard';
import DogCarePage from './DogCarePage';
import CatCarePage from './CatCarePage';
import CatGuide from '../components/CatGuide';
import DogGuide from '../components/DogGuide';
import PetNamesIdea from '../components/PetNamesIdea';
import EmergencyGuide from './EmergencyGuide';
import '../styles/UserMainPage.css';


const UserMainPage = () => {
  return (
    <div className="user-main-container">
      <Sidebar />
      <div className="user-main-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dog-care" element={<DogCarePage />} />
          <Route path="/cat-care" element={<CatCarePage />} />
          <Route path="/dog-guide" element={<DogGuide />} />
          <Route path="/cat-guide" element={<CatGuide />} />
          <Route path="/pet-names" element={<PetNamesIdea />} />
          <Route path="/emergency-guide" element={<EmergencyGuide />} />
          {/* <Route path="/activity-log" element={<ActivityLog />} />
           <Route path="/weight-tracker" element={<WeightTracker />} /> 
           <Route path="/profile" element={<UserProfile />} />  */}

           {/* <Route path="/dashboard/:petId" element={<PetProfile />} />
          <Route path="/pets-expenses" element={<PetsExpenses />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />  */}
        </Routes>
      </div>
    </div>
  );
};

export default UserMainPage;


