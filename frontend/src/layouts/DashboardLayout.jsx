import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, Drawer, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
    const { role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Topbar Placeholder */}
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        HR Management Portal
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Logout</Button>
                </Toolbar>
            </AppBar>

            {/* Sidebar Placeholder */}
            <Drawer variant="permanent" sx={{ width: 240, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' } }}>
                <Toolbar />
                <Box sx={{ overflow: 'auto', p: 2 }}>
                    <Typography variant="subtitle1">Navigation ({role})</Typography>

                    {/* Conditional Menu Rendering */}
                    {role === 'ADMIN' && (
                        <Box mt={2}>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</Button>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/attendance')}>Attendance Management</Button>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/leave')}>Leave Management</Button>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/admin/performance')}>Performance Management</Button>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start', mt: 2, color: 'text.secondary', borderTop: '1px solid #ccc', pt: 1 }} onClick={() => navigate('/admin/logs')}>System Audit Logs</Button>
                        </Box>
                    )}

                    {role === 'EMPLOYEE' && (
                        <Box mt={2}>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/dashboard')}>My Dashboard</Button>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/attendance')}>My Attendance</Button>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/leave')}>My Leave</Button>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start', pl: 4, my: 0.5, fontSize: '0.8rem', color: 'text.secondary' }} onClick={() => navigate('/leave/ledger')}>↳ Leave Ledger</Button>
                            <Button fullWidth align="left" sx={{ justifyContent: 'flex-start' }} onClick={() => navigate('/performance')}>My Performance</Button>
                        </Box>
                    )}

                </Box>
            </Drawer>

            {/* Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
