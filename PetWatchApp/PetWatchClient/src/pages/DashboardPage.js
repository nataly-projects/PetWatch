import React from 'react';
import { Route, Routes } from 'react-router-dom';

import UserProfile from './UserProfile';
import Sidebar from '../components/DashboardSideBar';
// import Notifications from '../components/Notifications';
import '../styles/Dashboard.css';


const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/pets"  />
          <Route path="/routine-care"  />
          <Route path="/vaccination-managment"  />
          <Route path="/weight-monitor"  />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/pets"  />
          <Route path="/notifications" />
        </Routes>

      </div>
    </div>
  );
};

export default Dashboard;


