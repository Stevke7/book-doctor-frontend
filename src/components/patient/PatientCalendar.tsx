// components/patient/PatientCalendar.tsx
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useState } from 'react';
import { Appointment } from '../../types/appointment.types';
import { useAuth } from '../../context/AuthContext';
import { formatAppointmentToEvent, getEventColor } from '../../utiils/appointmentUtils.ts';

interface PatientCalendarProps {
    appointments: Appointment[];
    onBookAppointment: (appointmentId: string) => Promise<void>;
    loading: boolean;
}

export const PatientCalendar = ({
                                    appointments,
                                    onBookAppointment,
                                    loading
                                }: PatientCalendarProps) => {
    const { user } = useAuth();
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const getEventTitle = (appointment: Appointment): string => {
        if (appointment.patient?._id === user?._id) {
            // Samo trenutnom korisniku prikaži njegove statuse
            switch (appointment.status) {
                case 'PENDING':
                    return 'Your Pending Request';
                case 'APPROVED':
                    return 'Your Approved Appointment';
                case 'REJECTED':
                    return 'Your Request Rejected';
                default:
                    return 'Available';
            }
        }
        // Svim ostalima prikaži kao Available ili Taken
        return appointment.status === 'APPROVED' ? 'Taken' : 'Available';
    };


    const events = appointments.map(apt => ({
        ...formatAppointmentToEvent(apt),
        title: getEventTitle(apt),
        extendedProps: {
            isMyAppointment: apt.patient?._id === user?._id,
            doctor: apt.doctor.name,
            status: apt.status
        }
    }));

    const handleEventClick = (info: any) => {
        const appointment = appointments.find(apt =>
            new Date(apt.datetime).getTime() === info.event.start.getTime()
        );

        // Dozvoli booking ako termin nije APPROVED i nije vlastiti PENDING
        if (appointment && appointment.status !== 'APPROVED') {
            // Ako je vlastiti PENDING, ne dozvoli ponovno bookiranje
            if (appointment.patient?._id === user?._id && appointment.status === 'PENDING') {
                return;
            }
            setSelectedAppointment(appointment);
            setDialogOpen(true);
        }
    };

    const handleBook = async () => {
        if (selectedAppointment) {
            await onBookAppointment(selectedAppointment._id);
            setDialogOpen(false);
            setSelectedAppointment(null);
        }
    };

    return (
        <>
            <div className="flex flex-col w-full bg-cyan-100 p-4 rounded-md h-full">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={events}
                    eventClick={handleEventClick}
                    height="100%"
                    eventContent={(eventInfo) => (
                        <div className="flex flex-col p-1">
                            <div className="font-semibold">{eventInfo.event.title}</div>
                            <div className="text-xs">Dr. {eventInfo.event.extendedProps.doctor}</div>
                            <div className="text-xs">
                                {new Date(eventInfo.event.start!).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                            {eventInfo.event.extendedProps.isMyAppointment &&
                                eventInfo.event.extendedProps.status === 'PENDING' && (
                                    <div className="text-xs text-yellow-800">
                                        Waiting for approval
                                    </div>
                                )}
                        </div>
                    )}
                />
            </div>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Book Appointment</DialogTitle>
                <DialogContent>
                    {selectedAppointment && (
                        <div className="p-4">
                            <p>Date: {new Date(selectedAppointment.datetime).toLocaleDateString()}</p>
                            <p>Time: {new Date(selectedAppointment.datetime).toLocaleTimeString()}</p>
                            <p>Doctor: Dr. {selectedAppointment.doctor.name}</p>
                            {appointments.some(apt =>
                                apt.datetime === selectedAppointment.datetime &&
                                apt.status === 'PENDING'
                            ) && (
                                <p className="text-yellow-600 mt-2">
                                    Note: Other patients are also interested in this time slot
                                </p>
                            )}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleBook}
                        disabled={loading}
                        variant="contained"
                        color="primary"
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};