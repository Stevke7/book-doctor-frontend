import {AuthUser} from "./auth.types.ts";

export interface Appointment {
    _id: string;
    datetime: string;
    status: 'FREE' | 'PENDING' | 'APPROVED' | 'REJECTED';
    patient?: AuthUser;
    doctor: AuthUser;
    createdAt: string;
    updatedAt: string;
}