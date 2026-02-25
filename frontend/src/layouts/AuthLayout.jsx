import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

const AuthLayout = () => {
    return (
        <Container component="main" maxWidth="xs">
            {/* Simple centered wrapper layout */}
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* Render children inside centered container */}
                <Outlet />
            </Box>
        </Container>
    );
};

export default AuthLayout;
