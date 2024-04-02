import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import userDefaultImage from "../images/default-profile-image.jpg"; 
import '../styles/UserProfile.css';

const UserProfileEdit = ({ user, onSave, onClose }) => {
    const [editedUser, setEditedUser] = useState({ ...user });
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = (acceptedFiles) => {
        const selectedImage = acceptedFiles[0];
        if (selectedImage) {
          setSelectedFile(selectedImage);
          editedUser.imageUrl = selectedImage;
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });


    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
    };
  
    const handleSave = () => {
      onSave(editedUser);
    };

    return (
        <>
        <div className='user-header-container'>
            <h2>Hello {user.fullName}</h2>
            <div className="user-image-container">
                <img
                className="user-image"
                src={ user.imageUrl ? `http://localhost:3000/${user.imageUrl}` : (selectedFile ? URL.createObjectURL(selectedFile) : userDefaultImage)} 
                alt="User Profile" />
                <div className="upload-overlay"  {...getRootProps()}>
                    <input  {...getInputProps()} />
                    <button className="upload-button">Upload Image</button>
                </div>
            </div>
        </div>
        <div className='details-container'>
            <label>
                Full Name:
                <input type="text" name="fullName" value={editedUser.fullName} onChange={handleChange} />
            </label>
            <label>
                Email:
                <input type="text" name="email" value={editedUser.email} onChange={handleChange} />
            </label>
            <label>
                Phone:
                <input type="text" name="phone" value={editedUser.phone} onChange={handleChange} />
            </label>
            <div className='edit-actions'>
                <button onClick={handleSave}>Save Changes</button>
                <button onClick={onClose}>Cancel</button>
            </div>
            
        </div>
        </>
      );

  };

  export default UserProfileEdit;