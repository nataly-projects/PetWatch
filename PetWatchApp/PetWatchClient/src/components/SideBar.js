import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faPaw, faHome, faBook, faDog, faCat, faAmbulance, faMoneyCheck,
  faCog, faRightFromBracket, faSignature, faEye, faMessage, faTasks  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { fetchUserActivityLog, fetchUserUpcomingEvents, fetchUserExpensesArray } from '../services/userService';
import logoImage from "../images/logo.png"; 
import { UNAUTHORIZED_ERROR } from '../utils/utils';
import '../styles/SideBar.css';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const [activityLogs, setActivityLogs] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const fetchData = async () => {
    try {
        const logs = await fetchUserActivityLog(user._id, token); 
        const events = await fetchUserUpcomingEvents(user._id, token);
        const userExpenses = await fetchUserExpensesArray(user._id, token);
        setActivityLogs(logs);
        setExpenses(userExpenses);
        setUpcomingEvents(events);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('UNAUTHORIZED_ERROR');
        navigate('/login');
      }
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const isActivityLogPath = (path) => {
    return path === '/main/activity-log';
  };

  const isExpensesPath = (path) => {
    return  path === '/main/expenses';
  };

  const sideBarItems = [
    {title: 'Main', items: [{text: 'Dashboard', link: '/main/', icon: faHome} ]},
    {title: 'Pets', items: [{text: 'Pets Section', link: '/main/pets', icon: faPaw} ]},
    {title: 'Logs', items: [
      {text: 'Activity Log', link: '/main/activity-log', icon: faBook}, 
      {text: 'Expenses', link: '/main/expenses' , icon: faMoneyCheck},
      {text: 'Tasks', link: '/main/tasks' , icon: faTasks}
    ]},
    // {title: 'Expenses', items: [{text: 'Expenses', link: '/main/expenses' , icon: faMoneyCheck} ]},
    // {title: 'Calendar', items: [{text: 'Calendar', link: '/main/calendar' , icon: faCalendar} ]},
    {title: 'Info', items: [
    {text: 'Dogs Care Routine', link: '/main/dog-care' , icon: faDog}, 
    {text: 'Dog Guide', link: '/main/dog-guide' , icon: faDog}, 
    {text: 'Cats Care Routine', link: '/main/cat-care', icon: faCat}, 
    {text: 'Cat Guide', link: '/main/cat-guide', icon: faCat}, 
    {text: 'Emergency Guide', link: '/main/emergency-guide', icon: faAmbulance}, 
    {text: 'Pet Names Idea', link: '/main/pet-names' ,icon: faSignature} 
    ]},
    {title: 'Settings', items: [
      {text: 'Account Settings', link: '/main/account-settings', icon: faCog}, 
      {text: 'User Profile', link: '/main/user-profile', icon: faEye},
      {text: 'Contact Us', link: '/main/contact-us', icon: faMessage}
    ]},
    {title: 'Authentication', items: [{text: 'Logout', link: '/login', icon: faRightFromBracket, onClick: handleLogout} ]}
  ]



  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src={logoImage} alt="Project Logo" className="logo" />
        <h2>Pet Watch</h2>
      </div>
      {sideBarItems.map((section, index) => (
        <div key={index} className="sidebar-section">
          {section.title && <h2 className="section-title">{section.title}</h2>}
          <ul className="section-items">
            {section.items.map((item, index) => (
              <li key={index}>
                <FontAwesomeIcon icon={item.icon} />
              { isActivityLogPath(item.link) 
                ?
                <Link to={item.link} state={{activityLogs, upcomingEvents, petName:null}} >{item.text}</Link>
                :
                ( isExpensesPath(item.link) ?
                  <Link to={item.link} state={{expenses, from:'user'}} >{item.text}</Link>
                  :
                  <>
                  <Link to={item.link} onClick={item.onClick}>{item.text}</Link>
                  </>
                )
              }
              </li>
            ))}
          </ul>
        </div>
      ))}
  </div>
  );

};

export default Sidebar;
