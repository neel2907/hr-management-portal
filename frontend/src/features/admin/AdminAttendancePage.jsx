import React, { useState, useEffect } from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { getAllAttendance } from '../../services/attendanceService';
import DataTable from '../../components/common/DataTable';
import AlertSnackbar from '../../components/common/AlertSnackbar';

const AdminAttendancePage = () => {
    // Pagination and Sort State
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Snackbar State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const sortConfig = [`${sortBy},${sortDirection}`];
            const pageData = await getAllAttendance({ page, size: pageSize, sort: sortConfig });

            setRecords(pageData.rows);
            setTotalElements(pageData.total);
            setTotalPages(pageData.totalPages);
        } catch (err) {
            setSnackbarMessage('Failed to fetch attendance records.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [page, pageSize, sortBy, sortDirection]);

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
            id: 'date',
            label: 'Date',
            sortable: true,
            render: (val) => new Date(val).toLocaleDateString()
        },
        {
            id: 'checkInTime',
            label: 'Check In',
            sortable: true,
            render: (val) => val || '--:--'
        },
        {
            id: 'checkOutTime',
            label: 'Check Out',
            sortable: true,
            render: (val) => val || '--:--'
        },
        {
            id: 'status',
            label: 'Status',
            sortable: false,
            render: (val, row) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2">{val}</Typography>
                    {row.late && (
                        <Chip label="Late" color="error" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                    )}
                    {row.overtime && (
                        <Chip label="Overtime" color="primary" size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                    )}
                </Stack>
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Company Attendance Records</Typography>

            <AlertSnackbar
                open={snackbarOpen}
                message={snackbarMessage}
                severity={snackbarSeverity}
                onClose={() => setSnackbarOpen(false)}
            />

            <DataTable
                columns={columns}
                rows={records}
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
    );
};

export default AdminAttendancePage;
