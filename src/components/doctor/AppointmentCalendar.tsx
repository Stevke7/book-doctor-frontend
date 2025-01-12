// components/doctor/AppointmentCalendar.tsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event, TimeSlot } from '../../types/appointment.types';

interface AppointmentCalendarProps {
    events: Event[];
    onSlotSelect: (slot: TimeSlot) => void;
}

export const AppointmentCalendar = ({ events, onSlotSelect }: AppointmentCalendarProps) => {
    const handleDateSelect = (info: any) => {
        onSlotSelect({
            start: info.start.toISOString(),
            end: info.end.toISOString()
        });
    };

    return (
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            selectable={true}
            select={handleDateSelect}
            events={events}
            height="100%"
            eventContent={(eventInfo) => (
                <div className="flex flex-row gap-2 items-center justify-center ">
                    <div className="font-semibold">{eventInfo.event.title}</div>
                    <div className="text-sm font-semibold">{eventInfo.event.extendedProps.status}</div>
                </div>
            )}
        />
    );
};