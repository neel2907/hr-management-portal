import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Alert, CircularProgress } from '@mui/material';
import { getMyReviews } from '../../services/performanceService';

const PerformancePage = () => {
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getMyReviews();
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

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Performance Reviews</Typography>

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
                                        primary={`Review by: ${review.reviewer || 'N/A'}`}
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
                                                    Date: {new Date(review.reviewDate).toLocaleDateString()}
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
        </Box>
    );
};

export default PerformancePage;
