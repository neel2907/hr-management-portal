import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, CircularProgress, Button } from '@mui/material';
import { getAllLeaves, reviewLeave } from '../../services/leaveService';

const AdminLeavePage = () => {
    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    const fetchLeaves = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getAllLeaves();
            setLeaves(res.data || []);
        } catch (err) {
            setError('Failed to fetch leave requests.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleReview = async (leaveId, decision) => {
        setActionLoading(leaveId);
        setError('');
        try {
            await reviewLeave(leaveId, decision);
            fetchLeaves();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${decision.toLowerCase()} leave.`);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Leave Requests</Typography>

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
                                <TableCell>Employee Email</TableCell>
                                <TableCell>Start Date</TableCell>
                                <TableCell>End Date</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaves.length > 0 ? leaves.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell>{leave.employeeEmail}</TableCell>
                                    <TableCell>{new Date(leave.startDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(leave.endDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{leave.reason}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: leave.status === 'APPROVED' ? 'green' : leave.status === 'REJECTED' ? 'red' : 'darkorange',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {leave.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {leave.status === 'PENDING' && (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    size="small"
                                                    disabled={actionLoading === leave.id}
                                                    onClick={() => handleReview(leave.id, 'APPROVED')}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    disabled={actionLoading === leave.id}
                                                    onClick={() => handleReview(leave.id, 'REJECTED')}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No leave requests found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default AdminLeavePage;
