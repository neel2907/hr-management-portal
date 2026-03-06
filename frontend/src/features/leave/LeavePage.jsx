import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Paper, Grid, MenuItem } from '@mui/material';
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
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: ''
    });
    const [errors, setErrors] = useState({});

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
            setSnackbarMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
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
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.leaveType) newErrors.leaveType = 'Leave type is required.';
        if (!formData.startDate) newErrors.startDate = 'Start date is required.';
        if (formData.startDate && formData.endDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
            newErrors.endDate = 'End date must be after start date.';
        }
        if (!formData.reason.trim()) newErrors.reason = 'Reason should not be empty.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            await applyLeave(formData);
            setFormData({ leaveType: '', startDate: '', endDate: '', reason: '' });
            setPage(0); // View new request
            setSnackbarMessage('Leave request submitted successfully.');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            fetchRequests();
        } catch (err) {
            setSnackbarMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
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
            id: 'leaveType',
            label: 'Leave Type',
            sortable: true
        },
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
                                select
                                fullWidth
                                label="Leave Type"
                                name="leaveType"
                                value={formData.leaveType}
                                onChange={handleChange}
                                required
                                error={!!errors.leaveType}
                                helperText={errors.leaveType}
                                sx={{ mb: 2 }}
                            >
                                <MenuItem value="SICK">Sick Leave</MenuItem>
                                <MenuItem value="CASUAL">Casual Leave</MenuItem>
                                <MenuItem value="ANNUAL">Annual Leave</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Start Date"
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                required
                                error={!!errors.startDate}
                                helperText={errors.startDate}
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
                                error={!!errors.endDate}
                                helperText={errors.endDate}
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
                                error={!!errors.reason}
                                helperText={errors.reason}
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
