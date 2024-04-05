import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost/8000';

interface LoginResponse {
    access: string;
    refresh: string;
    user_type: string;
}

type OnSuccess = (response: LoginResponse) => void;

type OnError = (error: any) => void;

const login = (email: string, password: string, onSuccess: OnSuccess, onError: OnError): void => {
    axios.post<LoginResponse>(`${API_URL}/api/users/login`, { email, password })
        .then(response => onSuccess(response.data))
        .catch(error => onError(error))
};

export const AuthService = {
    login,
};