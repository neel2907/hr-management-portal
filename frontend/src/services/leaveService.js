import api from './api';

export const applyLeave = async (data) => {
    return api.post('/api/leave/apply', data);
};

export const getMyRequests = async () => {
    return api.get('/api/leave/my-requests');
};

// Admin endpoints
export const getAllLeaves = async () => {
    return api.get('/api/leave/all');
};

export const reviewLeave = async (leaveId, decision) => {
    return api.post(`/api/leave/review/${leaveId}?decision=${decision}`);
};
