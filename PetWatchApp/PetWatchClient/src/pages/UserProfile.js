import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { editUserDetails, changePassword } from '../services/userService';
import userDefaultImage from '../images/default-user-profile-image.png';
import ForgotPassword from '../components/ForgotPassword';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [selectedImageProfile, setSelectedImageProfile] = useState(null);
  const [editDetailsMode, setEditDetailsMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    imageUrl: selectedImageProfile ? selectedImageProfile : null
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

  const onProfileImageDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
    if (acceptedFiles && acceptedFiles.length > 0) {
        const selectedImage = acceptedFiles[0];
        setSelectedImageProfile(selectedImage);
    }
  };

  const profileImageDropzone = useDropzone({
    onDrop: onProfileImageDrop,
    accept: {
        'image/*': ['.jpeg', '.jpg', '.png'],
    },
    multiple: false,
  });

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
          <div className="user-image-container">
            <label> Your image:</label>
            <img className="user-image"
            src={ (selectedImageProfile ? URL.createObjectURL(selectedImageProfile) : userDefaultImage)} 
            alt="Pet Profile Image" 
            />
            <div className="upload-overlay"  {...profileImageDropzone.getRootProps()}>
              <input  {...profileImageDropzone.getInputProps()} />
              <p>Drag & drop an image here, or click to select one</p>
            </div>
          </div>
          <div className='input-container'>
            <label className='label'>Full Name:</label>
            <input className='input-field'
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleDetailsChange}
            />
        {deailsErrors.fullName && <div className="error-message">{deailsErrors.fullName}</div>} 
        </div>

        <div className='input-container'>
          <label className='label'>Email:</label>
          <input className='input-field'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleDetailsChange}
          />
        {deailsErrors.email && <div className="error-message">{deailsErrors.email}</div>} 
        </div>

        <div className='input-container'>
          <label className='label'>Phone:</label>
          <input className='input-field'
            type="phone"
            name="phone"
            value={formData.phone}
            onChange={handleDetailsChange}
          />
        {deailsErrors.phone && <div className="error-message">{deailsErrors.phone}</div>} 
        </div>

          <div className='actions'>
            <button onClick={handleSaveDetailsClick}>Save</button>
            <button onClick={handleCancelDetailsClick}>Cancel</button>
          </div>   
        </div>
      ) : (
        <div className="view-profile">
          <h3>Your Details:</h3>
          <div className="user-image-container">
          <img className='user-image'
          src={user.imageUrl ? `http://localhost:5001/${user.imageUrl}` : userDefaultImage} 
          alt={user.fullName} 
          />
          </div>
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
          <div className='input-container'>
            <label className='label'>Old Password:</label>
            <input className='input-field'
              type="password"
              name="oldPassword"
              value={changePasswordData.oldPassword}
              onChange={handlePasswordChange}
            />
          {passwordErrors.oldPassword && <div className="error-message">{passwordErrors.oldPassword}</div>} 
          </div>
          
          <div className='input-container'>
            <label className='label'>New Password:</label>
            <input className='input-field'
              type="password"
              name="newPassword"
              value={changePasswordData.newPassword}
              onChange={handlePasswordChange}
            />
          {passwordErrors.newPassword && <div className="error-message">{passwordErrors.newPassword}</div>} 
          </div>

          <div className='input-container'>
            <label className='label'>Confirm New Password:</label>
            <input className='input-field'
              type="password"
              name="confirmPassword"
              value={changePasswordData.confirmPassword}
              onChange={handlePasswordChange}
            />
          {passwordErrors.confirmPassword && <div className="error-message">{passwordErrors.confirmPassword}</div>} 
          </div>
            
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
