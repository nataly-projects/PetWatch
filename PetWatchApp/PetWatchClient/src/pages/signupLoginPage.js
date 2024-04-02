import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import '../styles/SignupLoginPage.css'; 

const SignupLoginPage = () => {
  const [isLoginPage, setIsLoginPage] = useState(true);

  const setLoginPage = (isLoginPage) => {
    setIsLoginPage(isLoginPage);
  };

  return (
    <div className='page-container'>
        <div className="signup-login-page" >
            <div className="signup-login-page-nav">
                <div
                className={`nav-option bold pointer ${isLoginPage ? '' : 'nav-selected'}`}
                onClick={() => setLoginPage(false)}
                >
                Sign Up
                </div>
                <div
                className={`nav-option bold pointer ${isLoginPage ? 'nav-selected' : ''}`}
                onClick={() => setLoginPage(true)}
                >
                Sign In
                </div>
            </div>

            {isLoginPage ? (
                <Login  />
            ) : (
                <Register />
            )}
    </div>
    </div>
   
  );
};

export default SignupLoginPage;
