import React, {useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort, faDownload } from '@fortawesome/free-solid-svg-icons';
import { formatDateUniversal } from '../utils/utils';
import ExportToCSVButton from './ExportToCSVButton';
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

    const filteredActivities = useMemo(() => {
        return activityLogs.filter(activity => {
            const activityDate = new Date(activity.created_at);
            const start = activityStartDate ? new Date(activityStartDate) : null;
            const end = activityEndDate ? new Date(activityEndDate) : null;

            return (!activityFilterType || (activity.type && activity.type === activityFilterType)) &&
                (!start || activityDate >= start) &&
                (!end || activityDate <= end.setHours(23, 59, 59, 999));
        });
    }, [activityLogs, activityFilterType, activityStartDate, activityEndDate]);

    const filteredUpcomingEvents = useMemo(() => {
        return upcomingEvents.filter(event => {
            const eventDate = new Date(event.created_at);
            const start = eventStartDate ? new Date(eventStartDate) : null;
            const end = eventEndDate ? new Date(eventEndDate) : null;

            return (!eventFilterType || (event.actionType === eventFilterType)) &&
                (!start || eventDate >= start) &&
                (!end || eventDate <= end.setHours(23, 59, 59, 999));
        });
    }, [upcomingEvents, eventFilterType, eventStartDate, eventEndDate]);

    const exportToCSV = (data) => {
        const processedData = data.map(item => ({
            Details: item.details,
            ActionType: item.actionType,
            Pet: petName == null ? (item.petId?.name || item.pet?.name) : petName,
            Date: formatDateUniversal(new Date(item.created_at)),
        }));
        return processedData;
    };

    const columns = useMemo(
        () => [
            { Header: 'Date', accessor: 'created_at', Cell: ({ value }) => formatDateUniversal(new Date(value))},
            petName == null ? { Header: 'Pet Name', accessor: 'petId.name', show: petName == null } : { Header: 'Pet Name', accessor: 'petId.name', show: false },
            { Header: 'Action Type', accessor: 'actionType' },
            { Header: 'Details', accessor: 'details' },
        ],
        [petName]
    );

    const activityTableInstance = useTable(
        {
            columns,
            data: filteredActivities,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    );

    const eventTableInstance = useTable(
        {
            columns,
            data: filteredUpcomingEvents,
            initialState: { pageIndex: 0 },
        },
        useSortBy,
        usePagination
    );

    return (
        <div className='logs-wrapper'>
        <div className="log-container">
            <h3>{petName !== null ? `${petName} Activity Logs` : 'Your Activity Logs'}</h3>
            {activityLogs.length > 0 && (
                <div className='table-filter-container'>
                <FilterSection
                    filterType={activityFilterType}
                    handleTypeChange={handleActivityTypeChange}
                    startDate={activityStartDate}
                    handleStartDateChange={handleActivityStartDateChange}
                    endDate={activityEndDate}
                    handleEndDateChange={handleActivityEndDateChange}
                    selectOptions={ActivityType}
                />
                 <ExportToCSVButton
                    className='btn'
                    petName={petName}
                    data={exportToCSV(filteredActivities)}
                    filename={petName == null ? "activity-log.csv" : petName + "-activity-log.csv"}
                />
                </div>
                

            )}
            {activityLogs.length > 0 ? (
                <Table instance={activityTableInstance} petName={petName} />
            ) : (
                <p>No activity logs yet.</p>
            )}
        </div>
        <div className="log-container">
        <h3>{petName !== null ? `${petName} Upcoming Events` : 'Your Upcoming Events'}</h3>
            {upcomingEvents.length > 0 && (
                <div className='table-filter-container'>
                    <FilterSection
                        filterType={eventFilterType}
                        handleTypeChange={handleEventTypeChange}
                        startDate={eventStartDate}
                        handleStartDateChange={handleEventStartDateChange}
                        endDate={eventEndDate}
                        handleEndDateChange={handleEventEndDateChange}
                        selectOptions={ActivityType}
                    />
                    <ExportToCSVButton
                        className='btn'
                        petName={petName}
                        data={exportToCSV(filteredUpcomingEvents)}
                        filename={petName == null ? "upcoming-events.csv" : petName + "-upcoming-events.csv"}
                    />
                </div>
            )}
            {upcomingEvents.length > 0 ? (
                <Table instance={eventTableInstance} petName={petName} />
            ) : (
                <p>No upcoming events yet.</p>
            )}
        </div>
        </div>
    );


    // return (
    //     <div className="activity-log-container">
    //         <h3>{petName !== null ? `${petName} Activity Logs` : 'Your Activity Logs'}</h3>
    //         { activityLogs.length > 0 && <FilterSection
    //             filterType={activityFilterType}
    //             handleTypeChange={handleActivityTypeChange}
    //             startDate={activityStartDate}
    //             handleStartDateChange={handleActivityStartDateChange}
    //             endDate={activityEndDate}
    //             handleEndDateChange={handleActivityEndDateChange}
    //             selectOptions={ActivityType}
    //         />}
    //         {activityLogs.length > 0 ?
    //             <>
    //             <table className='table'>
    //                 <thead>
    //                     <tr>
    //                     <th>Date</th>
    //                     {petName == null && <th>Pet Name</th>}
    //                     <th>Action Type</th>
    //                     <th>Details</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {filteredActivities.map((activity, index) => (
    //                     <tr key={index}>
    //                         <td>{formatDate(activity.created_at)}</td>
    //                         {petName == null && <td>{activity.petId.name}</td>}
    //                         <td>{activity.actionType}</td>
    //                         <td>{activity.details}</td>
    //                     </tr>
    //                     ))}
    //                 </tbody>
                    
    //             </table>
    //             <ExportToCSVButton className='btn'
    //             petName={petName}
    //             data={exportToCSV(filteredActivities)} 
    //             filename={petName == null ? "activity-log.csv" : petName +"-activity-log.csv"}
    //             />
    //             </>
    //             :
    //             <p>No activity logs yet.</p>
    //         }
    //         <h3>{petName !== null ? `${petName} Upcoming Events` : 'Your Upcoming Events'}</h3>
    //         {upcomingEvents.length > 0 && <FilterSection
    //             filterType={eventFilterType}
    //             handleTypeChange={handleEventTypeChange}
    //             startDate={eventStartDate}
    //             handleStartDateChange={handleEventStartDateChange}
    //             endDate={eventEndDate}
    //             handleEndDateChange={handleEventEndDateChange}
    //             selectOptions={ActivityType}
    //         />}
    //         {upcomingEvents.length > 0 ?
    //         <>
    //           <table className='table'>
    //                 <thead>
    //                     <tr>
    //                         <th>Date</th>
    //                         {petName == null && <th>Pet Name</th>}
    //                         <th>Action Type</th>
    //                         <th>Details</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>
    //                     {console.log(filteredUpcomingEvnets.length)}
    //                     {filteredUpcomingEvnets.map((event, index) => ( 
    //                     <tr key={index}>
    //                         <td>{formatDate(event.nextDate)}</td>
    //                         {petName == null && <td>{event.pet.name}</td>}
    //                         <td>{event.actionType}</td>
    //                         <td>{event.details}</td>
    //                     </tr>
    //                     ))}
    //                 </tbody>
    //             </table>
    //             <ExportToCSVButton className='btn'
    //             petName={petName}
    //             data={exportToCSV(filteredUpcomingEvnets)} 
    //             filename={petName == null ? "upcoming-events.csv" : petName +"-upcoming-events.csv"}
    //             />
    //         </>   
    //         : 
    //         <p>No upcoming events yet.</p>
    //         }
    //     </div>
    // );
};

const Table = ({ instance, petName }) => {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      page,
      prepareRow,
      canPreviousPage,
      canNextPage,
      pageOptions,
      state: { pageIndex, pageSize },
      previousPage,
      nextPage,
      gotoPage,
      pageCount,
    } = instance;

    const totalItems = instance.rows.length;

    return (
      <>
        <table {...getTableProps()} className='table'>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  column.show !== false && (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={(column.id === 'created_at' || column.id === 'petId.name') ? 'custom-column' : ''}
                    >
                        <div style={{display: 'flex', justifyContent: 'space-between',alignItems: 'center'}}>
                        {column.render('Header')}
                        {column.isSorted ? (
                            column.isSortedDesc ? (
                                <FontAwesomeIcon icon={faSortDown} />
                            ) : (
                                <FontAwesomeIcon icon={faSortUp} />
                            )
                            ) : (
                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                <FontAwesomeIcon icon={faSort} className="sort" />
                            </div>
                            )}
                      </div>
                    </th>
                  )
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
                <span className="pagination-info">
                    Showing: {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems}
                </span>
                <div className="pagination-controls">
                    <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Previous
                    </button>
                    {pageOptions.map((page, index) => (
                        <button
                            key={index}
                            onClick={() => gotoPage(index)}
                            className={pageIndex === index ? 'active' : ''}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        Next
                    </button>
                </div>
            </div>
      </>
    );
  };

export default ActivityLog;
