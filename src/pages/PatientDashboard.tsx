// pages/PatientDashboard.tsx
import { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { Appointment, Event } from '../types/appointment.types';
import Logout from '../components/Logout';
import { PatientCalendar } from '../components/patient/PatientCalendar';
import Logo from "../../public/logo.png";
import GridViewIcon from "@mui/icons-material/GridView";
import {
    CalendarMonth,
    ChatBubbleOutlineRounded,
    HelpOutline,
    SettingsOutlined,
    TextSnippetOutlined
} from "@mui/icons-material";
import AvatarImg from "../../public/avatar.png";

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
        <div className="flex flex-col w-full ">
            <ToastContainer />
            <div className="flex flex-row w-full">
                <div className="flex flex-col bg-slate-100 rounded-md w-1/5 gap-6 px-6 py-4 justify-between">
                    <img alt="Logo" src={Logo}/>
                    <div className="flex flex-col">
                        <div
                            className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
                            <GridViewIcon width={40} height={44}/>
                            <p className="text-sm font-medium font-black ">Dashboard</p>
                        </div>
                        <div
                            className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
                            <CalendarMonth width={40} height={44}/>
                            <p className="text-sm font-medium font-black">Appointments</p>
                        </div>
                        <div
                            className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
                            <ChatBubbleOutlineRounded width={40} height={44}/>
                            <p className="text-sm font-medium font-black">Messages</p>
                        </div>
                        <div
                            className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
                            <TextSnippetOutlined width={40} height={44}/>
                            <p className="text-sm font-medium font-black">Billing</p>
                        </div>
                        <div
                            className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
                            <SettingsOutlined width={40} height={44}/>
                            <p className="text-sm font-medium font-black">Settings</p>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div
                            className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
                            <HelpOutline width={40} height={44}/>
                            <p className="text-sm font-medium font-black">Help Center</p>
                        </div>
                        <Logout/>
                    </div>
                    <div className="flex flex-row px-3 py-2 bg-white rounded-md items-center gap-2.5">

                        <Avatar alt="Remy Sharp" sx={{width: 32, height: 32}} src={AvatarImg}/>
                        <p className="text-sm font-semibold">{user?.name}</p>


                    </div>
                </div>
                <div className="flex flex-col w-full rounded-md py-4 px-8 h-screen gap-6 bg-white">
                    <PatientCalendar
                            appointments={appointments}
                            onBookAppointment={handleBookAppointment}
                            loading={loading}
                    />
                </div>


                    {/*/!* Calendar Section *!/*/}
                    {/*<div className="flex flex-col w-3/4 rounded-md py-10 px-8 h-screen gap-6">*/}
                    {/*    <PatientCalendar*/}
                    {/*        appointments={appointments}*/}
                    {/*        onBookAppointment={handleBookAppointment}*/}
                    {/*        loading={loading}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>
            </div>
            );
            };

            export default PatientDashboard;