import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import logoImage from "../images/logo.png"; 
import '../styles/NavBar.css';

const NavBar = () => {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);

    return (
        <nav className='nav'>
            <div className='limit'>
                <div className="logo">
                    <img className='logo-image' src={logoImage} alt="Logo" />
                </div>    
                <ul>
                    <li>
                        <NavLink to="/about" active-link="active">About</NavLink>
                    </li>

                    {/* {isLoggedIn && (
                        <li>
                        <NavLink to="/dashboard/adopt" active-link="active">
                            Dashboard
                        </NavLink>
                        </li>
                    )} */}
                    <li>
                        <NavLink to="/dashboard/adopt" active-link="active">
                            Dashboard
                        </NavLink>
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
    )
};

export default NavBar