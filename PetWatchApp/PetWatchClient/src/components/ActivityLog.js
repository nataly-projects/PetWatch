import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import { formatDate } from '../utils/utils';
import ExportToCSVButton from './ExportToCSVButton copy';
import FilterSection from './FilterSection';
import { ActivityType } from '../utils/utils';
import '../styles/ActivityLog.css';

const ActivityLog = ({ activityLogs, upcomingEvents, petName }) => {
    const location = useLocation();
    if(location.pathname && location.pathname === "/main/activity-log") {
        activityLogs = location.state.activityLogs;
        upcomingEvents = location.state.upcomingEvents;
        petName = location.state.petName;
    }
    // State for activity logs
    const [activityFilterType, setActivityFilterType] = useState('');
    const [activityStartDate, setActivityStartDate] = useState('');
    const [activityEndDate, setActivityEndDate] = useState('');

    // State for upcoming events
    const [eventFilterType, setEventFilterType] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');

    // Handlers for activity logs
    const handleActivityTypeChange = (event) => setActivityFilterType(event.target.value);
    const handleActivityStartDateChange = (event) => setActivityStartDate(event.target.value);
    const handleActivityEndDateChange = (event) => setActivityEndDate(event.target.value);

    // Handlers for upcoming events
    const handleEventTypeChange = (event) => setEventFilterType(event.target.value);
    const handleEventStartDateChange = (event) => setEventStartDate(event.target.value);
    const handleEventEndDateChange = (event) => setEventEndDate(event.target.value);

    const filteredActivities = activityLogs.filter(activity => {
        const activityDate = new Date(activity.created_at);
        const start = activityStartDate ? new Date(activityStartDate) : null;
        const end = activityEndDate ? new Date(activityEndDate) : null;

        return (!activityFilterType || (activity.type && activity.type === activityFilterType)) &&
               (!start || activityDate >= start) &&
               (!end || activityDate <= end.setHours(23, 59, 59, 999));
      });

    const filteredUpcomingEvnets = upcomingEvents.filter(event => {
    const activityDate = new Date(event.created_at);
    const start = eventStartDate ? new Date(eventStartDate) : null;
    const end = eventEndDate ? new Date(eventEndDate) : null;

    return (!eventFilterType || (event.actionType === eventFilterType)) &&
            (!start || activityDate >= start) &&
            (!end || activityDate <= end.setHours(23, 59, 59, 999));
    });

    return (
        <div className="activity-log-container">
            <h3>{petName !== null ? `${petName} Activity Logs` : 'Your Activity Logs'}</h3>
            <FilterSection
                filterType={activityFilterType}
                handleTypeChange={handleActivityTypeChange}
                startDate={activityStartDate}
                handleStartDateChange={handleActivityStartDateChange}
                endDate={activityEndDate}
                handleEndDateChange={handleActivityEndDateChange}
                selectOptions={ActivityType}
            />
            {activityLogs.length > 0 ?
                <>
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
                        {filteredActivities.map((activity, index) => (
                        <tr key={index}>
                            <td>{formatDate(activity.created_at)}</td>
                            {petName == null && <td>{activity.petId.name}</td>}
                            <td>{activity.actionType}</td>
                            <td>{activity.details}</td>
                        </tr>
                        ))}
                    </tbody>
                    
                </table>
                <ExportToCSVButton className='btn'
                petName={petName}
                data={filteredActivities} 
                filename={petName == null ? "activity-log.csv" : petName +"-activity-log.csv"}
                />
                </>
                :
                <p>No activity logs yet.</p>
            }
            <h3>{petName !== null ? `${petName} Upcoming Events` : 'Your Upcoming Events'}</h3>
            <FilterSection
                filterType={eventFilterType}
                handleTypeChange={handleEventTypeChange}
                startDate={eventStartDate}
                handleStartDateChange={handleEventStartDateChange}
                endDate={eventEndDate}
                handleEndDateChange={handleEventEndDateChange}
                selectOptions={ActivityType}
            />
            {upcomingEvents.length > 0 ?
            <>
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
                        {filteredUpcomingEvnets.map((event, index) => (
                        <tr key={index}>
                            <td>{formatDate(event.created_at)}</td>
                            {petName == null && <td>{event.pet.name}</td>}
                            <td>{event.actionType}</td>
                            <td>{event.details}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
                <ExportToCSVButton className='btn'
                petName={petName}
                data={filteredUpcomingEvnets} 
                filename={petName == null ? "upcoming-events.csv" : petName +"-upcoming-events.csv"}
                />
            </>   
                : 
                <p>No upcoming events yet.</p>
            }
        </div>
    );
};

export default ActivityLog;
