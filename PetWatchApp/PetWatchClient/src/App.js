import './App.css';
import React from 'react';
import { BrowserRouter , Route, Routes  } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';

import NavBar from './components/NavBar';
import Dashboard from './pages/DashboardPage';
import SignupLoginPage from './pages/signupLoginPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ImportantInfoPage from './pages/ImportantInfoPage';
import DogCarePage from './pages/DogCarePage';
import CatCarePage from './pages/CatCarePage';
import PetNamesIdea from './components/PetNamesIdea';
import DogGuide from './components/DogGuide';
import CatGuide from './components/CatGuide';

const App = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
console.log('isLoggedIn: ', isLoggedIn);

  return (
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
      <div className="App">
        <NavBar  />
        <div id="page-body">
          <Routes>
          <Route path="/"  element={isLoggedIn ? <Dashboard /> : <SignupLoginPage /> } />
            <Route path="/dashboard/*"  element={<Dashboard />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<SignupLoginPage />} />

            <Route path="/info" element={<ImportantInfoPage />} />
            <Route path="/info/dogs-vaccine" element={<DogCarePage />} />
            <Route path="/info/cats-vaccine" element={<CatCarePage />} />
            <Route path="/info/pet-names" element={<PetNamesIdea />} />
            <Route path="/info/dog-guide" element={<DogGuide />} />
            <Route path="/info/cat-guide" element={<CatGuide />} />

            {/* <Route path="/login/forgot-password" element={< ForgotPassword />} />
            <Route path="/addPetForm" element={<AddPet />} /> */}
          </Routes>
        </div>
       
      </div>
      </BrowserRouter>
    </Provider>

  );
};

export default App;
