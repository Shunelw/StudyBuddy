import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { BookOpen, Mail, Lock, AlertCircle } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
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

        const success = await login(formData.email, formData.password, formData.role);

        if (success) {
            const dashboardRoutes = {
                student: '/student/dashboard',
                instructor: '/instructor/dashboard',
                admin: '/admin/dashboard'
            };
            navigate(dashboardRoutes[formData.role]);
        } else {
            setError('Invalid credentials. Please try again.');
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
                    <h1>Welcome Back</h1>
                    <p>Sign in to continue your learning journey</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Login as</label>
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
                            <button
                                type="button"
                                className={`role-btn ${formData.role === 'admin' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: 'admin' })}
                            >
                                Admin
                            </button>
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
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-block">
                        Sign In
                    </button>
                </form>

                <div className="auth-demo">
                    <p>Demo Credentials:</p>
                    <div className="demo-creds">
                        <div>
                            <strong>Student:</strong> john@example.com / student123
                        </div>
                        <div>
                            <strong>Instructor:</strong> jinchun@example.com / instructor123
                        </div>
                        <div>
                            <strong>Admin:</strong> admin@example.com / admin123
                        </div>
                    </div>
                </div>

                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register">Sign up here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;