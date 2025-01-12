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
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { Edit, Add } from "@mui/icons-material";
import Logout from "../components/Logout";
import Avatar from "@mui/material/Avatar";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { useAuth } from "../context/AuthContext.tsx";
import {appointmentService} from "../services/appointmentService.ts";
import {formatAppointmentToEvent} from "../utiils/appointmentUtils.ts";
import {AppointmentCalendar} from "../components/doctor/AppointmentCalendar.tsx";

const DoctorDashboard = () => {
	const { user } = useAuth();
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(false);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);

	useEffect(() => {
		if (user?.id){
			fetchAppointments();
		}

	}, [user?.id]);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const appointments = await appointmentService.fetchAppointments();
			setAppointments(appointments);
			const formattedEvents = appointments.map(apt =>
				formatAppointmentToEvent(apt, user?.name || '')
			);
			setEvents(formattedEvents);

			setPendingAppointments(appointments.filter(apt => apt.status === 'PENDING'));
		} catch (error) {
			toast.error('Failed to load appointments');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleSaveSlot = async () => {
		if (!selectedSlot || !user?.id) {
			toast.warn('No slot selected!');
			return;
		}

		try {
			setLoading(true);
			await appointmentService.doctorCreateAppointment(selectedSlot.start, user.id);
			toast.success('Slot saved successfully!');
			setSelectedSlot(null);
			await fetchAppointments();
		} catch (error) {
			toast.error('Failed to save slot');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleApprove = async (appointmentId: string) => {
		try {
			setLoading(true);
			await appointmentService.approveAppointment(appointmentId);
			toast.success('Appointment approved');
			await fetchAppointments();
		} catch (error) {
			toast.error('Failed to approve appointment');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleReject = async (appointmentId: string) => {
		try {
			setLoading(true);
			await appointmentService.rejectAppointment(appointmentId);
			toast.success('Appointment rejected');
			await fetchAppointments();
		} catch (error) {
			toast.error('Failed to reject appointment');
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	console.log('Appointment data:', events.map(apt => ({
		id: apt._id,
		datetime: apt.datetime,
		parsedDate: new Date(apt.datetime)
	})));

	return (
		<div className="flex flex-col w-full">
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick={true}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<div className="flex flex-row w-full px-4">
				<div className="flex flex-col bg-slate-100 rounded-md w-1/5 gap-4 px-12 py-10 justify-between">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2 items-center justify-center">
							<Avatar sx={{width: 54, height: 54}}></Avatar>
							<p className="font-semibold text-2xl">{user?.name}</p>
							<p className="font-medium text-xl">{user?.role}</p>
						</div>
					</div>
					<Logout/>
				</div>
				<div className="flex flex-col w-full rounded-md py-4 px-8 h-screen gap-6 bg-white">
					<AppointmentCalendar events={events} onSlotSelect={setSelectedSlot}/>
					<div className="flex flex-row justify-between items-start gap-6">
						<Button
							variant="contained"
							color="primary"
							startIcon={<Add/>}
							onClick={handleSaveSlot}
							disabled={loading || !selectedSlot}
						>
							{loading ? 'Saving...' : 'Save Slot'}
						</Button>
						{selectedSlot && (
							<div className="text-xl text-gray-600 font-bold">
								Selected: {new Date(selectedSlot.start).toLocaleString()}
							</div>
						)}
					</div>

				</div>
				<div className="mt-6 overflow-y-auto w-[35%] h-[95vh]">
					<h2 className="text-xl font-bold mb-4">All Events</h2>
					<div className="grid gap-4">
						{appointments.map((appointment) => (
							<div
								key={appointment._id}
								className="p-4 flex flex-col gap-2 bg-white rounded-lg shadow-md"
							>
								{/* Status */}
								<div className="mb-2 flex flex-row gap-2 justify-between">
									<Chip
										label={appointment.status}
										color={
											appointment.status === "PENDING"
												? "warning"
												: appointment.status === "APPROVED"
													? "success"
													: appointment.status === "REJECTED"
														? "error"
														: "default"
										}
										size="small"
										className="text-sm"
									/>

								</div>
								<div className="flex flex-col justify-between gap-2 mb-4">
									<p className="font-medium text-sm text-gray-700">
										{new Date(appointment.datetime).toLocaleString()}
									</p>
									{appointment.patient && (
										<p className="text-md font-semibold text-gray-600">
											Patient: {appointment.patient.name}
										</p>
									)}
								</div>

								{/* Action Buttons */}
								<div className="flex gap-2">
									{appointment.status === "PENDING" && (
										<>
											<Button
												size="small"
												variant="contained"
												color="success"
												onClick={() => handleApprove(appointment._id)}
												disabled={loading}
											>
												Approve
											</Button>
											<Button
												size="small"
												variant="contained"
												color="error"
												onClick={() => handleReject(appointment._id)}
												disabled={loading}
											>
												Reject
											</Button>
										</>
									)}
									{appointment.status === "FREE" && (
										<Chip label="Available" color="info" size="small"/>
									)}
									{appointment.status === "APPROVED" && (
										<Chip label="Confirmed" color="success" size="small"/>
									)}
									{appointment.status === "REJECTED" && (
										<Chip label="Rejected" color="error" size="small"/>
									)}
								</div>
							</div>
						))}
						{appointments.length === 0 && (
							<p className="text-gray-500">No appointments found</p>
						)}
					</div>

				</div>
			</div>
		</div>
	);
};

export default DoctorDashboard;
