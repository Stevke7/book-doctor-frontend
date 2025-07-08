import api from "./api";
import { Appointment } from "../types/appointment.types";

export const appointmentService = {
	// FETCH ALL APPOINTMENTS
	fetchAppointments: async (): Promise<Appointment[]> => {
		try {
			const { data } = await api.get("/api/appointments");
			return data;
		} catch (error) {
			console.error("Error fetching appointments:", error);
			throw error;
		}
	},

	// CREATE AN APPOINTMENT FOR DOCTORS
	doctorCreateAppointment: async (
		datetime: string,
		doctorId: string
	): Promise<Appointment> => {
		try {
			const { data } = await api.post("/api/appointments", {
				datetime,
				doctor: doctorId,
			});
			return data;
		} catch (error) {
			console.error("Error creating appointment:", error);
			throw error;
		}
	},

	//BOOK AN FREE EVENT (FOR PATIENTS)
	bookAppointment: async (appointmentId: string): Promise<Appointment> => {
		try {
			const { data } = await api.post(
				`/api/appointments/${appointmentId}/book`
			);
			return data;
		} catch (error) {
			console.error("Error booking appointment:", error);
			throw error;
		}
	},

	//DOCTOR APPROVE APPOINTMENT
	approveAppointment: async (
		id: string,
		eventId: string
	): Promise<Appointment> => {
		try {
			const { data } = await api.patch(`/api/appointments/${id}/status`, {
				status: "APPROVED",
				eventId,
			});
			return data;
		} catch (error) {
			console.error("Error approving appointment:", error);
			throw error;
		}
	},

	// DOCTOR REJECT APPOINTMENT
	rejectAppointment: async (
		id: string,
		eventId: string
	): Promise<Appointment> => {
		try {
			const { data } = await api.patch(`/api/appointments/${id}/status`, {
				status: "REJECTED",
				eventId,
			});
			return data;
		} catch (error) {
			console.error("Error rejecting appointment:", error);
			throw error;
		}
	},
};
