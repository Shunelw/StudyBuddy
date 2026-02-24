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

    useEffect(() => {
        const storedUser = localStorage.getItem('studybuddy_user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email, password, role) => {
        try {
            const userData = await apiLogin(email, password, role);
            const userWithRole = { ...userData, role };
            setUser(userWithRole);
            setIsAuthenticated(true);
            localStorage.setItem('studybuddy_user', JSON.stringify(userWithRole));
            return true;
        } catch (error) {
            console.error('Login failed:', error.message);
            return false;
        }
    };

    const register = async (userData, role) => {
        try {
            const newUser = await apiRegister(userData.name, userData.email, userData.password, role);
            const userWithRole = { ...newUser, role };
            setUser(userWithRole);
            setIsAuthenticated(true);
            localStorage.setItem('studybuddy_user', JSON.stringify(userWithRole));
            return true;
        } catch (error) {
            console.error('Registration failed:', error.message);
            return false;
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
        updateUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};