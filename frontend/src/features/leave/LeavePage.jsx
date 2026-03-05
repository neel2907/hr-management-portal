import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid } from '@mui/material';
import { applyLeave, getMyRequests } from '../../services/leaveService';
import LeaveBalanceCard from './LeaveBalanceCard';
import DataTable from '../../components/common/DataTable';
import AlertSnackbar from '../../components/common/AlertSnackbar';

const LeavePage = () => {
    // Pagination and Sort State
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('startDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        reason: ''
    });

    // Snackbar State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const sortConfig = [`${sortBy},${sortDirection}`];
            const pageData = await getMyRequests({ page, size: pageSize, sort: sortConfig });

            setRequests(pageData.rows);
            setTotalElements(pageData.total);
            setTotalPages(pageData.totalPages);
        } catch (err) {
            setSnackbarMessage('Failed to fetch leave requests.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [page, pageSize, sortBy, sortDirection]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await applyLeave(formData);
            setFormData({ startDate: '', endDate: '', reason: '' });
            setPage(0); // View new request
            setSnackbarMessage('Leave request submitted successfully.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchRequests();
        } catch (err) {
            setSnackbarMessage(err.response?.data?.message || 'Failed to apply for leave.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSortChange = (columnId, direction) => {
        setSortBy(columnId);
        setSortDirection(direction);
    };

    const columns = [
        {
            id: 'startDate',
            label: 'Start Date',
            sortable: true,
            render: (val) => new Date(val).toLocaleDateString()
        },
        {
            id: 'endDate',
            label: 'End Date',
            sortable: true,
            render: (val) => new Date(val).toLocaleDateString()
        },
        {
            id: 'reason',
            label: 'Reason',
            sortable: true
        },
        {
            id: 'status',
            label: 'Status',
            sortable: true,
            render: (val) => (
                <Typography
                    variant="body2"
                    sx={{
                        color: val === 'APPROVED' ? 'success.main' : val === 'REJECTED' ? 'error.main' : 'warning.main',
                        fontWeight: 'bold'
                    }}
                >
                    {val}
                </Typography>
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Leave Management</Typography>

            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />

            {/* NEW LEAVE BALANCE COMPONENT */}
            <LeaveBalanceCard />

            <Grid container spacing={4}>
                {/* Leave Application Form */}
                <Grid item xs={12} md={4}>
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
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">My Requests</Typography>
                    </Box>

                    <DataTable
                        columns={columns}
                        rows={requests}
                        loading={isLoading}
                        pagination={{
                            page,
                            pageSize,
                            total: totalElements,
                            totalPages
                        }}
                        onPageChange={setPage}
                        onPageSizeChange={setPageSize}
                        onSortChange={handleSortChange}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default LeavePage;
