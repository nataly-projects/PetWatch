import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {isValidEmail} from '../utils/utils';
import { sendContactMessage } from '../services/userService';
import '../styles/ContactPage.css';

const ContactPage = () => {
  const user = useSelector((state) => state.user);
  
  const [email, setEmail] = useState(user ? user.email : '');
  const [name, setName] = useState(user ? user.fullName : '');
  const [message, setMessage] = useState('');

  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState(''); 
  const [messageError, setMessageError] = useState(''); 

    const handleSubmit = async (e) => {
      e.preventDefault();

      setEmailError('');
      setNameError('');
      setMessageError('');
      setError('');

      if ( !email ) {
        setEmailError('Email is required');
      } else if (!isValidEmail(email)) { 
        setEmailError('Invalid email');
      }

      if ( !name ) {
        setNameError('Name is required');
      }

      if ( !message ) {
        setMessageError('Message is required');
      }
      
      if (!emailError && !nameError && !messageError) {
        try {
          const userId = user ? user._Id : null;
          const response = await sendContactMessage(userId, name, email, message);
          if (response) {
            toast.success('Message sent successfully');
          } else {
            toast.error('An error occurred. Please try again later.');
          }
        } catch (error) {
          if (error.response && error.response.data && error.response.data.error) {
              setError(error.response.data.error);
          } else {
              setError('An error occurred while processing your request');
              toast.error('An error occurred. Please try again later.');
          }
        }
      }
    };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>
          Please fill out the form below to contact us with any questions or feedback. <br></br>
           We will get back to you as soon as possible. <br></br> 
          Thank you for your interest in Happy Tails!
        </p>

        <div className="contact-info">
          <p>Email: happytails710@gmail.com</p>
          <p>Address: 123 Pet Avenue, Happyville</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="name">Name:</label>
          <input 
          required
          type="text" 
          id="name" 
          name="name" 
          value={name}  
          onChange={(e) => setName(e.target.value)}
          />
          {nameError && <p className="error-message">{nameError}</p>}

          <label htmlFor="email">Email:</label>
          <input 
          required
          type="email" 
          id="email" 
          name="email"  
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="error-message">{emailError}</p>}

          <label htmlFor="message">Message:</label>
          <textarea 
          required
          id="message" 
          name="message" 
          rows="4" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          />
          {messageError && <p className="error-message">{messageError}</p>}

          <button type="submit">Submit</button>
        </form>
        {error && <p className="error-message">{error}</p>}

      </div>
    </div>
    
  );
};

export default ContactPage;
