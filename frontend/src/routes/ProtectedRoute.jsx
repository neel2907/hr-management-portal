import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Or a proper spinner placeholder
    }

    // If not authenticated, redirect to /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If role mismatch, redirect appropriately (to default dashboard)
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
