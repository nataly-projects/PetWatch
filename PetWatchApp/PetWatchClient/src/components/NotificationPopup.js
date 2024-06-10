import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import { fetchUserUpcomingEvents } from '../services/userService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faTimes } from '@fortawesome/free-solid-svg-icons';
import { formatDate, formatDateUniversal } from '../utils/utils';
import '../styles/Popup.css';

const NotificationPopup = ({ onClose }) => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const [events, setEvents] = useState([]);

    useEffect(() => {
    if (user) {
        const fetchData = async () => {
            try {
                const events = await fetchUserUpcomingEvents(user._id, token);
                setEvents(events);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.error('UNAUTHORIZED_ERROR');
                    navigate('/login');
                }
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }
    }, [user]);

    const handleClick = (event) => {
        onClose();
    };

    return (
        <div className="popup" onClick={handleClick}>
            <div className="popup-content">
                <div className='popup-header'>
                    <h3>Upcoming Events</h3>
                    <FontAwesomeIcon icon={faTimes} className='close-btn' onClick={onClose}/>
                </div>
                
                {events.length > 0 ?
                <>
                  {events.map((event, index) => (
                    <div key={index} className="notification-card">
                        <div className='notifcation-header'>
                            <FontAwesomeIcon icon={faBell} />
                            <h3>{event.actionType}</h3>
                        </div>
                        <p>{event.pet.name}</p>
                        <p>{event.details}</p>
                        <p>Date: {formatDateUniversal(new Date(event.nextDate))}</p>
                    </div>
                ))}
                </>
                : 
                <p>No Upcoming Events</p>
                }
               
            </div>
        </div>
    );
};

export default NotificationPopup;
