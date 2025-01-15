import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
	Appointment,
	Event,
	PatientCalendarProps,
} from "../../types/appointment.types";
import { useAuth } from "../../context/AuthContext";
import {
	formatAppointmentToEvent,
	getEventColor,
} from "../../utiils/appointmentUtils.ts";
import { Circle } from "@mui/icons-material";

export const PatientCalendar = ({
	appointments,
	onBookAppointment,
	loading,
}: PatientCalendarProps) => {
	const { user } = useAuth();
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [events, setEvents] = useState<Appointment[]>([]);

	useEffect(() => {
		let tempEvents: Appointment[] = appointments.map(
			(apt) =>
				({
					...formatAppointmentToEvent(apt),
					title: getEventTitle(apt, userId!),
					status: getStatus(apt),
					backgroundColor: "#F6F6F6",
					fontColor: getEventColor(getStatus(apt)),
					extendedProps: {
						isMyAppointment: !!apt.events.find(
							(event: Event) => event.patient === userId
						),
						doctor: apt.doctor.name,
						fontColor: getEventColor(getStatus(apt)),
					},
				} as unknown as Appointment)
		);
		setEvents(tempEvents);
	}, [appointments]);

	const getEventTitle = (appointment: Appointment, userId: string): string => {
		const userEvent = appointment.events.find(
			(event: Event) => event.patient === userId
		) as unknown as Event;

		if (userEvent) {
			switch (userEvent.status) {
				case "PENDING":
					return "Pending Approval";
				case "APPROVED":
					return "Approved";
				case "REJECTED":
					return "Rejected";
				default:
					return "Unknown Status";
			}
		}

		return appointment.status === "FREE" ? "Available" : "Booked";
	};

	const userId = user?._id;

	const getStatus = (appointment: Appointment) => {
		for (const event of appointment.events) {
			if (event.patient?.toString() === user?._id.toString()) {
				return event.status;
			}
		}
		return "FREE";
	};
	console.log("get status");

	console.log("events", events);

	const handleEventClick = (info: any) => {
		const appointment = appointments.find(
			(apt) => new Date(apt.datetime).getTime() === info.event.start.getTime()
		);

		if (
			appointment &&
			appointment.status !== "APPROVED" &&
			appointment.status !== "REJECTED"
		) {
			if (
				appointment.patient?._id === user?._id &&
				appointment.status === "PENDING"
			) {
				return;
			}
			setSelectedAppointment(appointment);
			setDialogOpen(true);
		}
	};

	const handleBook = async () => {
		if (selectedAppointment) {
			await onBookAppointment(selectedAppointment._id);
			setDialogOpen(false);
			setSelectedAppointment(null);
		}
	};

	return (
		<>
			<div className="flex flex-col w-full bg-white p-4 rounded-md h-full">
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="timeGridWeek"
					events={events}
					eventClick={handleEventClick}
					eventMinHeight={50}
					height="100%"
					eventContent={(eventInfo) => (
						<div className="flex flex-col justify-start p-1 gap-1 border-none">
							<div className="text-sm font-semibold text-black">
								Dr. {eventInfo.event.extendedProps.doctor}
							</div>
							<div
								className=" flex flex-row gap-1 items-center font-semibold "
								style={{ color: eventInfo.event.extendedProps.fontColor }}
							>
								<Circle
									sx={{
										width: 8,
										height: 8,
										color: eventInfo.event.extendedProps.fontColor,
									}}
								/>
								{eventInfo.event.title}
							</div>
						</div>
					)}
				/>
			</div>

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>Book Appointment</DialogTitle>
				<DialogContent>
					{selectedAppointment && (
						<div className="p-4">
							<p>
								Date:{" "}
								{new Date(selectedAppointment.datetime).toLocaleDateString()}
							</p>
							<p>
								Time:{" "}
								{new Date(selectedAppointment.datetime).toLocaleTimeString()}
							</p>
							<p>Doctor: Dr. {selectedAppointment.doctor.name}</p>
							{appointments.some(
								(apt) =>
									apt.datetime === selectedAppointment.datetime &&
									apt.status === "PENDING"
							) && (
								<p className="text-yellow-600 mt-2">
									Note: Other patients are also interested in this time slot
								</p>
							)}
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<Button
						onClick={handleBook}
						disabled={loading}
						variant="contained"
						color="primary"
					>
						{loading ? "Booking..." : "Confirm Booking"}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
