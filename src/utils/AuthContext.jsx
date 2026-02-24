import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function normalizeUser(apiUser) {
  if (!apiUser) return null;
  return {
    ...apiUser,
    id: apiUser.id != null ? String(apiUser.id) : apiUser._id,
  };
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('studybuddy_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (_) {
        localStorage.removeItem('studybuddy_user');
      }
    }
  }, []);

  const login = async (email, password, role) => {
    try {
      const { user: apiUser } = await api.auth.login(email, password, role);
      const userData = { ...normalizeUser(apiUser), role };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('studybuddy_user', JSON.stringify(userData));
      return true;
    } catch (err) {
      throw new Error(err.message || 'Login failed');
    }
  };

  const register = async (userData, role) => {
    try {
      const { name, email, password } = userData;
      const { user: apiUser } = await api.auth.register(name, email, password, role);
      const newUser = { ...normalizeUser(apiUser), role };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('studybuddy_user', JSON.stringify(newUser));
      return true;
    } catch (err) {
      throw new Error(err.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('studybuddy_user');
  };

  const updateUser = (updatedData) => {
    if (!user) return;
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
