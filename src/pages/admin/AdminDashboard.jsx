import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { apiGetStats, apiGetReports, apiGetUsers } from '../../utils/api';
import {
    Users, BookOpen, TrendingUp, DollarSign,
    AlertCircle, CheckCircle, Activity, Award
} from 'lucide-react';
import '../student/StudentDashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalCourses: 0, totalEnrollments: 0, activeUsers: 0, revenue: 0, completionRate: 0 });
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        apiGetStats().then(setStats).catch(console.error);
        apiGetReports().then(setReports).catch(console.error);
        apiGetUsers().then(setUsers).catch(console.error);
    }, []);

    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const totalUsers = users.length || stats.totalUsers;

    const userBreakdown = [
        { label: 'Students', count: users.filter(u => u.role === 'student').length, color: 'var(--primary)' },
        { label: 'Instructors', count: users.filter(u => u.role === 'instructor').length, color: 'var(--success)' },
        { label: 'Admins', count: users.filter(u => u.role === 'admin').length, color: 'var(--warning)' }
    ];

    const systemStats = [
        {
            icon: Users,
            label: 'Total Users',
            value: stats.totalUsers,
            color: 'primary'
        },
        {
            icon: BookOpen,
            label: 'Total Courses',
            value: stats.totalCourses,
            color: 'success'
        },
        {
            icon: TrendingUp,
            label: 'Enrollments',
            value: stats.totalEnrollments,
            color: 'warning'
        },
        {
            icon: DollarSign,
            label: 'Revenue',
            value: `$${(stats.revenue / 1000).toFixed(1)}k`,
            color: 'accent'
        }
    ];

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header animate-fade-in">
                    <div>
                        <h1>Admin Dashboard </h1>
                        <p>Monitor and manage your entire platform</p>
                    </div>
                    <div className="header-badges">
                        <div className="badge-item">
                            <Activity size={18} />
                            <span>{stats.activeUsers} Active Users</span>
                        </div>
                    </div>
                </div>

                {/* System Stats */}
                <div className="stats-grid">
                    {systemStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="stat-card animate-slide-in-left"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`stat-icon stat-icon-${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                                <div className="stat-change positive">{stat.change}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="admin-content">
                    {/* User Management Overview */}
                    <section className="section">
                        <div className="section-title">
                            <h2>User Management</h2>
                            <a href="/admin/users" className="view-all">Manage Users</a>
                        </div>

                        <div className="user-breakdown">
                            {userBreakdown.map((item, index) => (
                                <div key={index} className="breakdown-card">
                                    <div className="breakdown-header">
                                        <h3>{item.label}</h3>
                                        <span className="breakdown-count">{item.count}</span>
                                    </div>
                                    <div className="breakdown-bar">
                                        <div
                                            className="breakdown-fill"
                                            style={{
                                                width: `${totalUsers > 0 ? (item.count / totalUsers) * 100 : 0}%`,
                                                background: item.color
                                            }}
                                        ></div>
                                    </div>
                                    <p className="breakdown-percentage">
                                        {totalUsers > 0 ? Math.round((item.count / totalUsers) * 100) : 0}% of total users
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reports & Alerts */}
                    <section className="section">
                        <div className="section-title">
                            <h2>Reports & Complaints</h2>
                            <Link to="/admin/reports" className="view-all">
                                View All
                            </Link>
                        </div>

                        <div className="reports-list">
                            {reports.slice(0, 5).map((report) => (
                                <div key={report.id} className={`report-item ${report.status}`}>
                                    <div className="report-icon">
                                        {report.status === 'pending' ? (
                                            <AlertCircle size={24} />
                                        ) : (
                                            <CheckCircle size={24} />
                                        )}
                                    </div>
                                    <div className="report-content">
                                        <div className="report-header">
                                            <h4>{report.subject}</h4>
                                            <span className={`status-badge ${report.status}`}>
                                                {report.status}
                                            </span>
                                        </div>
                                        <p>{report.description}</p>
                                        <div className="report-meta">
                                            <span>Reported by: {report.userName}</span>
                                            <span>{new Date(report.date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Platform Health */}
                    <section className="section">
                        <div className="section-title">
                            <h2>Platform Health</h2>
                        </div>

                        <div className="health-grid">
                            <div className="health-card">
                                <div className="health-header">
                                    <h3>Completion Rate</h3>
                                    <span className="health-value">{stats.completionRate}%</span>
                                </div>
                                <div className="health-bar">
                                    <div
                                        className="health-fill"
                                        style={{ width: `${stats.completionRate}%` }}
                                    ></div>
                                </div>
                                <p>Students completing enrolled courses</p>
                            </div>

                            <div className="health-card">
                                <div className="health-header">
                                    <h3>Active Users</h3>
                                    <span className="health-value">{stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%</span>
                                </div>
                                <div className="health-bar">
                                    <div
                                        className="health-fill"
                                        style={{ width: `${stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0}%` }}
                                    ></div>
                                </div>
                                <p>Users active in last 30 days</p>
                            </div>

                            <div className="health-card">
                                <div className="health-header">
                                    <h3>Pending Reports</h3>
                                    <span className="health-value">{pendingReports}</span>
                                </div>
                                <p>Issues awaiting resolution</p>
                                {pendingReports > 0 && (
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => navigate('/admin/reports?status=pending')}
                                    >
                                        <AlertCircle size={16} />
                                        Review Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;