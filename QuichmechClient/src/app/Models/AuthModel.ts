export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string; // 'Customer' or 'Mechanic'
}

export interface AuthResponse {
    token: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    expiresAt: Date;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
}