import api from './api';

export const getMyReviews = async () => {
    return api.get('/api/performance/my-reviews');
};

// Admin endpoints
export const createReview = async (data) => {
    return api.post('/api/performance/review', data);
};

export const getAllReviews = async () => {
    return api.get('/api/performance/all');
};
