import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

interface Assignment {
  _id: string;
  engineerId: {
    _id: string;
    name: string;
  };
  projectId: {
    _id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  role: string;
  allocationPercentage: number;
}

interface TimelineEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    engineerId: string;
    projectId: string;
    role: string;
    allocation: number;
  };
}

const TimelineView: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('/api/assignments');
      const assignments: Assignment[] = await response.json();

      // Convert assignments to calendar events
      const calendarEvents = assignments.map(assignment => ({
        id: assignment._id,
        title: `${assignment.engineerId.name} - ${assignment.projectId.name} (${assignment.allocationPercentage}%)`,
        start: new Date(assignment.startDate),
        end: new Date(assignment.endDate),
        resource: {
          engineerId: assignment.engineerId._id,
          projectId: assignment.projectId._id,
          role: assignment.role,
          allocation: assignment.allocationPercentage
        }
      }));

      setEvents(calendarEvents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setLoading(false);
    }
  };

  const eventStyleGetter = (event: TimelineEvent) => {
    let backgroundColor = '#3182ce'; // Default blue

    // Color based on allocation percentage
    if (event.resource.allocation > 80) {
      backgroundColor = '#e53e3e'; // Red for high allocation
    } else if (event.resource.allocation > 50) {
      backgroundColor = '#dd6b20'; // Orange for medium allocation
    } else if (event.resource.allocation <= 30) {
      backgroundColor = '#38a169'; // Green for low allocation
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        display: 'block'
      }
    };
  };

  if (loading) {
    return <div>Loading timeline...</div>;
  }

  return (
    <div className="h-[600px] p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month', 'week', 'day']}
        eventPropGetter={eventStyleGetter}
        tooltipAccessor={(event: TimelineEvent) => `
          Role: ${event.resource.role}
          Allocation: ${event.resource.allocation}%
        `}
        className="bg-white rounded-lg shadow p-4"
      />
    </div>
  );
};

export default TimelineView; 