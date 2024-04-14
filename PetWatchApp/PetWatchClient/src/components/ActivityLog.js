import React from 'react';
import { useLocation } from 'react-router-dom';
import { formatDate } from '../utils/utils';
import '../styles/ActivityLog.css';

const ActivityLog = ({ activityLogs, upcomingEvents, petName }) => {
    const location = useLocation();
    console.log('loaction: ', location);
    if(location.pathname && location.pathname == "/main/activity-log") {
        activityLogs = location.state.activityLogs;
        upcomingEvents = location.state.upcomingEvents;
        petName = location.state.petName;
    }

    return (
        <div className="activity-log-container">
            <h3>{petName !== null ? `${petName} Activity Logs` : 'Your Activity Logs'}</h3>

            {activityLogs.length > 0 ?
                <table className='table'>
                    <thead>
                        <tr>
                        <th>Date</th>
                        {petName == null && <th>Pet Name</th>}
                        <th>Action Type</th>
                        <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activityLogs.map(log => (
                            <tr key={log._id}>
                                <td>{formatDate(log.created_at)}</td>
                                {petName == null && <td>{log.petId.name}</td>}
                                <td>{log.actionType}</td>
                                <td>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                :
                <p>No activity logs yet.</p>
            }
            <h3>{petName !== null ? `${petName} Upcoming Events` : 'Your Upcoming Events'}</h3>
            {upcomingEvents.length > 0 ?
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Date</th>
                            {petName == null && <th>Pet Name</th>}
                            <th>Action Type</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {upcomingEvents.map(event => (
                            <tr key={event._id}>
                                <td>{formatDate(event.nextDate)}</td>
                                {petName == null && <td>{event.pet.name}</td>}
                                <td>{event.actionType}</td>
                                <td>{event.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                : 
                <p>No upcoming events yet.</p>
            }
        </div>
    );
};

export default ActivityLog;
