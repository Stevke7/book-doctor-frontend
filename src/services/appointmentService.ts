// services/appointmentService.ts
import api from './api';
import {Appointment, Event} from "../types/appointment.types.ts";

export const appointmentService = {
    fetchAppointments: async (): Promise<Appointment[]> => {
        const response = await fetch('http://localhost:5000/api/appointments', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch Appointments");
        }
        return response.json();
    },

    fetchDoctorAppointments: async (doctorId: string): Promise<Appointment[]> => {
        const response = await fetch(`http://localhost:5000/api/appointments?doctor=${doctorId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch doctor appointments');
        }

        return response.json();
    },

    doctorCreateAppointment: async (datetime: string, doctorId: string) : Promise<Appointment> => {
        const response = await fetch('http://localhost:5000/api/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({datetime, doctor: doctorId})
        });
        if(!response.ok) {
            throw new Error('Failed to create an Appointment');
        }

        return response.json
    },

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

    bookAppointment: async (appointmentId: string): Promise<Appointment> => {
        const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}/book`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        })
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch book appointments');
        }
        return response.json();
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