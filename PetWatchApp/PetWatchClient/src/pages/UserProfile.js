import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ForgotPassword from '../components/ForgotPassword';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const user = useSelector((state) => state.user);
  const [editDetailsMode, setEditDetailsMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
  });
  const [changePasswordData, setChangePasswordData] = useState({
    email: user.email,
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

  const handleSaveDetailsClick = () => {
    console.log('Edited details data:', formData);
    if (validateDetailsInput()) {
      setEditDetailsMode(false);

      //make the requests
      //make toast for succes / error
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
    }
    setPasswordErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSaveChangePasswordClick = () => {
    console.log('Edited chaneg password data:', formData);
    if (validateChanePasswordInput()) {
      setChangePasswordMode(false);

      //make the requests
      //make toast for succes / error
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

  const handleChangePasswordClick = () => {
    console.log('Change password clicked');
    setChangePasswordMode(true);
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
          <p>Full Name: {user.fullName}</p>
          <p>Email: {user.email}</p>
          <p>phone: {user.phone}</p>
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
              <button onClick={handleChangePasswordClick}>Change Password</button>
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
