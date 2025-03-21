// src/api/api.js
import axios from 'axios';
import {toast} from "react-toastify";

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const base_api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getAccessToken = () => localStorage.getItem('access_token');

export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const setAccessToken = (token) => localStorage.setItem('access_token', token);

export const setRefreshToken = (token) => localStorage.setItem('refresh_token', token);

const refreshAccessToken = async () => {
    try {
        const response = await api.post('/v1/auth/refresh-token');
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        return response.data.accessToken;
    } catch (error) {
        console.error('Lỗi khi refresh token:', error);
        return null;
    }
};

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401) {
            if (!originalRequest._retry) {
                originalRequest._retry = true;
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            }
            // Nếu không refresh được token
            if (!originalRequest._retry || !getRefreshToken()) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');

                toast.error("Session expired. Please log in again.");
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);


export default api;
