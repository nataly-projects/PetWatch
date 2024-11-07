import React from 'react';
import { Box } from '@mui/material';
import AppRoutes from '../components/AppRoutes';
import Sidebar from '../components/SideBar';


const UserMainPage = () => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh', 
        width: '100%'
      }}
    >
      <Sidebar />
      <Box 
        sx={{
          flex: 1,
          padding: '20px',
          backgroundColor: 'background.default', 
          height: '100%',
          marginLeft: '270px',
          // overflowY: 'auto',
        }}
      >
         <AppRoutes isUserRoute /> 
        {/* <Routes>
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
          // <Route path="/calendar" element={<CalendarSection />} /> 
        </Routes> */}
        </Box>
      </Box>
  );
};

export default UserMainPage;


