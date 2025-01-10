// components/appointments/AppointmentList.tsx
import { useState, useEffect } from 'react';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import {Appointment} from "../types/appointment.types.ts";

const AppointmentList = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const data = await appointmentService.getAvailableAppointments();
            setAppointments(data.filter(apt => apt.status === "FREE"));
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        try {
            await appointmentService.cancelAppointment(id);
            fetchAppointments();
        } catch (error) {
            console.error('Error canceling appointment:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="w-full flex flex-col gap-4">
            <h2 className="text-xl font-bold">My Appointments</h2>
            <div className="grid gap-4">
                {appointments.map((apt: any) => (
                    <div
                        key={apt._id}
                        className="p-4  rounded-lg shadow-sm bg-white"
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">
                                    {new Date(apt.datetime).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Status: {apt.status}
                                </p>
                                {apt.doctor && (
                                    <p className="text-sm">Doctor: {apt.doctor.name}</p>
                                )}
                            </div>
                            {apt.status === 'PENDING' && (
                                <button
                                    onClick={() => handleCancel(apt._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AppointmentList;