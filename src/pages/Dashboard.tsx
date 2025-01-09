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
import Grid from '@mui/material/Grid2';
import Calendar from "react-calendar";
import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Edit, Add } from "@mui/icons-material";
import Logout from "../components/Logout";

const Dashboard = () => {

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
        <>
            <Logout />
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
        </>
    );
};

export default Dashboard;
