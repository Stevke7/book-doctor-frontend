// services/appointmentService.ts
import api from './api';
import { Appointment } from "../types/appointment.types";

export const appointmentService = {
    // Dohvati sve termine
    fetchAppointments: async (): Promise<Appointment[]> => {
        try {
            const { data } = await api.get('/appointments');
            return data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            throw error;
        }
    },

    // Dohvati termine za određenog doktora
    fetchDoctorAppointments: async (doctorId: string): Promise<Appointment[]> => {
        try {
            const { data } = await api.get(`/appointments`, {
                params: { doctor: doctorId }
            });
            return data;
        } catch (error) {
            console.error('Error fetching doctor appointments:', error);
            throw error;
        }
    },

    // Kreiranje termina (za doktora)
    doctorCreateAppointment: async (datetime: string, doctorId: string): Promise<Appointment> => {
        try {
            const { data } = await api.post('/appointments', {
                datetime,
                doctor: doctorId
            });
            return data;
        } catch (error) {
            console.error('Error creating appointment:', error);
            throw error;
        }
    },

    // Dohvati dostupne termine
    getAvailableAppointments: async (): Promise<Appointment[]> => {
        try {
            const { data } = await api.get('/appointments');
            return data;
        } catch (error) {
            console.error('Error fetching available appointments:', error);
            throw error;
        }
    },

    // Rezerviši termin (za pacijenta)
    bookAppointment: async (appointmentId: string): Promise<Appointment> => {
        try {
            const { data } = await api.post(`/appointments/${appointmentId}/book`);
            return data;
        } catch (error) {
            console.error('Error booking appointment:', error);
            throw error;
        }
    },

    // Dohvati termine za određeni datum
    getAppointmentsByDate: async (date: Date): Promise<Appointment[]> => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const { data } = await api.get('/appointments', {
                params: {
                    date: formattedDate,
                    status: 'FREE'
                }
            });
            return data;
        } catch (error) {
            console.error('Error fetching appointments by date:', error);
            throw error;
        }
    },

    // Otkaži termin
    cancelAppointment: async (id: string): Promise<Appointment> => {
        try {
            const { data } = await api.post(`/appointments/${id}/cancel`);
            return data;
        } catch (error) {
            console.error('Error canceling appointment:', error);
            throw error;
        }
    },

    // Odobri termin (za doktora)
    approveAppointment: async (id: string): Promise<Appointment> => {
        try {
            const { data } = await api.patch(`/appointments/${id}/status`, {
                status: 'APPROVED'
            });
            return data;
        } catch (error) {
            console.error('Error approving appointment:', error);
            throw error;
        }
    },

    // Odbij termin (za doktora)
    rejectAppointment: async (id: string): Promise<Appointment> => {
        try {
            const { data } = await api.patch(`/appointments/${id}/status`, {
                status: 'REJECTED'
            });
            return data;
        } catch (error) {
            console.error('Error rejecting appointment:', error);
            throw error;
        }
    }
};