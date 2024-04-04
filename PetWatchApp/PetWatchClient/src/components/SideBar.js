import React from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUser, faPaw, faHome, faBook, faDog, faCat, faDashboard, faAmbulance, faMoneyCheck,
  faCog, faRightFromBracket, faSignature  } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import logoImage from "../images/logo.png"; 

import '../styles/SideBar.css';

const Sidebar = () => {

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const sideBarItems = [
    {title: 'Main', items: [{text: 'Dashboard', link: '/main/dashboard', icon: faHome} ]},
    {title: 'Pets', items: [{text: 'Pets Section', link: '/main/pets', icon: faPaw} ]},
    {title: 'Routine Care', items: [{text: 'Activity Log', link: '/main/activity-log', icon: faBook} ]},
    {title: 'Info', items: 
    [{text: 'Dogs Care Routine', link: '/main/dog-care' , icon: faDog}, 
    {text: 'Dog Guide', link: '/main/dog-guide' , icon: faDog}, 
    {text: 'Cats Care Routine', link: '/main/cat-care', icon: faCat}, 
    {text: 'Cat Guide', link: '/main/cat-guide', icon: faCat}, 
    {text: 'Emergency Guide', link: '/main/emergency-guide', icon: faAmbulance}, 
    {text: 'Pet Names Idea', link: '/main/pet-names' ,icon: faSignature} ]},
    {title: 'Expenses', items: [{text: 'Pet Expenses', link: '/main/pet-expenses' , icon: faMoneyCheck} ]},
    {title: 'Settings', items: [{text: 'Account Settings', link: '/main/account-settings', icon: faCog} ]},
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
                <Link to={item.link}>
                  {item.text} 
                </Link>
                {item.onClick && <p onClick={item.onClick}/>}

              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  // return (
  //   <div className="sidebar">
  //     <ul>
  //       <li>
  //           <FontAwesomeIcon icon={faBell} />
  //           <Link to="/dashboard/notifications">Notifications</Link>
  //       </li>
  //       <li>
  //         <Link path="/routine-care"> Routine Care</Link>
  //       </li>
  //       <li>
  //         <Link path="/vaccination-managment"> Vaccination Managment </Link>
  //       </li>
  //       <li>
  //         <Link path="/weight-monitor"> Weight Monitor</Link>
  //       </li>
  //       <li>
  //           <FontAwesomeIcon icon={faUser} />
  //           <Link to="/dashboard/profile">User Profile</Link>
  //       </li>
  //       <li>
  //           <FontAwesomeIcon icon={faPaw} />
  //           <Link to="/dashboard/pets">Pets Section</Link>
  //       </li>
        
  //       <li>
  //         <FontAwesomeIcon icon={faRightFromBracket} />
  //         <Link to="/login"  onClick={handleLogout}>Logout</Link>
  //       </li>
  //     </ul>
  //   </div>
  // );
};

export default Sidebar;
