import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell } from "@fortawesome/free-solid-svg-icons";
import { useSelector  } from "react-redux";
import logoImage from "../images/logo.png"; 
import '../styles/NavBar.css';

const NavBar = () => {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
console.log('isLoggedIn navbar: ', isLoggedIn);

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
                        <div className="user">
                            <FontAwesomeIcon icon={faUser}  />
                            <span>user name</span>
                        </div>
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