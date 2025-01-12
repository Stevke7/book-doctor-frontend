// pages/PatientDashboard.tsx
import { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { Appointment, Event } from '../types/appointment.types';
import Logout from '../components/Logout';
import { PatientCalendar } from '../components/patient/PatientCalendar';

const PatientDashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getAvailableAppointments();
            setAppointments(data);
        } catch (error) {
            toast.error('Failed to load appointments');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async (appointmentId: string) => {
        try {
            setLoading(true);
            await appointmentService.bookAppointment(appointmentId);
            toast.success('Appointment booked successfully!');
            await fetchAppointments(); // Refresh list after booking
        } catch (error: any) {
            if (error.response?.status === 400) {
                toast.error('This appointment is no longer available');
            } else {
                toast.error('Failed to book appointment');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full gap-4">
            <Logout />
            <ToastContainer />

            <div className="flex flex-row w-full">
                {/* Profile Section */}
                <div className="flex flex-col rounded-md w-1/4 gap-4 px-12 py-10">
                    <div className="flex flex-col gap-2 items-center">
                        <Avatar sx={{ width: 54, height: 54 }} />
                        <p className="font-semibold text-2xl">{user?.name}</p>
                        <p className="font-medium text-xl">{user?.role}</p>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="flex flex-col w-3/4 rounded-md py-10 px-8 h-screen gap-6">
                    <PatientCalendar
                        appointments={appointments}
                        onBookAppointment={handleBookAppointment}
                        loading={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;