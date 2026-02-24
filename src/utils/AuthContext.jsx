import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers, mockCourses } from './mockData';

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
            const users = mockUsers[role + 's'] || [];
            const found = users.find(u => u.email === email && u.password === password);
            if (!found) return false;

            // Build enriched user object
            let userData = { ...found, role };

            // Students: attach course/lesson/quiz data
            if (role === 'student') {
                userData.enrolledCourses = found.enrolledCourses || [];
                userData.completedLessons = found.completedLessons || [];
                userData.quizScores = found.quizScores || [];
                userData.certificates = found.certificates || [];
            }

            // Instructors: attach course list
            if (role === 'instructor') {
                const instructorCourseIds = mockCourses
                    .filter(c => c.instructorId === found.id)
                    .map(c => c.id);
                userData.courses = instructorCourseIds;
            }

            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('studybuddy_user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Login failed:', error.message);
            return false;
        }
    };

    const register = async (userData, role) => {
        // Mock register - just create a simple user
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            role,
            enrolledCourses: [],
            completedLessons: [],
            quizScores: [],
            certificates: [],
            courses: [],
        };
        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('studybuddy_user', JSON.stringify(newUser));
        return true;
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