```javascript
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack, Chip } from '@mui/material';
import { getMyRecords } from '../../services/attendanceService';
import api from '../../services/api';
import DataTable from '../../components/common/DataTable';
import AlertSnackbar from '../../components/common/AlertSnackbar';

const AttendancePage = () => {
    // Pagination and Sort State
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    
    // Snackbar State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const sortConfig = [`${ sortBy },${ sortDirection } `];
            const pageData = await getMyRecords({ page, size: pageSize, sort: sortConfig });
            
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

    const handleAction = async (action) => {
        setActionLoading(true);
        try {
            await api.post(`/ api / attendance / ${ action } `);
            setSnackbarMessage(`Successfully checked ${ action === 'check-in' ? 'in' : 'out' }.`);
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setPage(0); // View the new record on the first page
            fetchRecords();
        } catch (err) {
            setSnackbarMessage(err.response?.data?.message || `Failed to check ${ action === 'check-in' ? 'in' : 'out' }.`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        } finally {
            setActionLoading(false);
        }
    };

    const handleSortChange = (columnId, direction) => {
        setSortBy(columnId);
        setSortDirection(direction);
    };

    const columns = [
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
            sortable: true,
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
            <Typography variant="h4" gutterBottom>My Attendance</Typography>

            <AlertSnackbar 
                open={snackbarOpen} 
                message={snackbarMessage} 
                severity={snackbarSeverity} 
                onClose={() => setSnackbarOpen(false)} 
            />

            <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleAction('check-in')}
                    disabled={actionLoading}
                >
                    Check In
                </Button>
                <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleAction('check-out')}
                    disabled={actionLoading}
                >
                    Check Out
                </Button>
            </Paper>

            <Typography variant="h6" gutterBottom>Attendance History</Typography>
            
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

export default AttendancePage;
```
