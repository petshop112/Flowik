export interface LoginResponse {
    token: string;
    message: string;
    success: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterResponse {
    token: string;
    message: string;
    success: boolean;
}

export interface RegisterCredentials {
    lastName: string;
    firstName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}

export interface RecoverPasswordRequest {
    email: string;
}

export interface RecoverPasswordResponse {
    message: string;
}

export interface NewPasswordRequest {
    token: string;
    newPassword: string;
    confirmPassword: string;
}

export interface NewPasswordResponse {
    token: string;
    message: string;
    success: boolean;
}
