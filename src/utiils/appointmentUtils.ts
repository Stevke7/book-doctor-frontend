import { Appointment, Event } from "../types/appointment.types.ts";
export const getEventColor = (status: string): string => {
	const colors = {
		FREE: "#4CAF50",
		PENDING: "#DA8B16",
		APPROVED: "#2196F3",
		REJECTED: "#C22013",
	};
	return colors[status as keyof typeof colors] || colors.FREE;
};

export const formatAppointmentToEvent = (appointment: Appointment): Event => ({
	title: `Dr. ${appointment.doctor.name}`,
	start: appointment.datetime,
	end: new Date(
		new Date(appointment.datetime).getTime() + 30 * 60000
	).toISOString(),
	status: appointment.status,
	backgroundColor: "#F6F6F6",
	fontColor: getEventColor(appointment.status),
	doctorId: appointment.doctor._id,
});
