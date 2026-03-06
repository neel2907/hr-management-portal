import api from './api';
import { buildPaginationParams, normalizePageTemplate } from '../utils/pagination';

export const getDashboardStats = async () => {
    return api.get('/admin/dashboard');
};

export const getAuditLogs = async ({ page = 0, size = 20, sort = [] } = {}) => {
    const params = buildPaginationParams(page, size, sort);
    const response = await api.get(`/audit/logs${params}`);
    return normalizePageTemplate(response.data);
};
