import { Avatar, Button, Chip } from "@mui/material";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import {
	Add,
	CalendarMonth,
	ChatBubbleOutlineRounded,
	TextSnippetOutlined,
	SettingsOutlined,
	HelpOutline,
} from "@mui/icons-material";
import GridViewIcon from "@mui/icons-material/GridView";
import Logout from "../components/Logout";
import { useAuth } from "../context/AuthContext.tsx";
import { appointmentService } from "../services/appointmentService.ts";
import { formatAppointmentToEvent } from "../utiils/appointmentUtils.ts";
import { AppointmentCalendar } from "../components/doctor/AppointmentCalendar.tsx";
import AvatarImg from "../assets/avatar.png";
import { Appointment, Event, TimeSlot } from "../types/appointment.types.ts";

const DoctorDashboard = () => {
	const { user } = useAuth();
	const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(false);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>(
		[]
	);

	useEffect(() => {
		if (user?._id) {
			fetchAppointments();
		}
	}, [user?._id]);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const appointments = await appointmentService.fetchAppointments();
			setAppointments(appointments);
			const formattedEvents = appointments.map((apt) =>
				formatAppointmentToEvent(apt)
			);
			setEvents(formattedEvents);
			setPendingAppointments(
				appointments.filter((apt) => apt.status === "PENDING")
			);
		} catch (error) {
			toast.error("Failed to load appointments");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleSaveSlot = async () => {
		if (!selectedSlot || !user?._id) {
			toast.warn("No slot selected!");
			return;
		}

		try {
			setLoading(true);
			await appointmentService.doctorCreateAppointment(
				selectedSlot.start,
				user._id
			);
			toast.success("Slot saved successfully!");
			setSelectedSlot(null);
			await fetchAppointments();
		} catch (error) {
			toast.error("Failed to save slot");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleApprovePatient = async (
		appointmentId: string,
		patientId: string
	) => {
		try {
			setLoading(true);
			// Approve the current patient
			await appointmentService.updatePatientStatus(
				appointmentId,
				patientId,
				"APPROVED"
			);

			// Reject the other patients in the same appointment
			const appointment = appointments.find((apt) => apt._id === appointmentId);
			if (appointment) {
				const otherPatients = appointment.patient.filter(
					(pt) => pt._id !== patientId
				);
				for (let otherPatient of otherPatients) {
					await appointmentService.updatePatientStatus(
						appointmentId,
						otherPatient._id,
						"REJECTED"
					);
				}
			}

			toast.success("Patient approved successfully");
			await fetchAppointments(); // Refresh the appointments list
		} catch (error) {
			toast.error("Failed to approve the patient");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleReject = async (appointmentId: string, patientId: string) => {
		try {
			setLoading(true);
			await appointmentService.updatePatientStatus(
				appointmentId,
				patientId,
				"REJECTED"
			);
			toast.success("Appointment rejected");
			await fetchAppointments();
		} catch (error) {
			toast.error("Failed to reject appointment");
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
			/>
			<div className="flex flex-row w-full">
				<div className="flex flex-col bg-slate-100 rounded-md w-1/5 gap-6 px-6 py-4 justify-between">
					<img alt="Logo" src={Logo} />
					{/* Sidebar menu goes here */}
				</div>

				<div className="flex flex-col w-full rounded-md py-4 px-8 h-screen gap-6 bg-white">
					<AppointmentCalendar events={events} onSlotSelect={setSelectedSlot} />
					<div className="flex flex-row justify-between items-start gap-6">
						<Button
							variant="contained"
							color="primary"
							startIcon={<Add />}
							onClick={handleSaveSlot}
							disabled={loading || !selectedSlot}
						>
							{loading ? "Saving..." : "Save Slot"}
						</Button>
						{selectedSlot && (
							<div className="text-xl text-gray-600 font-bold">
								Selected: {new Date(selectedSlot.start).toLocaleString()}
							</div>
						)}
					</div>
				</div>

				<div className="mt-6 overflow-y-auto w-[35%] h-[95vh] border-l border-l-gray-300 pl-4">
					<h2 className="text-xl font-bold mb-4">All Events</h2>
					<div className="grid gap-4">
						{appointments.map((appointment) => {
							return appointment.patient.map((patient) => (
								<div
									key={`${appointment._id}-${patient._id}`}
									className="p-4 flex flex-col gap-2 bg-white rounded-lg shadow-md"
								>
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
										<p className="text-md font-semibold text-gray-600">
											Patient: {patient.name}
										</p>
									</div>

									<div className="flex gap-2">
										{appointment.status === "PENDING" && (
											<>
												<Button
													size="small"
													variant="contained"
													color="success"
													onClick={() =>
														handleApprovePatient(appointment._id, patient._id)
													}
													disabled={loading}
												>
													Approve
												</Button>
												<Button
													size="small"
													variant="contained"
													color="error"
													onClick={() =>
														handleReject(appointment._id, patient._id)
													}
													disabled={loading}
												>
													Reject
												</Button>
											</>
										)}
									</div>
								</div>
							));
						})}
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
