import React from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { editUserDetails } from '../services/userService';
import UserProfileDetails from '../components/UserProfileDetails';
import UserProfileEdit from '../components/UserProfileEdit';
import '../styles/UserProfile.css';


const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
console.log('user: ', user);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = async (editedUser) => {
  console.log('Save changes:', editedUser);
    const formData = new FormData();
    formData.append('email', editedUser.email);
    formData.append('phone', editedUser.phone);
    formData.append('fullName', editedUser.fullName);
    formData.append('imageUrl', editedUser.imageUrl);

    try {
      const response = await editUserDetails(user._id, formData);
      if (response) {
        dispatch({ type: 'SET_USER', payload: response });
        toast.success('The profile updated successfully');
      } else {
        toast.error('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.log('error: ', error);
      if (error.response && error.response.data && error.response.data.error) {
          toast.error(`An error occurred: ${error.response.data.error}`);
      } else {
          console.log(error);
          toast.error('An error occurred. Please try again later.');
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="user-profile-card">
      {isEditing ? (
        <UserProfileEdit 
        user={user} 
        onSave={handleSaveChanges}
        onClose={handleCloseEdit}
         />  
      ) : (
        <>
          <UserProfileDetails user={user} />
          <button onClick={handleEditClick}>Edit Profile</button>
        </>
      )}
    </div>
  );
};

export default UserProfile;