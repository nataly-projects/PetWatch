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
import ExpenseTracker from '../components/ExpenseTracker';
import PetProfile from '../components/PetProfile';
import AccountSettings from '../components/AccountSettings';
import PetsSection from '../components/PetsSection';
import AddPetForm from '../components/AddPetForm';
import ContactPage from './ContactPage';
import Calendar from '../components/Calendar';
import '../styles/UserMainPage.css';


const UserMainPage = () => {
  return (
    <div className="user-main-container">
      <Sidebar />
      <div className="user-main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pet-profile/:petId" element={<PetProfile />} />
          <Route path="/dog-care" element={<DogCarePage />} />
          <Route path="/cat-care" element={<CatCarePage />} />
          <Route path="/dog-guide" element={<DogGuide />} />
          <Route path="/cat-guide" element={<CatGuide />} />
          <Route path="/pet-names" element={<PetNamesIdea />} />
          <Route path="/emergency-guide" element={<EmergencyGuide />} />
          <Route path="/expenses" element={<ExpenseTracker />} />
          <Route path="/activity-log" element={<ActivityLog />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/pets" element={<PetsSection />} />
          <Route path="/add-pet" element={<AddPetForm />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/calendar" element={<Calendar />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserMainPage;


