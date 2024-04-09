import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../utils/utils';
import { fetchUserActivityLog } from '../services/userService';
import { fetchUserUpcomingEvents } from '../services/userService';
import '../styles/ActivityLog.css';

const ActivityLog = ({ logs }) => {
    const user = useSelector((state) => state.user);
    const [activityLogs, setActivityLogs] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        try {
            const logs = await fetchUserActivityLog(user._id);
            const events = await fetchUserUpcomingEvents(user._id);
            setActivityLogs(logs);
            setUpcomingEvents(events);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
      }, [user]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div>Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>Failed to fetch expense data. Please try again later.</p>
                <button onClick={fetchData}>Retry</button>
            </div>
        );
    }


    return (
        <div className="activity-log-container">
            <h2>Your Activity Logs: </h2>
            <table className='table'>
                <thead>
                    <tr>
                    <th>Date</th>
                    <th>Pet Name</th>
                    <th>Action Type</th>
                    <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {activityLogs.map(log => (
                        <tr key={log._id}>
                            <td>{formatDate(log.created_at)}</td>
                            <td>{log.petId.name}</td>
                            <td>{log.actionType}</td>
                            <td>{log.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2>Upcoming Events</h2>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Pet Name</th>
                        <th>Action Type</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {upcomingEvents.map(event => (
                        <tr key={event._id}>
                            <td>{formatDate(event.nextDate)}</td>
                            <td>{event.pet.name}</td>
                            <td>{event.actionType}</td>
                            <td>{event.details}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityLog;
