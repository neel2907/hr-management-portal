import api from './api';
import { buildPaginationParams, normalizePageTemplate } from '../utils/pagination';

export const checkIn = async () => {
    return api.post('/attendance/check-in');
};

export const checkOut = async () => {
    return api.post('/attendance/check-out');
};

export const getMyRecords = async ({ page = 0, size = 10, sort = [] } = {}) => {
    const params = buildPaginationParams(page, size, sort);
    const response = await api.get(`/attendance/my-records${params}`);
    return normalizePageTemplate(response.data);
};

export const getMonthlySummary = async (year, month) => {
    return api.get(`/attendance/monthly-summary?year=${year}&month=${month}`);
};

// Admin endpoint
export const getAllAttendance = async ({ page = 0, size = 10, sort = [] } = {}) => {
    const params = buildPaginationParams(page, size, sort);
    const response = await api.get(`/attendance/all${params}`);
    return normalizePageTemplate(response.data);
};
