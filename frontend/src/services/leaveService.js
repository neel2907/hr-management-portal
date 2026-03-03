import api from './api';
import { buildPaginationParams, normalizePageTemplate } from '../utils/pagination';

export const applyLeave = async (data) => {
    return api.post('/api/leave/apply', data);
};

export const getMyRequests = async ({ page = 0, size = 10, sort = [] } = {}) => {
    const params = buildPaginationParams(page, size, sort);
    const response = await api.get(`/api/leave/my-requests${params}`);
    return normalizePageTemplate(response.data);
};

export const getLeaveBalance = async () => {
    return api.get('/api/leave/balance');
};

export const getLeaveBalanceHistory = async ({ page = 0, size = 10, sort = [] } = {}) => {
    const params = buildPaginationParams(page, size, sort);
    const response = await api.get(`/api/leave/balance/history${params}`);
    return normalizePageTemplate(response.data);
};

// Admin endpoints
export const getAllLeaves = async ({ page = 0, size = 10, sort = [] } = {}) => {
    const params = buildPaginationParams(page, size, sort);
    const response = await api.get(`/api/leave/all${params}`);
    return normalizePageTemplate(response.data);
};

export const reviewLeave = async (leaveId, decision) => {
    return api.post(`/api/leave/review/${leaveId}?decision=${decision}`);
};
