export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: 'doctor' | 'patient';
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
    role: 'doctor' | 'patient';
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role: 'doctor' | 'patient';
    };
    token: string;
}