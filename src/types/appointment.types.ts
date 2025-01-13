import { AuthUser } from "./auth.types.ts";

export interface Appointment {
	_id: string;
	datetime: string;
	status: "FREE" | "PENDING" | "APPROVED" | "REJECTED";
	patient?: AuthUser[];
	doctor: AuthUser;
	createdAt: string;
	updatedAt: string;
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
}
