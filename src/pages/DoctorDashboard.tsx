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

	useEffect(() => {
		if (user?.id){
			fetchAppointments();
		}

	}, [user?.id]);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const appointments = await appointmentService.fetchAppointments();
			const formattedEvents = appointments.map(apt =>
				formatAppointmentToEvent(apt, user?.name || '')
			);
			setEvents(formattedEvents);
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
			<div className="flex flex-row w-full">
				<div className="flex flex-col bg-slate-100 rounded-md w-1/5 gap-4 px-12 py-10 justify-between">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2 items-center justify-center">
							<Avatar sx={{ width: 54, height: 54 }}></Avatar>
							<p className="font-semibold text-2xl">{user?.name}</p>
							<p className="font-medium text-xl">{user?.role}</p>
						</div>
					</div>
					<Logout />
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
			</div>
		</div>
	);
};

export default DoctorDashboard;
