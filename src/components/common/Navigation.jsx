import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { BookOpen, User, LogOut, Menu, X, Home, BookMarked, Award, MessageCircle, FileText } from 'lucide-react';
import './Navigation.css';

const Navigation = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'student':
                return '/student/dashboard';
            case 'instructor':
                return '/instructor/dashboard';
            case 'admin':
                return '/admin/dashboard';
            default:
                return '/';
        }
    };

    const getNavLinks = () => {
        if (!user) return [];

        switch (user.role) {
            case 'student':
                return [
                    { to: '/student/dashboard', label: 'Dashboard', icon: Home },
                    { to: '/student/courses', label: 'Browse Courses', icon: BookMarked },
                    { to: '/student/progress', label: 'My Progress', icon: Award },
                    { to: '/student/qa', label: 'Q&A', icon: MessageCircle },
                    { to: '/student/report', label: 'Report', icon: FileText }
                ];
            case 'instructor':
                return [
                    { to: '/instructor/dashboard', label: 'Dashboard', icon: Home },
                    { to: '/instructor/courses', label: 'My Courses', icon: BookMarked },
                    { to: '/instructor/students', label: 'Students', icon: User },
                    { to: '/instructor/qa', label: 'Q&A', icon: MessageCircle }
                ];
            case 'admin':
                return [
                    { to: '/admin/dashboard', label: 'Dashboard', icon: Home },
                    { to: '/admin/users', label: 'Users', icon: User },
                    { to: '/admin/courses', label: 'Courses', icon: BookMarked },
                    { to: '/admin/reports', label: 'Reports', icon: MessageCircle }
                ];
            default:
                return [];
        }
    };

    const navLinks = getNavLinks();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to={getDashboardLink()} className="navbar-brand">
                        <BookOpen className="brand-icon" />
                        <span className="brand-text">StudyBuddy</span>
                    </Link>

                    {/* Desktop Navigation */}
                    {isAuthenticated && (
                        <div className="navbar-links desktop-only">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link key={link.to} to={link.to} className="nav-link">
                                        <Icon size={18} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    <div className="navbar-actions">
                        {isAuthenticated ? (
                            <>
                                <div className="user-menu desktop-only">
                                    <div className="user-avatar">
                                        <User size={20} />
                                    </div>
                                    <div className="user-info">
                                        <span className="user-name">{user.name}</span>
                                        <span className="user-role">{user.role}</span>
                                    </div>
                                </div>
                                <button onClick={handleLogout} className="btn btn-outline btn-sm desktop-only">
                                    <LogOut size={16} />
                                    Logout
                                </button>

                                {/* Mobile Menu Button */}
                                <button
                                    className="mobile-menu-btn mobile-only"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                >
                                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-outline btn-sm desktop-only">
                                    Login
                                </Link>
                                <Link to="/register" className="btn btn-primary btn-sm desktop-only">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && isAuthenticated && (
                    <div className="mobile-menu animate-fade-in">
                        <div className="mobile-user-info">
                            <div className="user-avatar">
                                <User size={24} />
                            </div>
                            <div>
                                <div className="user-name">{user.name}</div>
                                <div className="user-role">{user.role}</div>
                            </div>
                        </div>

                        <div className="mobile-nav-links">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="mobile-nav-link"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Icon size={20} />
                                        <span>{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>

                        <button onClick={handleLogout} className="btn btn-outline mobile-logout-btn">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;