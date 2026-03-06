import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { getAuditLogs } from '../../services/adminService';
import DataTable from '../../components/common/DataTable';
import AlertSnackbar from '../../components/common/AlertSnackbar';

const AdminAuditLogPage = () => {
    // Pagination and Sort State
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [sortBy, setSortBy] = useState('timestamp');
    const [sortDirection, setSortDirection] = useState('desc');
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Snackbar State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const sortConfig = [`${sortBy},${sortDirection}`];
            const pageData = await getAuditLogs({ page, size: pageSize, sort: sortConfig });

            setLogs(pageData.rows);
            setTotalElements(pageData.total);
            setTotalPages(pageData.totalPages);
        } catch (err) {
            setSnackbarMessage('Failed to fetch audit logs.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, pageSize, sortBy, sortDirection]);

    const handleSortChange = (columnId, direction) => {
        setSortBy(columnId);
        setSortDirection(direction);
    };

    const columns = [
        {
            id: 'timestamp',
            label: 'Timestamp',
            sortable: true,
            render: (val) => new Date(val).toLocaleString()
        },
        {
            id: 'action',
            label: 'Action',
            sortable: true,
            render: (val) => (
                <Typography variant="body2" fontWeight="bold">
                    {val}
                </Typography>
            )
        },
        {
            id: 'performedBy',
            label: 'User',
            sortable: true
        },
        {
            id: 'entity',
            label: 'Entity',
            sortable: true
        },
        {
            id: 'details',
            label: 'Details',
            sortable: false,
            render: (val) => (
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={val}>
                    {val}
                </Typography>
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>System Audit Logs</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                View security and administrative actions across the portal.
            </Typography>

            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />

            <Box mt={3}>
                <DataTable
                    columns={columns}
                    rows={logs}
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
            </Box>
        </Box>
    );
};

export default AdminAuditLogPage;
