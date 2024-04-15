import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons";
import { useSelector  } from "react-redux";
import logoImage from "../images/logo.png"; 
import UserPopup from "./UserPopup";
import '../styles/NavBar.css';

const NavBar = () => {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const user = useSelector((state) => state.user);
    const [isUserPopupVisible, setUserPopupVisible] = useState(false);
console.log('user: ', user);
    const handleUserIconClick = () => {
        setUserPopupVisible(!isUserPopupVisible);
      };

    const renderGuestNavBar = () => {
        return (
            <nav className='nav_guest'>
                <div className='limit'>
                    <div className="logo">
                        <img className='logo-image' src={logoImage} alt="Logo" />
                    </div>    
                    <ul>
                        <li>
                            <NavLink to="/about" active-link="active">About</NavLink>
                        </li>
                        <li>
                            <NavLink to="/info" active-link="active">Information</NavLink>
                        </li>
                        <li>
                            <NavLink to="/contact" active-link="active">Contact</NavLink>
                        </li>
                    </ul>
                    <Link to="/login" className="join_us">
                        <FontAwesomeIcon icon={faUser} className="join_us_icon" />
                    </Link>
                </div>
            </nav>
        );
    };

    const renderUserNavBar = () => {
        return (
            <nav className='nav_user'>
                <div className="limit">
                    <div className="actions">
                        <FontAwesomeIcon icon={faBell}  />
                        <div className="user" onClick={handleUserIconClick}>
                            <FontAwesomeIcon icon={faUser}  />
                            <span>{user.fullName}</span>
                        </div>
                        {isUserPopupVisible && <UserPopup onClose={() => setUserPopupVisible(false)} />}

                    </div>
                </div>
            </nav>
        );
    };


    return (
        (isLoggedIn ?
        renderUserNavBar()
        :
        renderGuestNavBar()
        )  
    )
};

export default NavBar