import axios from 'axios';

// Create a centralized axios instance
const api = axios.create({
    baseURL: 'http://localhost:8081',
});

// Request interceptor definition
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        // Attach Authorization header if token exists
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor definition
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Trigger logout on 401 Unauthorized
        localStorage.removeItem('token');
        // We don't force page reload here, the app will react to token removal
    }
    return Promise.reject(error);
});

export default api;
