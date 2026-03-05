import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// Lazy loading can be applied here for production
import Login from '../features/auth/Login';
import Register from '../features/auth/Register';
import AttendancePage from '../features/attendance/AttendancePage';
import LeavePage from '../features/leave/LeavePage';
import LeaveBalanceHistoryPage from '../features/leave/LeaveBalanceHistoryPage';
import PerformancePage from '../features/performance/PerformancePage';
import AdminDashboard from '../features/admin/AdminDashboard';
import AdminLeavePage from '../features/admin/AdminLeavePage';
import AdminAttendancePage from '../features/admin/AdminAttendancePage';
import AdminPerformancePage from '../features/admin/AdminPerformancePage';
import AdminAuditLogPage from '../features/admin/AdminAuditLogPage';
import EmployeeDashboard from '../features/dashboard/EmployeeDashboard';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Auth Routes */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Protected Dashboard Routes */}
                <Route element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
                >
                    {/* Default dashboard redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<EmployeeDashboard />} />

                    {/* Employee Feature Routes */}
                    <Route path="/attendance" element={<AttendancePage />} />
                    <Route path="/leave" element={<LeavePage />} />
                    <Route path="/leave/ledger" element={<LeaveBalanceHistoryPage />} />
                    <Route path="/performance" element={<PerformancePage />} />

                    {/* Admin Protected Routes */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/attendance"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminAttendancePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/leave"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminLeavePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/performance"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminPerformancePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/logs"
                        element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <AdminAuditLogPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                {/* Fallback Catch-All */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
