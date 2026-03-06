import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
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
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
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
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography color="textSecondary">Total Employees</Typography>
                                </Box>
                                <Typography variant="h5">{stats.totalEmployees || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PendingActionsIcon color="secondary" sx={{ mr: 1 }} />
                                    <Typography color="textSecondary">Pending Leaves</Typography>
                                </Box>
                                <Typography variant="h5">{stats.pendingLeaves || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EventIcon color="success" sx={{ mr: 1 }} />
                                    <Typography color="textSecondary">Today's Attendance</Typography>
                                </Box>
                                <Typography variant="h5">{stats.todaysAttendance || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AssignmentIcon color="info" sx={{ mr: 1 }} />
                                    <Typography color="textSecondary">Total Leave Requests</Typography>
                                </Box>
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
