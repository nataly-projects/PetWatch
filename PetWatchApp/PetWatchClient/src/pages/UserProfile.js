import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify';
import { editUserDetails, changePassword } from '../services/userService';
import ForgotPassword from '../components/ForgotPassword';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [editDetailsMode, setEditDetailsMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
  });
  const [changePasswordData, setChangePasswordData] = useState({
    email: formData.email,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [deailsErrors, setDetailsErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false); 

// details functions

  const initFormData = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    });
  };

  const validateDetailsInput = () => {
    const validationErrors = {};
    if (!formData.fullName) {
      validationErrors.fullName = 'Name is required';
    }
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    }
    if (!formData.phone) {
      validationErrors.phone = 'Phone is required';
    }
    setDetailsErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleEditDetailsClick = () => {
    setEditDetailsMode(true);
  };

  const handleSaveDetailsClick = async () => {
    if (validateDetailsInput()) {
      setEditDetailsMode(false);
      try {
        await editUserDetails(user._id, formData, token); 
        toast.success('Details updated successfully!');
      } catch (error) {
        initFormData();
        if (error.response && error.response.status === 401) {
          console.error('UNAUTHORIZED_ERROR');
          navigate('/login');
        }
        console.error('Error fetching data:', error);
      }
    }
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCancelDetailsClick = () => {
    setEditDetailsMode(false);
    initFormData();
    setDetailsErrors({});
  };

// change password functions

  const initPasswordForm = () => {
    setChangePasswordData({
      email: user.email,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const validateChanePasswordInput = () => {
    const validationErrors = {};
    if (!changePasswordData.oldPassword) {
      validationErrors.oldPassword = 'Old password is required';
    }
    if (!changePasswordData.newPassword) {
      validationErrors.newPassword = 'New password is required';
    }
    if (!changePasswordData.confirmPassword) {
      validationErrors.confirmPassword = 'Confirm new password is required';
    } else if( changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSaveChangePasswordClick = async () => {
    if (validateChanePasswordInput()) {
      setChangePasswordMode(false);
      try {
        await changePassword(changePasswordData, token); 
        toast.success('Password changed successfully!');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('UNAUTHORIZED_ERROR');
          navigate('/login');
        }
        console.error('Error fetching data:', error);
      }
    }
  };

  const handleCancelChangePasswordClick = () => {
    setChangePasswordMode(false);
    setPasswordErrors({});
    initPasswordForm();
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  return (
    <div className="user-profile">
      <h2>{user.fullName} Profile</h2>
      {editDetailsMode ? (
        <div className="edit-profile">
          {/* add image section */}
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleDetailsChange}
          />
        {deailsErrors.fullName && <div className="error-message">{deailsErrors.fullName}</div>} 

          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleDetailsChange}
          />
        {deailsErrors.email && <div className="error-message">{deailsErrors.email}</div>} 

          <label>Phone:</label>
          <input
            type="phone"
            name="phone"
            value={formData.phone}
            onChange={handleDetailsChange}
          />
        {deailsErrors.phone && <div className="error-message">{deailsErrors.phone}</div>} 

          <div className='actions'>
            <button onClick={handleSaveDetailsClick}>Save</button>
            <button onClick={handleCancelDetailsClick}>Cancel</button>
          </div>   
        </div>
      ) : (
        <div className="view-profile">
          <h3>Details:</h3>
          <p>Full Name: {formData.fullName}</p>
          <p>Email: {formData.email}</p>
          <p>phone: {formData.phone}</p>
          <button onClick={handleEditDetailsClick}>Edit</button>
        </div>
      )}
      <div className="change-password">
        <h3>Change Password</h3>
        { changePasswordMode ? 
          <>
            <label>Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              value={changePasswordData.oldPassword}
              onChange={handlePasswordChange}
            />
          {passwordErrors.oldPassword && <div className="error-message">{passwordErrors.oldPassword}</div>} 

            <label>New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={changePasswordData.newPassword}
              onChange={handlePasswordChange}
            />
          {passwordErrors.newPassword && <div className="error-message">{passwordErrors.newPassword}</div>} 

            <label>Confirm New Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={changePasswordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          {passwordErrors.confirmPassword && <div className="error-message">{passwordErrors.confirmPassword}</div>} 

            <div className='actions'>
              <button onClick={handleSaveChangePasswordClick}>Save</button>
              <button onClick={handleCancelChangePasswordClick}>Cancel</button>
            </div>   
          </>
          :
          <>
            <p>Here you can change your password </p>
            <div className='actions'>
              <button onClick={() =>  setChangePasswordMode(true)}>Change Password</button>
              <button onClick={() => setShowForgotPassword(true)}>Forgot Password</button>
            </div>
          </>
        }
      </div>
      {/* Forgot Password modal */}
        {showForgotPassword && (
          <ForgotPassword
          onClose={() => setShowForgotPassword(false)}
          />
        )}
    </div>
  );
};

export default UserProfile;
