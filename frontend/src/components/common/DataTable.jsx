import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    Box,
    CircularProgress,
    Typography
} from '@mui/material';
import PaginationControls from './PaginationControls';

/**
 * Reusable DataTable component for server-side pagination and sorting.
 *
 * @param {Array} columns - Array of column definitions { id, label, sortable, render }
 * @param {Array} rows - Array of data objects
 * @param {boolean} loading - Loading state indicator
 * @param {Object} pagination - Pagination state { page, pageSize, total, totalPages }
 * @param {function} onPageChange - Callback: (newPage) => void
 * @param {function} onPageSizeChange - Callback: (newPageSize) => void
 * @param {function} onSortChange - Callback: (columnId, direction) => void
 * @param {string} sortBy - Currently sorted column ID
 * @param {string} sortDirection - 'asc' or 'desc'
 */
const DataTable = ({
    columns,
    rows,
    loading,
    pagination,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    sortBy,
    sortDirection
}) => {

    const handleSortRequest = (columnId) => {
        const isAsc = sortBy === columnId && sortDirection === 'asc';
        const newDirection = isAsc ? 'desc' : 'asc';
        if (onSortChange) {
            onSortChange(columnId, newDirection);
        }
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>

            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.5)',
                        zIndex: 10
                    }}
                >
                    <CircularProgress />
                </Box>
            )}

            <TableContainer sx={{ flexGrow: 1, minHeight: 300, maxHeight: 600 }}>
                <Table stickyHeader aria-label="custom data table">
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.id}
                                    sortDirection={sortBy === col.id ? sortDirection : false}
                                    sx={{ fontWeight: 'bold' }}
                                >
                                    {col.sortable ? (
                                        <TableSortLabel
                                            active={sortBy === col.id}
                                            direction={sortBy === col.id ? sortDirection : 'asc'}
                                            onClick={() => handleSortRequest(col.id)}
                                        >
                                            {col.label}
                                        </TableSortLabel>
                                    ) : (
                                        col.label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row, rowIndex) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id || rowIndex}>
                                    {columns.map((col) => {
                                        const value = row[col.id];
                                        return (
                                            <TableCell key={col.id}>
                                                {col.render ? col.render(value, row) : value}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                    {!loading && <Typography variant="body1" color="text.secondary">No records found</Typography>}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {pagination && (
                <PaginationControls
                    page={pagination.page}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    totalPages={pagination.totalPages}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            )}
        </Paper>
    );
};

export default DataTable;
