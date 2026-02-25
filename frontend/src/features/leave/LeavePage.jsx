import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, CircularProgress } from '@mui/material';
import { applyLeave, getMyRequests } from '../../services/leaveService';

const LeavePage = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });

    const fetchRequests = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getMyRequests();
            setRequests(res.data || []);
        } catch (err) {
            setError('Failed to fetch leave requests.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await applyLeave(formData);
            setFormData({ startDate: '', endDate: '', reason: '' });
            fetchRequests();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to apply for leave.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Leave Management</Typography>

            <Grid container spacing={4}>
                {/* Leave Application Form */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Apply for Leave</Typography>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="End Date"
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Reason"
                                name="reason"
                                value={formData.reason}
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
                                {isSubmitting ? 'Submitting...' : 'Apply Leave'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Leave Requests List */}
                <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>My Requests</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Start Date</TableCell>
                                        <TableCell>End Date</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.length > 0 ? requests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>{new Date(req.startDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(req.endDate).toLocaleDateString()}</TableCell>
                                            <TableCell>{req.reason}</TableCell>
                                            <TableCell>
                                                <Typography
                                                    variant="body2"
                                                    sx={{
                                                        color: req.status === 'APPROVED' ? 'green' : req.status === 'REJECTED' ? 'red' : 'darkorange',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    {req.status}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">No leave requests found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default LeavePage;
