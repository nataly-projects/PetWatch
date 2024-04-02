import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons';
// import ForgotPassword from './ForgotPassword';
import {isValidEmail, hashPassword} from '../utils/utils';
import { loginUser } from '../services/userService';
import '../styles/Login.css';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState(''); 
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [submitAllowed, setSubmitAllowed] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isForgotPasswordModalIsOpen, setForgotPasswordModalIsOpen] = useState(false); 
  console.log('isForgotPasswordModalIsOpen: ', isForgotPasswordModalIsOpen);

  useEffect(() => {
    if (!emailError && !passwordError) {
      setSubmitAllowed(true);
    } else {
      setSubmitAllowed(false);
    }
  }, [email, password]);

    // Function to open the Forgot Password modal
    const openForgotPasswordModal = () => {
      console.log('openForgotPasswordModal');
      setForgotPasswordModalIsOpen(true);
    };

    // Function to close the Forgot Password modal
    const closeForgotPasswordModal = () => {
      console.log('closeForgotPasswordModal');
      setForgotPasswordModalIsOpen(false);
    };

    const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit =  async (event) => {
      console.log(event);
      event.preventDefault();
      // Clear other error states
      setEmailError('');
      setPasswordError('');

      // Perform validation checks:
      if (!email) {
        setEmailError('Email is required');
        console.log(emailError);
      } else if (!isValidEmail(email)) { 
        setEmailError('Invalid email format');
      }

      if (!password) {
        setPasswordError('Password is required');
      } else if (password.length < 3) {
        setPasswordError('Password must be at least 8 characters long');
      }
      // If all validation passes, proceed with form submission - make the HTTP request to the server
      console.log(submitAllowed);

      if(submitAllowed){
        try {
          //const hashedPassword = await hashPassword(password);

          const userLoginData = await loginUser(email, password);
          console.log('userLoginData: ', userLoginData);
          if (userLoginData) {
            dispatch({ type: 'SET_USER', payload: userLoginData });
            navigate('/dashboard/adopt');
          }
          
        } catch (error) {
          console.log('error: ', error);
          // Handle specific error messages from the server
          if (error.response && error.response.data && error.response.data.error) {
              setError(error.response.data.error);
          } else {
              // Handle other errors
              console.log(error);
              setError('An error occurred while processing your request');
          }
        }
      }
    };
  

    return (
      <div className="login">
        <div className="title bold text-center">Welcome back to Happy Tails</div>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="form-row">
              <label>Email address:</label>
              <div className="input-group">
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon"/> 
                  <input 
                  required
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  />
              </div>
              {emailError && <p className="error-message">{emailError}</p>}
            </div>

      
            <div className="form-row">
              <label>Password:</label>
              <div className="input-group">
                  <FontAwesomeIcon icon={faLock} className="input-icon"/> 
                  <input
                  required
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  <FontAwesomeIcon
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                  className="pass-icon"
                  onClick={togglePasswordVisibility} />
              </div>
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>

            <button className="sign-button" type="submit">Sign In</button>

          </div>
          {error && <p className="error-message">{error}</p>}

        </form>
        <div className="forgot-password" onClick={openForgotPasswordModal}>
          Forgot password?
        </div>

        {/* Forgot Password modal */}
        {/* {isForgotPasswordModalIsOpen && (
          <ForgotPassword
            closeModal={closeForgotPasswordModal}
          />
        )} */}
      </div>
    );

};

export default Login;

