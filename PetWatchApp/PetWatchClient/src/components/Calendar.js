import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils/utils';
import { fetchUserPetsActivitiesForMonth } from '../services/userService';
import ExportToCSVButton from './ExportToCSVButton';
import '../styles/Calendar.css'; 


const Calendar = () => {
    const user = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);

    const [activities, setActivities] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchActivitiesForMonth = async () => {
        try {
          const allActivites = await fetchUserPetsActivitiesForMonth(user._id, token, currentDate.getFullYear(), currentDate.getMonth());
          setActivities(allActivites);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching doctors:', error);
          setError(true);
          setLoading(false);
        }
      };

    useEffect(() => {
        fetchActivitiesForMonth();
    }, []);


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
            <div className='error-container'>
            <p>Failed to fetch user data. Please try again later.</p>
            <button className='btn' onClick={fetchActivitiesForMonth}>Retry</button>
            </div>
        );
    }

    const prevMonth = () => {
        setCurrentDate((prevDate) => {
          const prevMonthDate = new Date(prevDate);
          prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
          return prevMonthDate;
        });
    };
    
    const nextMonth = () => {
        setCurrentDate((prevDate) => {
            const nextMonthDate = new Date(prevDate);
            nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
            return nextMonthDate;
        });
    };


    // Function to render the calendar cells
    const renderCells = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
    
        const firstDayOfMonth = getFirstDayOfMonth(year,month);
        const rows = [];
        let cells = [];
        let cellsToExport = [];
        let rowsToExport = [];

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < daysOfWeek.length; i++) {
            cellsToExport.push(daysOfWeek[i]);
        }

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            cells.push(<td key={`empty-${i}`} className="empty-cell"></td>);
            cellsToExport.push('');
        }
        rowsToExport.push(cellsToExport);
        cellsToExport = [];

        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(year, month, i);
            const activitiesForDay = activities.filter(activity => {
                const activityDate = new Date(activity.date);
                const nextActivityDate = new Date(activity.nextDate);
                return (
                    (activityDate.getFullYear() === year &&
                    activityDate.getMonth() === month &&
                    activityDate.getDate() === i) ||
                    (nextActivityDate.getFullYear() === year &&
                    nextActivityDate.getMonth() === month &&
                    nextActivityDate.getDate() === i)
                );
            });

            cellsToExport.push(activitiesForDay.length > 0 ? [...activitiesForDay.map(activity => `${i}\n${activity.pet.name}-${activity.activity || activity.vaccineType || 'Vet Visit'}`)] : [`${i}`]);
            cells.push(
                <td key={i}>
                    {i}
                    {activitiesForDay.map(activity => (
                        <p key={activity._id}>{activity.pet.name} -{activity.activity || activity.vaccineType || 'Vet Visit'}</p>
                    ))}
                </td>
            );
    
            // If it's the last day of the week or the last day of the month, push the cells to rows and reset cells
            if (date.getDay() === 6 || i === daysInMonth) {
                rows.push(<tr key={i}>{cells}</tr>);
                rowsToExport.push(cellsToExport);
                cells = [];
                cellsToExport = [];
            }
        }
        
        const calendarJSX = <tbody>{rows}</tbody>;
        return { calendarJSX, rowsToExport };
    };

    const { calendarJSX, rowsToExport } = renderCells();


    return (
    <div className="calendar">
        <div className="calendar-header">
            <button className='btn' onClick={prevMonth}>Prev</button>
            <span className='current-date'> {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            <button className='btn' onClick={nextMonth}>Next</button>
      </div>
        <table>
            <thead>
                <tr>
                <th>Sun</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
                </tr>
            </thead>
           {calendarJSX}
        </table>
        <ExportToCSVButton 
            data={rowsToExport} 
            filename={(currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric'}))}  
        />
    </div>
    );
};

export default Calendar;
