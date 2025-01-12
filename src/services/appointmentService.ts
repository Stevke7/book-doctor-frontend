// services/appointmentService.ts
import api from './api';
import {Appointment} from "../types/appointment.types.ts";

export const appointmentService = {
    getAvailableAppointments: async () => {
        try {
            const {data} = await api.get<Appointment[]>('/appointments');
            console.log('Available slots',data);
            return data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    bookAppointment: async (appointmentId: string) => {
        try{
            //console.log('Book Appointment for: ', datetime);
            const { data } = await api.post<Appointment>(`/appointments/${appointmentId}/book`);
            return data;
        } catch (error) {
            console.error('Error booking appointment:', error);
            throw error;
        }

    },

    getAppointmentsByDate: async (date: Date) => {
        try {
            console.log('Fetching appointments: ', date);
            const formattedDate = date.toISOString().split('T')[0];
            const { data } = await api.get(`/appointments?date=${formattedDate}&status=FREE`);
            return data;
        } catch (error) {
            console.error("Error fetching appointments: ",error);
            throw error;
        }

    },



    cancelAppointment: async (id: string) => {
        const { data } = await api.post(`/appointments/${id}/cancel`);
        return data;
    },

    // Za doktore
    approveAppointment: async (id: string) => {
        const { data } = await api.patch(`/appointments/${id}/status`, {
            status: 'APPROVED'
        });
        return data;
    },

    rejectAppointment: async (id: string) => {
        const { data } = await api.patch(`/appointments/${id}/status`, {
            status: 'REJECTED'
        });
        return data;
    }
};