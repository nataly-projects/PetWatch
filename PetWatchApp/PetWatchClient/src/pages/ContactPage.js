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
  // const [emailError, setEmailError] = useState('');
  // const [nameError, setNameError] = useState(''); 
  // const [messageError, setMessageError] = useState(''); 
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const validationErrors = {};
    setError('');

    if ( !email ) {
      validationErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) { 
      validationErrors.email = 'Invalis Email';
    }

    if ( !name ) {
      validationErrors.name = 'Name is required';
    }

    if ( !message ) {
      validationErrors.message = 'Message is required';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

    const handleSubmit = async (e) => {
      e.preventDefault();

        if(validateInputs()) {
          try {
            const userId = user ? user._Id : null;
            const response = await sendContactMessage({userId, name, email, message});
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
          Thank you for your interest in Pet Watch!
        </p>

        <div className="contact-info">
          <p>Email: petwatch07@gmail.com </p>
          <p>Address: 123 Pet Avenue, Watch Valley </p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="name">Name:</label>
          <input 
          type="text" 
          id="name" 
          name="name" 
          value={name}  
          onChange={(e) => setName(e.target.value)}
          required
          />
          {errors.name && <div className="error-message">{errors.name}</div>} 

          <label htmlFor="email">Email:</label>
          <input 
          type="email" 
          id="email" 
          name="email"  
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          />
          {/* {emailError && <div className="error-message">{emailError}</div>} */}
          {errors.email && <div className="error-message">{errors.email}</div>} 

          <label htmlFor="message">Message:</label>
          <textarea 
          id="message" 
          name="message" 
          rows="4" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          />
          {errors.message && <div className="error-message">{errors.message}</div>} 

          <button className='btn' type="submit">Submit</button>
        </form>
        {error && <div className="error-message">{error}</div>}

      </div>
    </div>
  );
};

export default ContactPage;
