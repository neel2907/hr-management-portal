import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, CircularProgress } from '@mui/material';
import { getAllAttendance } from '../../services/attendanceService';

const AdminAttendancePage = () => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecords = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getAllAttendance();
            setRecords(res.data || []);
        } catch (err) {
            setError('Failed to fetch attendance records.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Company Attendance Records</Typography>

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
                                <TableCell>Date</TableCell>
                                <TableCell>Check In</TableCell>
                                <TableCell>Check Out</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {records.length > 0 ? records.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell>{record.employeeEmail}</TableCell>
                                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{record.checkInTime || '--:--'}</TableCell>
                                    <TableCell>{record.checkOutTime || '--:--'}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">No attendance records found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default AdminAttendancePage;
