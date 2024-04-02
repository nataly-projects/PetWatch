import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faBell, faUser, faPaw, faHandHoldingHeart, faComment, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../styles/DashboardSideBar.css';

const Sidebar = () => {

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
            <FontAwesomeIcon icon={faBell} />
            <Link to="/dashboard/notifications">Notifications</Link>
        </li>
        <li>
          <Link path="/routine-care"> Routine Care</Link>
        </li>
        <li>
          <Link path="/vaccination-managment"> Vaccination Managment </Link>
        </li>
        <li>
          <Link path="/weight-monitor"> Weight Monitor</Link>
        </li>
        <li>
            <FontAwesomeIcon icon={faUser} />
            <Link to="/dashboard/profile">User Profile</Link>
        </li>
        <li>
            <FontAwesomeIcon icon={faPaw} />
            <Link to="/dashboard/pets">Pets Section</Link>
        </li>
        
        <li>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <Link to="/login"  onClick={handleLogout}>Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
