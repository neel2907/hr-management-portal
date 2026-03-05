import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { getAllLeaves, reviewLeave } from '../../services/leaveService';
import DataTable from '../../components/common/DataTable';
import AlertSnackbar from '../../components/common/AlertSnackbar';

const AdminLeavePage = () => {
    // Pagination and Sort State
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('startDate');
    const [sortDirection, setSortDirection] = useState('desc');
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [leaves, setLeaves] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    // Snackbar State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchLeaves = async () => {
        setIsLoading(true);
        try {
            const sortConfig = [`${sortBy},${sortDirection}`];
            const pageData = await getAllLeaves({ page, size: pageSize, sort: sortConfig });

            setLeaves(pageData.rows);
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
        fetchLeaves();
    }, [page, pageSize, sortBy, sortDirection]);

    const handleReview = async (leaveId, decision) => {
        setActionLoading(leaveId);

        // Optimistic UI Update
        const previousLeaves = [...leaves];
        const updatedLeaves = leaves.map(leave =>
            leave.id === leaveId ? { ...leave, status: decision } : leave
        );
        setLeaves(updatedLeaves);

        try {
            await reviewLeave(leaveId, decision);
            setSnackbarMessage(`Leave successfully ${decision.toLowerCase()}.`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            // Revert on failure
            setLeaves(previousLeaves);
            setSnackbarMessage(err.response?.data?.message || `Failed to ${decision.toLowerCase()} leave.`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setActionLoading(null);
        }
    };

    const handleSortChange = (columnId, direction) => {
        setSortBy(columnId);
        setSortDirection(direction);
    };

    const columns = [
        {
            id: 'employeeEmail',
            label: 'Employee Email',
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
        },
        {
            id: 'actions',
            label: 'Actions',
            sortable: false,
            render: (_, row) => (
                row.status === 'PENDING' ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            disabled={actionLoading === row.id}
                            onClick={() => handleReview(row.id, 'APPROVED')}
                        >
                            Approve
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            disabled={actionLoading === row.id}
                            onClick={() => handleReview(row.id, 'REJECTED')}
                        >
                            Reject
                        </Button>
                    </Box>
                ) : null
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Leave Requests</Typography>

            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />

            <DataTable
                columns={columns}
                rows={leaves}
                loading={isLoading && !actionLoading}
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
        </Box>
    );
};

export default AdminLeavePage;
