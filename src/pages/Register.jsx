import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { BookOpen, Mail, Lock, User, AlertCircle } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const userData = {
            name: formData.name,
            email: formData.email,
            password: formData.password
        };

        const success = await register(userData, formData.role);

        if (success) {
            const dashboardRoutes = {
                student: '/student/dashboard',
                instructor: '/instructor/dashboard',
                admin: '/admin/dashboard'
            };
            navigate(dashboardRoutes[formData.role]);
        } else {
            setError('Registration failed. Email may already be in use.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container animate-scale-in">
                <div className="auth-header">
                    <Link to="/" className="auth-brand">
                        <BookOpen size={40} />
                        <h2>StudyBuddy</h2>
                    </Link>
                    <h1>Create Account</h1>
                    <p>Join thousands of learners today</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Register as</label>
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'student' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                            >
                                Student
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'instructor' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'instructor' })}
                            >
                                Instructor
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                            <User size={20} />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <Mail size={20} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} />
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        Create Account
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;