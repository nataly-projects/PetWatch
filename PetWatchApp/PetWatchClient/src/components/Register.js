import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faEyeSlash, faEye, faUser, faPhone } from '@fortawesome/free-solid-svg-icons';
import {isValidEmail, hashPassword, isValidPhoneNumber} from '../utils/utils';
import { signupUser } from '../services/userService';
import '../styles/Login.css';


const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [passwordError, setPasswordError] = useState(''); 
    const [confirmPasswordError, setConfirmPasswordError] = useState(''); 
    const [submitAllowed, setSubmitAllowed] = useState(false);

    const dispatch = useDispatch();

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
      if (!fullNameError && !emailError && !passwordError && !confirmPasswordError && !phoneNumberError) {
        setSubmitAllowed(true);
      } else {
        setSubmitAllowed(false);
      }
    }, [fullName, email, password, confirmPassword, phoneNumber]);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const clearErrors = () => {
        setFullNameError('');
        setEmailError('');
        setPhoneNumberError('');
        setPasswordError('');
        setConfirmPasswordError('');
    };

    
    const handleSubmit = async (event) => {
      event.preventDefault();
      // Clear other error states
      clearErrors();

      if (!fullName) {
        setFullNameError('Full Name is required');
      }

      if (!email) {
        setEmailError('Email is required');
      } else if (!isValidEmail(email)) { 
        setEmailError('Invalid email format');
      }

      if (!phoneNumber) {
        setPhoneNumberError('Phone Number is required');
      } else if (!isValidPhoneNumber(phoneNumber)) {
        setPhoneNumberError('Invalid phone number format');
      }

      if (!password) {
        setPasswordError('Password is required');
      } else if (password.length < 3) { // Example password validation rule
        setPasswordError('Password must be at least 3 characters long');
      }

      if (!confirmPassword) {
        setConfirmPasswordError('Confirm Password is required');
      } else if (confirmPassword.length < 3) { 
        setConfirmPasswordError('Password must be at least 3 characters long');
      } else if( password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        return;
      }

      // If all validation passes, make the HTTP request to the server
      if(submitAllowed){
        try {
          //const hashedPassword = await hashPassword(password);

          const registerUser = await signupUser(fullName, email, phoneNumber, password);
          console.log('registerUser: ', registerUser);
          if (registerUser) {
            dispatch({ type: 'SET_USER', payload: registerUser });
            navigate('/dashboard/adopt');
          }
        } catch (error) {
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
        <div className="title bold text-center">Become a Pet Watch member</div>
        <div className="secondary-title text-center">
          Sign up to get the most of Pet Watch website
        </div>
        <form onSubmit={handleSubmit} >
          <div className="form">
          <div className="form-row">
            <label htmlFor="fullName">Full Name:</label>
            <div className="input-group">
              <FontAwesomeIcon icon={faUser} className="input-icon"/> 
              <input required type="text" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            {fullNameError && <div className="error-message">{fullNameError}</div>}
          </div>
            <div className="form-row">
              <label htmlFor="email">Email:</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon"/> 
                <input required type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {emailError && <div className="error-message">{emailError}</div>}
            </div>
            <div className="form-row">
              <label htmlFor="phone">Phone:</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faPhone} className="input-icon"/> 
                <input required type="number" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              {phoneNumberError && <div className="error-message">{phoneNumberError}</div>}
            </div>
            <div className="form-row">
              <label htmlFor="password">Password:</label>
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
                  onClick={togglePasswordVisibility}
                />
              </div>
              {passwordError && <div className="error-message">{passwordError}</div>}
            </div>
            <div className="form-row">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon"/> 
                <input
                  required
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEye : faEyeSlash}
                  className="pass-icon"
                  onClick={togglePasswordVisibility}
                />
              </div>
              {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
            </div>
            <button className="sign-button" type="submit">Sign Up</button>
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

    );

};

export default Register;