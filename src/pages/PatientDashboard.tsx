import { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { appointmentService } from "../services/appointmentService";
import { Appointment } from "../types/appointment.types";
import Logout from "../components/Logout";
import { PatientCalendar } from "../components/patient/PatientCalendar";
import Logo from "../assets/logo.png";
import GridViewIcon from "@mui/icons-material/GridView";
import {
	CalendarMonth,
	ChatBubbleOutlineRounded,
	HelpOutline,
	InsertInvitationOutlined,
	ModeStandbyOutlined,
	PermIdentityOutlined,
	SettingsOutlined,
	TextSnippetOutlined,
} from "@mui/icons-material";
import AvatarImg from "../assets/avatar.png";
import { Navigate } from "react-router-dom";

const PatientDashboard = () => {
	const { user, loading: authLoading } = useAuth();
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [allMyAppointments, setAllMyAppointments] = useState<Appointment[]>([]);
	const [allEvents, setAllEvents] = useState<Appointment[]>([]);

	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!authLoading && user) {
			fetchAppointments();
		}
	}, [user, authLoading]);

	const fetchAppointments = async () => {
		try {
			setLoading(true);
			const data = await appointmentService.fetchAppointments();

			let tempEvents: Appointment[] = [];

			data.forEach((app) => {
				if (app.events.length) {
					app.events.forEach((event: any) => {
						if (event.patient.toString() === user?._id.toString()) {
							let tempApp: Appointment = {
								_id: app._id,
								eventId: event._id,
								status: event.status,
								doctor: app.doctor,
								patient: event.patient,
								datetime: app.datetime,
							} as Appointment;
							tempEvents.push(tempApp);
						}
					});
				}
			});

			setAllEvents(tempEvents);

			const myEvent = data.filter((appointment) => {
				return (
					appointment.status !== "FREE" &&
					appointment.events.some(
						(event: any) => event.patient.toString() === user?._id.toString()
					)
				);
			});
			setAllMyAppointments(myEvent);
			setAppointments(data);
		} catch (error) {
			toast.error("Failed to load appointments");
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	const handleBookAppointment = async (appointmentId: string) => {
		try {
			setLoading(true);
			await appointmentService.bookAppointment(appointmentId);
			toast.success(
				"Appointment request submitted! Waiting for doctor's approval."
			);
			await fetchAppointments();
		} catch (error: any) {
			if (error.response?.status === 400) {
				toast.error("This appointment is no longer available");
			} else {
				toast.error("Failed to book appointment");
			}
		} finally {
			setLoading(false);
		}
	};

	if (!authLoading && !user) {
		return <Navigate to="/login" replace />;
	}

	return (
		<div className="flex flex-col w-full ">
			<ToastContainer />
			<div className="flex flex-row w-full">
				<div className="flex flex-col bg-slate-100 rounded-md w-[20%] gap-6 px-6 py-4 justify-between">
					<img alt="Logo" src={Logo} className="w-[150px]" />
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
				<div className="flex flex-col rounded-md py-4 px-8 w-4/5 h-screen gap-6 bg-white">
					<div className="h-3/4">
						<PatientCalendar
							appointments={appointments}
							onBookAppointment={handleBookAppointment}
							loading={loading}
						/>
					</div>

					<div className="flex flex-col w-ful">
						<h2 className="text-xl font-bold mb-4">My Appointments</h2>
						<div className="flex flex-row gap-4 p-4 overflow-x-auto">
							{allEvents.map((appointment) => (
								<div
									key={appointment._id}
									className="p-4 flex flex-col gap-3 py-4 px-6 bg-white rounded-lg border border-gray-200 min-w-[300px]"
								>
									<div className="flex flex-row justify-start gap-2 items-center">
										<InsertInvitationOutlined />
										<p className="font-medium text-sm text-gray-700">
											{new Date(appointment.datetime).toLocaleString()}
										</p>
									</div>
									<div className="flex flex-row gap-2 justify-start items-center">
										<PermIdentityOutlined />

										<p className="text-sm font-medium text-gray-600">
											Doctor: {appointment.doctor.name}
										</p>
									</div>

									<div className="mb-2 flex flex-row gap-2 justify-start items-center">
										<ModeStandbyOutlined />
										<p className="flex flex-row items-center gap-2">
											{appointment.status === "PENDING"
												? "Pending"
												: appointment.status === "APPROVED"
												? "Approved"
												: appointment.status === "REJECTED"
												? "Rejected"
												: "default"}
										</p>
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
		</div>
	);
};

export default PatientDashboard;
