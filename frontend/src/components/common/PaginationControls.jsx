import React from 'react';
import { Box, Typography, IconButton, Select, MenuItem, FormControl, Tooltip } from '@mui/material';
import {
    KeyboardArrowLeft as PrevIcon,
    KeyboardArrowRight as NextIcon,
    FirstPage as FirstPageIcon,
    LastPage as LastPageIcon
} from '@mui/icons-material';

/**
 * Reusable PaginationControls component for server-side pagination.
 * 
 * @param {number} page - Current page index (0-based)
 * @param {number} pageSize - Number of items per page
 * @param {number} total - Total number of items
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Callback when page changes: (newPage) => void
 * @param {function} onPageSizeChange - Callback when page size changes: (newPageSize) => void
 */
const PaginationControls = ({
    page,
    pageSize,
    total,
    totalPages,
    onPageChange,
    onPageSizeChange
}) => {

    // Safety checks
    const currentPage = Math.max(0, page);
    const safeTotalPages = Math.max(1, totalPages);

    const isFirstPage = currentPage === 0;
    const isLastPage = currentPage >= safeTotalPages - 1;

    // Calculate item range being displayed
    const startItem = total === 0 ? 0 : (currentPage * pageSize) + 1;
    const endItem = Math.min((currentPage + 1) * pageSize, total);

    const handlePageSizeChange = (event) => {
        if (onPageSizeChange) {
            onPageSizeChange(parseInt(event.target.value, 10));
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
            gap: 2,
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper'
        }}>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Rows per page:
                </Typography>
                <FormControl variant="standard" size="small">
                    <Select
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        disableUnderline
                        sx={{ fontSize: '0.875rem' }}
                    >
                        {[5, 10, 25, 50, 100].map(size => (
                            <MenuItem key={size} value={size}>
                                {size}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100, textAlign: 'center' }}>
                {startItem}–{endItem} of {total}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="First page">
                    <span>
                        <IconButton
                            onClick={() => onPageChange(0)}
                            disabled={isFirstPage}
                            aria-label="first page"
                            size="small"
                        >
                            <FirstPageIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title="Previous page">
                    <span>
                        <IconButton
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={isFirstPage}
                            aria-label="previous page"
                            size="small"
                        >
                            <PrevIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                <Typography variant="body2" sx={{ mx: 1, minWidth: 60, textAlign: 'center' }}>
                    Page {currentPage + 1} of {safeTotalPages}
                </Typography>

                <Tooltip title="Next page">
                    <span>
                        <IconButton
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={isLastPage}
                            aria-label="next page"
                            size="small"
                        >
                            <NextIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                <Tooltip title="Last page">
                    <span>
                        <IconButton
                            onClick={() => onPageChange(safeTotalPages - 1)}
                            disabled={isLastPage}
                            aria-label="last page"
                            size="small"
                        >
                            <LastPageIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>
        </Box>
    );
};

export default PaginationControls;
