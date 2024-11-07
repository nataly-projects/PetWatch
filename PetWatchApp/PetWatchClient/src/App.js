import './App.css';
import React from 'react';
import NavBar from './components/NavBar';
import AppRoutes from './components/AppRoutes';

const App = () => {

  return (
    <div className="App">
      <NavBar  />
      <AppRoutes />
    </div>

  );
};

export default App;
