import api from './api';

export const login = async (credentials) => {
    return api.post('/auth/login', credentials);
};

export const register = async (data) => {
    // return api.post('/auth/register', data);
    console.log('authService.register', data);
};
