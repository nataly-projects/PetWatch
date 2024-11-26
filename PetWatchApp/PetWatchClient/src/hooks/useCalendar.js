import { useState } from 'react';

export const useCalendar = (initialDate) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [events, setEvents] = useState([]);

  const addEvent = (event) => {
    setEvents([...events, event]);
  };

  const removeEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return { selectedDate, events, setSelectedDate, addEvent, removeEvent };
};
