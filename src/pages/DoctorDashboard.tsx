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
	let [appointments, setAppointments] = useState<Appointment[]>([]);
	const [allEvents, setAllEvents] = useState<Appointment[]>([]);

	useEffect(() => {
		if (user?._id) {
			fetchAppointments();
		}
	}, [user?._id]);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			appointments = await appointmentService.fetchAppointments();
			setAppointments(appointments);
			if (user?.role === "doctor") {
				const tempEvents: Appointment[] = [];
				console.log("Fetched appointments:", appointments);

				appointments.forEach((app) => {
					if (
						app.status === "FREE" &&
						app.events.length &&
						app.events.some((event: Event) => event.status === "PENDING")
					) {
						app.status = "PENDING";
					}

					if (app.events.length) {
						app.events.forEach((event: Event) => {
							const tempApp: Appointment = {
								_id: app._id,
								eventId: event._id,
								status: event.status,
								doctor: app.doctor,
								patient: event.patient,
								datetime: app.datetime,
							} as Appointment;
							tempEvents.push(tempApp);
						});
					}
				});
				setAllEvents(tempEvents);
			}
			const formattedEvents = appointments.map((apt) =>
				formatAppointmentToEvent(apt)
			);
			setEvents(formattedEvents);
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

	const handleApprove = async (appointmentId: string, eventId: string) => {
		try {
			setLoading(true);
			await appointmentService.approveAppointment(appointmentId, eventId);
			toast.success("Appointment approved");
			await fetchAppointments();
		} catch (error) {
			toast.error("Failed to approve appointment");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleReject = async (appointmentId: string, eventId: string) => {
		try {
			setLoading(true);
			await appointmentService.rejectAppointment(appointmentId, eventId);
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
				newestOnTop={false}
				closeOnClick={true}
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<div className="flex flex-row w-full">
				<div className="flex flex-col bg-slate-100 rounded-md w-1/5 gap-6 px-6 py-4 justify-between">
					<img src={Logo} />
					<div className="flex flex-col">
						<div className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
							<GridViewIcon width={40} height={44} />
							<p className="text-sm font-medium font-black ">Dashboard</p>
						</div>
						<div className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
							<CalendarMonth width={40} height={44} />
							<p className="text-sm font-medium font-black">Appointments</p>
						</div>
						<div className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
							<ChatBubbleOutlineRounded width={40} height={44} />
							<p className="text-sm font-medium font-black">Messages</p>
						</div>
						<div className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
							<TextSnippetOutlined width={40} height={44} />
							<p className="text-sm font-medium font-black">Billing</p>
						</div>
						<div className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
							<SettingsOutlined width={40} height={44} />
							<p className="text-sm font-medium font-black">Settings</p>
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex flex-row gap-2 p-3 items-center cursor-pointer hover:bg-teal-200 rounded-md">
							<HelpOutline width={40} height={44} />
							<p className="text-sm font-medium font-black">Help Center</p>
						</div>
						<Logout />
					</div>
					<div className="flex flex-row px-3 py-2 bg-white rounded-md items-center gap-2.5">
						<Avatar
							alt="Remy Sharp"
							sx={{ width: 32, height: 32 }}
							src={AvatarImg}
						/>
						<p className="text-sm font-semibold">{user?.name}</p>
					</div>
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
				<div className="mt-6 overflow-y-auto w-[35%] h-[95vh] border-l border-l-gray-300 px-4">
					<h2 className="text-xl font-bold mb-4">All Events</h2>
					<div className="grid gap-4">
						{allEvents.map((appointment) => (
							<div
								key={`${appointment._id}-${appointment.eventId}`}
								className="p-4 flex flex-col gap-2 bg-white rounded-lg border border-gray-200"
							>
								<div className="mb-2 flex flex-row gap-2 justify-between">
									<Chip
										label={appointment.status}
										variant="outlined"
										sx={{
											color:
												appointment.status === "PENDING"
													? "orange"
													: appointment.status === "APPROVED"
													? "green"
													: appointment.status === "REJECTED"
													? "red"
													: "default",
										}}
										size="small"
										className="text-sm font-semibold"
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

								<div className="flex gap-2">
									{appointment.status === "PENDING" && (
										<>
											<Button
												size="small"
												variant="contained"
												sx={{
													backgroundColor: "#dcfce7",
													color: "#14532d",
													fontWeight: "bold",
												}}
												onClick={() =>
													handleApprove(appointment._id, appointment.eventId)
												}
												disabled={loading}
											>
												Approve
											</Button>

											<Button
												size="small"
												variant="contained"
												sx={{
													backgroundColor: "#fee2e2",
													color: "#991b1b",
													fontWeight: "bold",
												}}
												onClick={() =>
													handleReject(appointment._id, appointment.eventId)
												}
												disabled={loading}
											>
												Reject
											</Button>
										</>
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
