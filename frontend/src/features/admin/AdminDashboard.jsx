import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { getDashboardStats } from '../../services/adminService';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getDashboardStats();
            setStats(res.data);
        } catch (err) {
            setError('Failed to fetch dashboard statistics.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : stats ? (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Employees</Typography>
                                <Typography variant="h5">{stats.totalEmployees || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Pending Leaves</Typography>
                                <Typography variant="h5">{stats.pendingLeaves || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Today's Attendance</Typography>
                                <Typography variant="h5">{stats.todaysAttendance || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>Total Leave Requests</Typography>
                                <Typography variant="h5">{stats.totalLeaveRequests || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            ) : (
                <Typography>No statistics available.</Typography>
            )}
        </Box>
    );
};

export default AdminDashboard;
