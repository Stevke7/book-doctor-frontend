// utils/appointmentUtils.ts
import {Appointment, Event} from '../types/appointment.types.ts'
export const getEventColor = (status: string): string => {
    const colors = {
        FREE: '#4CAF50',
        PENDING: '#FFC107',
        APPROVED: '#2196F3',
        REJECTED: '#F44336'
    };
    return colors[status] || colors.FREE;
};

export const formatAppointmentToEvent = (appointment: Appointment): Event => ({
    title: `Dr. ${appointment.doctor.name}`,
    start: appointment.datetime,
    end: new Date(new Date(appointment.datetime).getTime() + 30*60000).toISOString(),
    status: appointment.status,
    backgroundColor: getEventColor(appointment.status),
    doctorId: appointment.doctor.id
});