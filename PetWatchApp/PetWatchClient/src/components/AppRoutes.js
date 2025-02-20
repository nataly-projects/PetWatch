import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import UserMainPage from '../pages/UserMainPage';
import SignupLoginPage from '../pages/SignupLoginPage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ImportantInfoPage from '../pages/ImportantInfoPage';
import DogCarePage from '../pages/DogCarePage';
import CatCarePage from '../pages/CatCarePage';
import PetNamesIdea from '../components/PetNamesIdea';
import DogGuide from '../components/DogGuide';
import CatGuide from '../components/CatGuide';
import EmergencyGuide from '../pages/EmergencyGuide';

import UserProfile from '../pages/UserProfile';
import ActivityLog from '../components/ActivityLog';
import Dashboard from '../components/Dashboard';
import ExpenseTracker from '../components/ExpenseTracker';
import PetProfile from '../components/PetProfile';
import AccountSettings from '../components/AccountSettings';
import PetsSection from '../components/PetsSection';
import AddPetForm from '../components/AddPetForm';
import TaskListPage from '../pages/TaskListPage';

const AppRoutes = ({ isUserRoute = false }) => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  return (
    <div className={isLoggedIn ? 'page-body-logged-in' : 'page-body-logged-out'}>
      <Routes>
        {isUserRoute ? (
        <>
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
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/pets" element={<PetsSection />} />
          <Route path="/add-pet" element={<AddPetForm />} />
          <Route path="/contact-us" element={<ContactPage />} />
        </> )
        :
        (
        <>
            <Route path="*"  element={isLoggedIn ? <UserMainPage /> : <SignupLoginPage /> } />
            <Route path="/main/*"  element={<UserMainPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<SignupLoginPage />} />
    
            <Route path="/info" element={<ImportantInfoPage />} />
            <Route path="/info/dog-care" element={<DogCarePage />} />
            <Route path="/info/cat-care" element={<CatCarePage />} />
            <Route path="/info/pet-names" element={<PetNamesIdea />} />
            <Route path="/info/dog-guide" element={<DogGuide />} />
            <Route path="/info/cat-guide" element={<CatGuide />} />
            <Route path="/info/emergency-guide" element={<EmergencyGuide />} />
        </>
        )}
      
      </Routes>
    </div>
  );
};


export default AppRoutes;
