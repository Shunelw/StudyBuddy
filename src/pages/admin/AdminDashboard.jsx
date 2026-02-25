import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { apiGetStats, apiGetReports } from '../../utils/api';
import {
    Users, BookOpen, TrendingUp, DollarSign,
    AlertCircle, CheckCircle, Activity
} from 'lucide-react';
import '../student/StudentDashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, reportsData] = await Promise.all([
                    apiGetStats(),
                    apiGetReports(),
                ]);
                setStats(statsData);
                setReports(reportsData);
            } catch (err) {
                console.error('Failed to load dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !stats) {
        return (
            <div className="dashboard-page">
                <div className="container"><p>Loading...</p></div>
            </div>
        );
    }

    const pendingReports = reports.filter(r => r.status === 'pending').length;

    const systemStats = [
        { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'primary' },
        { icon: BookOpen, label: 'Total Courses', value: stats.totalCourses, color: 'success' },
        { icon: TrendingUp, label: 'Enrollments', value: stats.totalEnrollments, color: 'warning' },
        { icon: DollarSign, label: 'Revenue', value: stats.revenue > 0 ? `$${stats.revenue.toLocaleString()}` : '$0', color: 'accent' },
    ];

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header animate-fade-in">
                    <div>
                        <h1>Admin Dashboard</h1>
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
                            </div>
                        );
                    })}
                </div>

                <div className="admin-content">
                    {/* Reports & Alerts */}
                    <section className="section">
                        <div className="section-title">
                            <h2>Reports &amp; Complaints</h2>
                            <Link to="/admin/reports" className="view-all">View All</Link>
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
                            {reports.length === 0 && <p>No reports yet</p>}
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
                                    <div className="health-fill" style={{ width: `${stats.completionRate}%` }}></div>
                                </div>
                                <p>Students completing enrolled courses</p>
                            </div>

                            <div className="health-card">
                                <div className="health-header">
                                    <h3>Active Users</h3>
                                    <span className="health-value">{stats.activeUsers} / {stats.totalUsers}</span>
                                </div>
                                <div className="health-bar">
                                    <div className="health-fill" style={{ width: `${stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}%` }}></div>
                                </div>
                                <p>Students &amp; instructors on the platform</p>
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