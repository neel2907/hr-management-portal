import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { getLeaveBalance } from '../../services/leaveService';

const LeaveBalanceCard = () => {
    const [balance, setBalance] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchBalance = async () => {
        setIsLoading(true);
        setError('');
        try {
            const res = await getLeaveBalance();
            setBalance(res.data?.remainingBalance ?? 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    return (
        <Card sx={{ minWidth: 275, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="inherit" gutterBottom>
                    Leave Balance Summary
                </Typography>

                {isLoading ? (
                    <Box sx={{ display: 'flex', mt: 2 }}>
                        <CircularProgress color="inherit" size={24} />
                    </Box>
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
                ) : (
                    <Typography variant="h3" component="div">
                        {balance} <Typography component="span" variant="h5">days</Typography>
                    </Typography>
                )}

                <Typography sx={{ mt: 1.5 }} color="inherit" variant="body2">
                    Available remaining paid time off.
                </Typography>
            </CardContent>
        </Card>
    );
};

export default LeaveBalanceCard;
