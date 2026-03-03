import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { getLeaveBalanceHistory } from '../../services/leaveService';
import DataTable from '../../components/common/DataTable';

const LeaveBalanceHistoryPage = () => {
    // Pagination and Sort State
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState('timestamp');
    const [sortDirection, setSortDirection] = useState('desc');
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchHistory = async () => {
        setIsLoading(true);
        setError('');
        try {
            const sortConfig = [`${sortBy},${sortDirection}`];
            const pageData = await getLeaveBalanceHistory({ page, size: pageSize, sort: sortConfig });

            setHistory(pageData.rows);
            setTotalElements(pageData.total);
            setTotalPages(pageData.totalPages);
        } catch (err) {
            setError('Failed to fetch leave balance ledger.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [page, pageSize, sortBy, sortDirection]);

    const handleSortChange = (columnId, direction) => {
        setSortBy(columnId);
        setSortDirection(direction);
    };

    const columns = [
        {
            id: 'timestamp',
            label: 'Date & Time',
            sortable: true,
            render: (val) => new Date(val).toLocaleString()
        },
        {
            id: 'daysDeducted',
            label: 'Days Deducted',
            sortable: true,
            render: (val) => (
                <Typography variant="body2" color="error.main" fontWeight="bold">
                    {val > 0 ? `-${val}` : val}
                </Typography>
            )
        },
        {
            id: 'balanceAfter',
            label: 'Balance After',
            sortable: true,
            render: (val) => (
                <Typography variant="body2" fontWeight="bold">
                    {val}
                </Typography>
            )
        }
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Leave Balance Ledger</Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                History of all deductions and adjustments for your leave balance.
            </Typography>

            <Box mt={3}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <DataTable
                    columns={columns}
                    rows={history}
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

export default LeaveBalanceHistoryPage;
