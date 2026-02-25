import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Alert, CircularProgress, Button, TextField, Grid } from '@mui/material';
import { getAllReviews, createReview } from '../../services/performanceService';

const AdminPerformancePage = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        employeeEmail: '',
        rating: '',
        comments: ''
    });

    const fetchReviews = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getAllReviews();
            setReviews(res.data || []);
        } catch (err) {
            setError('Failed to fetch performance reviews.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await createReview(formData);
            setFormData({ employeeEmail: '', rating: '', comments: '' });
            fetchReviews();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create review.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Performance Management</Typography>

            <Grid container spacing={4}>
                {/* Create Review Form */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Create Review</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Employee Email"
                                type="email"
                                name="employeeEmail"
                                value={formData.employeeEmail}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Rating (1-5)"
                                type="number"
                                name="rating"
                                inputProps={{ min: 1, max: 5 }}
                                value={formData.rating}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Comments"
                                name="comments"
                                value={formData.comments}
                                onChange={handleChange}
                                multiline
                                rows={4}
                                required
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                type="submit"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* All Reviews List */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>All Company Reviews</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Paper>
                            <List>
                                {reviews.length > 0 ? reviews.map((review, index) => (
                                    <React.Fragment key={review.id}>
                                        <ListItem alignItems="flex-start">
                                            <ListItemText
                                                primary={`Employee: ${review.employeeEmail || 'N/A'}`}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            Rating: {review.rating} / 5
                                                        </Typography>
                                                        {` — ${review.comments}`}
                                                        <br />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Reviewer: {review.reviewer || 'N/A'} | Date: {new Date(review.reviewDate).toLocaleDateString()}
                                                        </Typography>
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        {index < reviews.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                )) : (
                                    <ListItem>
                                        <ListItemText primary="No performance reviews found." />
                                    </ListItem>
                                )}
                            </List>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminPerformancePage;
