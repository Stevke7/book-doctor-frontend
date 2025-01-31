import { AuthUser } from "./auth.types.ts";

export interface Appointment {
	_id: string;
	eventId: string;
	datetime: string;
	status: "FREE" | "PENDING" | "APPROVED" | "REJECTED";
	patient?: AuthUser;
	doctor: AuthUser;
	createdAt: string;
	updatedAt: string;
	events: Event[];
	title?: string;
}

export interface TimeSlot {
	start: string;
	end: string;
}

export interface Event {
	title: string;
	start: string;
	end: string;
	status?: "FREE" | "PENDING" | "APPROVED" | "REJECTED";
	backgroundColor: string;
	doctorId: string;
	fontColor: string;
	patient?: string;
	_id: string;
}

export interface PatientCalendarProps {
	appointments: Appointment[];
	onBookAppointment: (appointmentId: string) => Promise<void>;
	loading: boolean;
}

export interface AppointmentCalendarProps {
	events: Event[];
	onSlotSelect: (slot: TimeSlot) => void;
}
