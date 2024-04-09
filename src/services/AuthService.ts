import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/8000';

interface LoginResponse {
    access: string;
    refresh: string;
    user_type: string;
}

interface MeResponse {
    id: number;
    email: string;
    user_type: string;
}

type OnLoginSuccess = (response: LoginResponse) => void;

type OnMeSuccess = (response: MeResponse) => void;

type OnError = (error: any) => void;

const login = (email: string, password: string, onSuccess: OnLoginSuccess, onError: OnError): void => {
    axios.post<LoginResponse>(`${API_URL}/api/users/login`, { email, password })
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

const getMe = (onSuccess: OnMeSuccess, onError: OnError): void => {
    axios.get<MeResponse>(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}`, }
    })
        .then(response => onSuccess(response.data))
        .catch(error => onError(error));
}

export const AuthService = {
    getMe,
    login,
};