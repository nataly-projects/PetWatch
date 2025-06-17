import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Typography, Box, Table, TableHead, TableRow, TableBody, TableCell, TableContainer, Paper, Pagination } from '@mui/material';
import { useTable, useSortBy, usePagination } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faSort } from '@fortawesome/free-solid-svg-icons';
import { formatDateUniversal } from '../utils/utils';
import ExportToCSVButton from './ExportToCSVButton';
import FilterSection from './FilterSection';
import { ActivityType } from '../utils/utils';

const ActivityLog = ({ activityLogs, upcomingEvents, petName }) => {
    const location = useLocation();
    if (location.pathname === "/main/activity-log") {
        activityLogs = location.state.activityLogs;
        upcomingEvents = location.state.upcomingEvents;
        petName = location.state.petName;
    }
   
    const [activityFilterType, setActivityFilterType] = useState('');
    const [activityStartDate, setActivityStartDate] = useState('');
    const [activityEndDate, setActivityEndDate] = useState('');
    const [eventFilterType, setEventFilterType] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [eventEndDate, setEventEndDate] = useState('');

    const handleActivityTypeChange = (event) => setActivityFilterType(event.target.value);
    const handleActivityStartDateChange = (event) => setActivityStartDate(event.target.value);
    const handleActivityEndDateChange = (event) => setActivityEndDate(event.target.value);

    const handleEventTypeChange = (event) => setEventFilterType(event.target.value);
    const handleEventStartDateChange = (event) => setEventStartDate(event.target.value);
    const handleEventEndDateChange = (event) => setEventEndDate(event.target.value);

    const exportToCSV = (data) => {
        const processedData = data.map(item => ({
            Details: item.details,
            ActionType: item.actionType,
            Pet: petName == null ? (item.petId?.name || item.pet?.name) : petName,
            Date: formatDateUniversal(new Date(item.created_at)),
        }));
        console.log('processedData:', processedData);
        return processedData;
    };

    const filteredActivities = useMemo(() => {
        return activityLogs.filter(activity => {
            const activityDate = new Date(activity.created_at);
            const start = activityStartDate ? new Date(activityStartDate) : null;
            const end = activityEndDate ? new Date(activityEndDate) : null;

            return (!activityFilterType || activity.type === activityFilterType) &&
                (!start || activityDate >= start) &&
                (!end || activityDate <= end.setHours(23, 59, 59, 999));
        });
    }, [activityLogs, activityFilterType, activityStartDate, activityEndDate]);

    const filteredUpcomingEvents = useMemo(() => {
        return upcomingEvents.filter(event => {
            const eventDate = new Date(event.created_at);
            const start = eventStartDate ? new Date(eventStartDate) : null;
            const end = eventEndDate ? new Date(eventEndDate) : null;

            return (!eventFilterType || event.actionType === eventFilterType) &&
                (!start || eventDate >= start) &&
                (!end || eventDate <= end.setHours(23, 59, 59, 999));
        });
    }, [upcomingEvents, eventFilterType, eventStartDate, eventEndDate]);

    const columns = useMemo(
        () => [
            { Header: 'Date', accessor: 'created_at', Cell: ({ value }) => formatDateUniversal(new Date(value)) },
            petName == null ? { Header: 'Pet Name', accessor: 'petId.name' } : { Header: 'Pet Name', accessor: 'petId.name', show: false },
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
        <Box sx={{ backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3, mt: 3 }}>
            {!petName && <Typography variant="h4" gutterBottom>Your Activity Page</Typography>}

            <ActivityTable
                title={petName ? `${petName} Activity Logs` : 'Your Activity Logs'}
                tableInstance={activityTableInstance}
                filter={{
                    type: activityFilterType,
                    startDate: activityStartDate,
                    endDate: activityEndDate,
                    onTypeChange: handleActivityTypeChange,
                    onStartDateChange: handleActivityStartDateChange,
                    onEndDateChange: handleActivityEndDateChange
                }}
                exportData={exportToCSV(filteredActivities)}
                csvFileName={petName ? `${petName}-activity-log.csv` : 'activity-log.csv'}
                type={'Activity Logs'}
            />

            <ActivityTable
                title={petName ? `${petName} Upcoming Events` : 'Your Upcoming Events'}
                tableInstance={eventTableInstance}
                filter={{
                    type: eventFilterType,
                    startDate: eventStartDate,
                    endDate: eventEndDate,
                    onTypeChange: handleEventTypeChange,
                    onStartDateChange: handleEventStartDateChange,
                    onEndDateChange: handleEventEndDateChange
                }}
                exportData={exportToCSV(filteredUpcomingEvents)}
                csvFileName={petName ? `${petName}-upcoming-events.csv` : 'upcoming-events.csv'}
                type={'Upcoming Events'}
            />
           
        </Box>
    );
};

const ActivityTable = ({ title, tableInstance, filter, exportData, csvFileName, type }) => {
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
        rows,
    } = tableInstance;

    if (rows.length === 0) {
        return (
            <Box sx={{ backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3, mt: 3 }}>
                <Typography variant="h5" gutterBottom>{title}</Typography>
                <Typography variant="body1" color="textSecondary">No {type} available. </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#fff', boxShadow: 2, border: 1, borderColor: '#ccc', p: 3, mt: 3 }}>
            <Typography variant="h5" gutterBottom>{title}</Typography>
            <Box display='flex' gap='10px' alignItems='baseline'>
                <FilterSection
                    filterType={filter.type}
                    handleTypeChange={filter.onTypeChange}
                    startDate={filter.startDate}
                    handleStartDateChange={filter.onStartDateChange}
                    endDate={filter.endDate}
                    handleEndDateChange={filter.onEndDateChange}
                    selectOptions={ActivityType}
                />
                <ExportToCSVButton data={exportData} filename={csvFileName} />
            </Box>
            

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table {...getTableProps()}>
                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <TableCell
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        sx={{ fontWeight: 'bold', borderBottom: '1px solid #ddd' }}
                                    >
                                        <Box display="flex" alignItems="center">
                                            {column.render('Header')}
                                            {column.isSorted ? (
                                                column.isSortedDesc ? (
                                                    <FontAwesomeIcon icon={faSortDown} style={{ marginLeft: 8 }} />
                                                ) : (
                                                    <FontAwesomeIcon icon={faSortUp} style={{ marginLeft: 8 }} />
                                                )
                                            ) : (
                                                <FontAwesomeIcon icon={faSort} style={{ marginLeft: 8 }} />
                                            )}
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody {...getTableBodyProps()}>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <TableRow {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <TableCell {...cell.getCellProps()} sx={{ borderBottom: '1px solid #ddd' }}>
                                            {cell.render('Cell')}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="body2">
                    Showing: {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, tableInstance.rows.length)} of {tableInstance.rows.length}
                </Typography>
                <Pagination
                    count={pageCount}
                    page={pageIndex + 1}
                    onChange={(e, page) => gotoPage(page - 1)}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </Box>
        </Box>
    );
};

export default ActivityLog;
