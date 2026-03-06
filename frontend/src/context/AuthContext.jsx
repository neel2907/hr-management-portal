import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeJWT } from '../utils/jwtUtils';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkTokenExpiry = (token) => {
        const decoded = decodeJWT(token);
        if (!decoded || !decoded.exp) return true;

        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setRole(null);
            setIsLoading(false);
            return;
        }

        const decodedUser = decodeJWT(token);
        if (!decodedUser || checkTokenExpiry(token)) {
            logout();
        } else {
            setUser(decodedUser);
            setRole(decodedUser?.role || decodedUser?.authorities);
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        if (data.token) {
            const decodedUser = decodeJWT(data.token);
            setUser(decodedUser);
            setRole(decodedUser?.role || decodedUser?.authorities);
        }
        return data;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setRole(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, role, isAuthenticated, isLoading, loading: isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
