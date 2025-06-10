import axios from 'axios';

const API_URL = 'http://localhost:5032/api';

// Axios instance oluştur
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - her istekte token ekle
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - 401 hatalarını yakala
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const login = async (sicilNo: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { sicilNo, password });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (userData: any) => {
    try {
        const response = await api.post('/auth/register', userData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTayinTalepleri = async () => {
    try {
        const response = await api.get('/tayin');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTayinTalebi = async (talepData: any) => {
    try {
        const response = await api.post('/tayin', talepData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTayinTalebi = async (id: number, talepData: any) => {
    try {
        const response = await api.put(`/tayin/${id}`, talepData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTayinTalebi = async (id: number) => {
    try {
        const response = await api.delete(`/tayin/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 