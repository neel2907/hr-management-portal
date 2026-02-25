import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeJWT } from '../utils/jwtUtils';

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
        if (token) {
            if (checkTokenExpiry(token)) {
                logout();
            } else {
                const decodedUser = decodeJWT(token);
                setUser(decodedUser);
                setRole(decodedUser?.role);
            }
        }
        setIsLoading(false);
    }, []);

    const login = (token) => {
        if (checkTokenExpiry(token)) {
            console.error("Attempted to login with an expired token");
            return;
        }
        localStorage.setItem('token', token);
        const decodedUser = decodeJWT(token);
        setUser(decodedUser);
        setRole(decodedUser?.role);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
    };

    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider value={{ user, role, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
