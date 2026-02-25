import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, CircularProgress } from '@mui/material';
import { checkIn, checkOut, getMyRecords } from '../../services/attendanceService';

const AttendancePage = () => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecords = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getMyRecords();
            setRecords(res.data || []);
        } catch (err) {
            setError('Failed to fetch attendance records.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleAction = async (actionFn) => {
        setIsLoading(true);
        setError('');
        try {
            await actionFn();
            fetchRecords();
        } catch (err) {
            setError(err.response?.data?.message || 'Action failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>My Attendance</Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAction(checkIn)}
                    disabled={isLoading}
                >
                    Check In
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleAction(checkOut)}
                    disabled={isLoading}
                >
                    Check Out
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {isLoading && !records.length ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Check In</TableCell>
                                <TableCell>Check Out</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.length > 0 ? records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{record.checkInTime || '--:--'}</TableCell>
                                    <TableCell>{record.checkOutTime || '--:--'}</TableCell>
                                    <TableCell>{record.status}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No records found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default AttendancePage;
