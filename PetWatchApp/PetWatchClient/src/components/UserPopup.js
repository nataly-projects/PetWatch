import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faEye, faCog, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../styles/Popup.css';

const UserPopup = ({ onClose }) => {
  const user = useSelector((state) => state.user);

  const handleClick = (event) => {
      onClose();
  };

  return (
    <div className="user-popup" onClick={handleClick}>
      <div className="user-info">
        <div className='user-header'>
            {/* Render profile image here */}
            <FontAwesomeIcon icon={faUser} className="profile-image"/>
            <span className="username">{user.fullName}</span>
            <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
        </div>

          
      </div>
      <ul className="user-options">
        {/* <li>
          <Link to="/edit-profile">
            <FontAwesomeIcon icon={faEdit} /> Edit Profile
          </Link>
        </li> */}
        <li>
          <Link to="/user-profile">
            <FontAwesomeIcon icon={faEye} /> User Profile
          </Link>
        </li>
        <li>
          <Link to="/main/account-settings">
            <FontAwesomeIcon icon={faCog} /> Account Settings
          </Link>
        </li>
        <li>
          <Link to="/logout">
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default UserPopup;
