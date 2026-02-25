import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister } from './api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('studybuddy_user');
        if (!storedUser) return;

        try {
            const userData = JSON.parse(storedUser);

            // Clear stale users from the previous mock-auth flow.
            if (!userData || typeof userData !== 'object' || 'password' in userData) {
                localStorage.removeItem('studybuddy_user');
                return;
            }

            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            localStorage.removeItem('studybuddy_user');
        }
    }, []);

    const login = async (email, password, role) => {
        try {
            setAuthError('');
            const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
            const userData = await apiLogin(normalizedEmail, password, role);

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('studybuddy_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Login failed:', error.message);
            if (error.message === 'Failed to fetch') {
                setAuthError('Cannot reach backend API. Start backend server on port 3001.');
            } else {
                setAuthError(error.message);
            }
            return null;
        }
    };

    const register = async (userData, role) => {
        try {
            setAuthError('');
            const normalizedName = typeof userData.name === 'string' ? userData.name.trim() : '';
            const normalizedEmail = typeof userData.email === 'string' ? userData.email.trim().toLowerCase() : '';
            const createdUser = await apiRegister(
                normalizedName,
                normalizedEmail,
                userData.password,
                role
            );
            setUser(createdUser);
            setIsAuthenticated(true);
            localStorage.setItem('studybuddy_user', JSON.stringify(createdUser));
            return createdUser;
        } catch (error) {
            console.error('Registration failed:', error.message);
            if (error.message === 'Failed to fetch') {
                setAuthError('Cannot reach backend API. Start backend server on port 3001.');
            } else {
                setAuthError(error.message);
            }
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('studybuddy_user');
    };

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('studybuddy_user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
        authError
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
