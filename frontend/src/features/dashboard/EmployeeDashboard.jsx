import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AttendanceIcon from '@mui/icons-material/AccessTime';
import LeaveIcon from '@mui/icons-material/EventNote';
import PerformanceIcon from '@mui/icons-material/Assessment';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const modules = [
        { title: 'Attendance', icon: <AttendanceIcon fontSize="large" />, path: '/attendance', color: '#1976d2' },
        { title: 'Leave', icon: <LeaveIcon fontSize="large" />, path: '/leave', color: '#2e7d32' },
        { title: 'Performance', icon: <PerformanceIcon fontSize="large" />, path: '/performance', color: '#ed6c02' },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Welcome, {user?.email || user?.sub || 'Employee'}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Access your HR management modules below.
            </Typography>

            <Grid container spacing={3}>
                {modules.map((module) => (
                    <Grid item xs={12} sm={4} key={module.title}>
                        <Card sx={{ height: '100%' }}>
                            <CardActionArea
                                onClick={() => navigate(module.path)}
                                sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, alignItems: 'center' }}
                            >
                                <Box sx={{ color: module.color, mb: 2 }}>
                                    {module.icon}
                                </Box>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Typography variant="h6" component="div">
                                        {module.title}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default EmployeeDashboard;
