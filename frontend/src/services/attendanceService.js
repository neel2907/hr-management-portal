import api from './api';

export const checkIn = async () => {
    return api.post('/api/attendance/check-in');
};

export const checkOut = async () => {
    return api.post('/api/attendance/check-out');
};

export const getMyRecords = async () => {
    return api.get('/api/attendance/my-records');
};

export const getMonthlySummary = async (year, month) => {
    return api.get(`/api/attendance/monthly-summary?year=${year}&month=${month}`);
};

// Admin endpoint
export const getAllAttendance = async () => {
    return api.get('/api/attendance/all');
};
