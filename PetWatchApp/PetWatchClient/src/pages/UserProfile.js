import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import {Avatar,Box,Button,Grid,TextField,Typography} from '@mui/material';
import { toast } from 'react-toastify';
import { editUserDetails, changePassword } from '../services/userService';
import userDefaultImage from '../images/default-user-profile-image.png';
import ForgotPassword from '../components/ForgotPassword';
import useApiActions from '../hooks/useApiActions';

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
    imageUrl: selectedImageProfile ? selectedImageProfile : null,
  });
  const [changePasswordData, setChangePasswordData] = useState({
    email: formData.email,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [detailsErrors, setDetailsErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { execute } = useApiActions();

  const onProfileImageDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedImage = acceptedFiles[0];
      setSelectedImageProfile(selectedImage);
    }
  };

  const profileImageDropzone = useDropzone({
    onDrop: onProfileImageDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png'] },
    multiple: false,
  });

  const initFormData = () => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
    });
  };

  const handleSaveDetailsClick = async () => {
    if (validateDetailsInput()) {
      setEditDetailsMode(false);
      try {
        // await editUserDetails(user._id, formData, token);
        await execute(editUserDetails, [user._id, formData, token]);
        toast.success('Details updated successfully!');
      } catch (error) {
        initFormData();
        if (error.response && error.response.status === 401) {
          console.error('UNAUTHORIZED_ERROR');
          navigate('/login');
        }
        console.error('Error updating details:', error);
      }
    }
  };

  const validateChangePasswordInput = () => {
    const validationErrors = {};
  
    // Validate old password
    if (!changePasswordData.oldPassword) {
      validationErrors.oldPassword = 'Old password is required';
    }
  
    // Validate new password
    if (!changePasswordData.newPassword) {
      validationErrors.newPassword = 'New password is required';
    }
  
    // Confirm password and check match
    if (!changePasswordData.confirmPassword) {
      validationErrors.confirmPassword = 'Confirm new password is required';
    } else if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
  
    // Set the errors state and return if valid
    setPasswordErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };
  

  const handleSaveChangePasswordClick = async () => {
    if (validateChangePasswordInput()) {
      setChangePasswordMode(false);
      try {
        // await changePassword(changePasswordData, token);
        await execute(changePassword, [changePasswordData, token]);
        toast.success('Password changed successfully!');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.error('UNAUTHORIZED_ERROR');
          navigate('/login');
        }
        console.error('Error changing password:', error);
      }
    }
  };
  

  const validateDetailsInput = () => {
    const validationErrors = {};
    if (!formData.fullName) validationErrors.fullName = 'Name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.phone) validationErrors.phone = 'Phone is required';
    setDetailsErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 3,
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        {user.fullName} Profile
      </Typography>

      {editDetailsMode ? (
        <Box component="form" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={selectedImageProfile ? URL.createObjectURL(selectedImageProfile) : userDefaultImage}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <div {...profileImageDropzone.getRootProps()}>
              <input {...profileImageDropzone.getInputProps()} />
              <Button variant="outlined">Upload Image</Button>
            </div>
          </Box>

          <Grid container spacing={2} mt={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                fullWidth
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                error={!!detailsErrors.fullName}
                helperText={detailsErrors.fullName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={!!detailsErrors.email}
                helperText={detailsErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={!!detailsErrors.phone}
                helperText={detailsErrors.phone}
              />
            </Grid>
          </Grid>

          <Box mt={2} display="flex" gap={2}>
            <Button variant="contained" onClick={handleSaveDetailsClick}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setEditDetailsMode(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">Your Details:</Typography>
          <Avatar src={user.imageUrl ? `http://localhost:5001/${user.imageUrl}` : userDefaultImage} sx={{ width: 120, height: 120, mt: 1, mb: 2 }} />
          <Typography>Full Name: {formData.fullName}</Typography>
          <Typography>Email: {formData.email}</Typography>
          <Typography>Phone: {formData.phone}</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => setEditDetailsMode(true)}>
            Edit
          </Button>
        </Box>
      )}

      <Box mt={4}>
        <Typography variant="h6">Change Password</Typography>
        {changePasswordMode ? (
          <>
            <TextField
              label="Old Password"
              name="oldPassword"
              fullWidth
              type="password"
              value={changePasswordData.oldPassword}
              onChange={(e) => setChangePasswordData({ ...changePasswordData, oldPassword: e.target.value })}
              error={!!passwordErrors.oldPassword}
              helperText={passwordErrors.oldPassword}
              sx={{ mt: 2 }}
            />
            <TextField
              label="New Password"
              name="newPassword"
              fullWidth
              type="password"
              value={changePasswordData.newPassword}
              onChange={(e) => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })}
              error={!!passwordErrors.newPassword}
              helperText={passwordErrors.newPassword}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Confirm New Password"
              name="confirmPassword"
              fullWidth
              type="password"
              value={changePasswordData.confirmPassword}
              onChange={(e) => setChangePasswordData({ ...changePasswordData, confirmPassword: e.target.value })}
              error={!!passwordErrors.confirmPassword}
              helperText={passwordErrors.confirmPassword}
              sx={{ mt: 2 }}
            />
            <Box mt={2} display="flex" gap={2}>
              <Button variant="contained" onClick={handleSaveChangePasswordClick}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setChangePasswordMode(false)}>
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Box display="flex" gap={2} mt={2}>
            <Button variant="contained" onClick={() => setChangePasswordMode(true)}>
              Change Password
            </Button>
            <Button variant="text" onClick={() => setShowForgotPassword(true)}>
              Forgot Password
            </Button>
          </Box>
        )}
      </Box>

      {showForgotPassword && (
        <ForgotPassword onClose={() => setShowForgotPassword(false)} />
      )}
    </Box>
  );
};

export default UserProfile;
