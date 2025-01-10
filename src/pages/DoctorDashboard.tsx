import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
} from "@mui/material";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Grid from '@mui/material/Grid2';
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Edit, Add } from "@mui/icons-material";
import Logout from "../components/Logout";
import Avatar from "@mui/material/Avatar";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import {useAuth} from "../context/AuthContext.tsx";

const DoctorDashboard = () => {

    const { user } = useAuth();
    //const [date, setDate] = useState(new Date());



    // const handleDateChange = (value: Date) => {
    //     setDate(value);
    //     console.log("Selected date:", value);
    // };

    const handleApprove = (id: number) => {
        // setAppointments((prevAppointments) =>
        //     prevAppointments.map((appointment) =>
        //         appointment.id === id
        //             ? { ...appointment, status: "approved", doctor: "Dr. Emily Johnson" }
        //             : appointment.status === "pending" &&
        //             appointment.time ===
        //             prevAppointments.find((appt) => appt.id === id)?.time
        //                 ? { ...appointment, status: "rejected" }
        //                 : appointment
        //     )
        // );
    };

    const [appointments, setAppointments] = useState([
        {
            id: 1,
            time: "10:00 AM - 11:00 AM",
            patient: "John Doe",
            status: "approved", // approved, pending, free
            doctor: "Dr. Emily Johnson",
        },
        {
            id: 2,
            time: "11:00 AM - 12:00 PM",
            patient: "Jane Smith",
            status: "pending", // approved, pending, free
            doctor: null,
        },
        {
            id: 3,
            time: "12:00 PM - 01:00 PM",
            patient: null,
            status: "free", // approved, pending, free
            doctor: null,
        },
        {
            id: 4,
            time: "01:00 PM - 02:00 PM",
            patient: "Alice Brown",
            status: "pending", // approved, pending, free
            doctor: null,
        },
    ]);

    return (
        <div className='flex flex-col w-full gap-4'>
            <Logout />
            <div className="flex flex-row w-full">
                <div className="flex flex-col  rounded-md w-1/4 gap-4 px-12 py-10 justify-between">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2 items-center justify-center">
                            <Avatar sx={{width: 54, height: 54}}></Avatar>
                            <p className="font-semibold text-2xl">{user?.name}</p>
                            <p className="font-medium text-xl">{user?.role}</p>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className="w-3/4 flex flex-row bg-gray-200 items-start justify-start gap-6 rounded-md px-4 py-2">
                                <PermIdentityIcon className="text-sky-400"/>
                                <p className="font-medium text-lg text-sky-400">All Cases</p>
                            </div>
                            <div
                                className="w-3/4 flex flex-row bg-gray-200 items-start justify-start gap-6 rounded-md px-4 py-2">
                                <PermIdentityIcon className="text-sky-400"/>
                                <p className="font-medium text-lg text-sky-400">Appointments</p>
                            </div>
                        </div>

                    </div>
                </div>
                <div className=" flex flex-col w-3/4 rounded-md py-10 px-8 h-screen gap-6">

                    <div className="flex flex-col w-full bg-cyan-100 p-4 rounded-md h-1/2">
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="timeGridWeek"
                            selectable={true}
                            height="100%"
                            // select={handleEventSelect}
                            //events={events}

                        />
                    </div>
                    <div className="flex flex-row w-full bg-cyan-100 p-6 rounded-md gap-6">

                        <Container maxWidth="lg" sx={{ mt: 4 }}>
                            <Typography variant="h4" gutterBottom>
                                Doctor's Dashboard
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid item xs={12}>
                                    <Paper elevation={3} sx={{ p: 3 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Appointments
                                        </Typography>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Time</TableCell>
                                                        <TableCell>Patient</TableCell>
                                                        <TableCell>Status</TableCell>
                                                        <TableCell>Doctor</TableCell>
                                                        <TableCell>Action</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {appointments.map((appointment) => (
                                                        <TableRow key={appointment.id}>
                                                            <TableCell>{appointment.time}</TableCell>
                                                            <TableCell>{appointment.patient || "No patient"}</TableCell>
                                                            <TableCell>
                                                                {appointment.status === "approved" && (
                                                                    <Chip label="Approved" color="success" />
                                                                )}
                                                                {appointment.status === "pending" && (
                                                                    <Chip label="Pending" color="warning" />
                                                                )}
                                                                {appointment.status === "free" && (
                                                                    <Chip label="Free" color="default" />
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {appointment.doctor || "No doctor assigned"}
                                                            </TableCell>
                                                            <TableCell>
                                                                {appointment.status === "pending" && (
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        onClick={() => handleApprove(appointment.id)}
                                                                    >
                                                                        Approve
                                                                    </Button>
                                                                )}
                                                                {appointment.status === "approved" && (
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        Approved
                                                                    </Typography>
                                                                )}
                                                                {appointment.status === "free" && (
                                                                    <Typography variant="body2" color="textSecondary">
                                                                        No action available
                                                                    </Typography>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Container>
                    </div>
                </div>



            </div>

        </div>
    );
};

export default DoctorDashboard;
