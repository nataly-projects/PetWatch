import './App.css';
import React from 'react';
import { BrowserRouter , Route, Routes  } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './store';

import NavBar from './components/NavBar';
import UserMainPage from './pages/UserMainPage';
import SignupLoginPage from './pages/signupLoginPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ImportantInfoPage from './pages/ImportantInfoPage';
import DogCarePage from './pages/DogCarePage';
import CatCarePage from './pages/CatCarePage';
import PetNamesIdea from './components/PetNamesIdea';
import DogGuide from './components/DogGuide';
import CatGuide from './components/CatGuide';
import EmergencyGuide from './pages/EmergencyGuide';

const App = () => {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);
console.log('isLoggedIn: ', isLoggedIn);

  return (
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
      <div className="App">
        <NavBar  />
        <div className={isLoggedIn ? 'page-body-logged-in' : 'page-body-logged-out'}>
          <Routes>
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
