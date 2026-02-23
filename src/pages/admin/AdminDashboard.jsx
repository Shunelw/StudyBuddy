import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { api } from '../../utils/api';
import {
  Users, BookOpen, TrendingUp, DollarSign,
  AlertCircle, CheckCircle, Activity
} from 'lucide-react';
import '../student/StudentDashboard.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeUsers: 0,
    revenue: 0,
    completionRate: 0,
  });
  const [usersByRole, setUsersByRole] = useState({ students: [], instructors: [], admins: [] });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statsRes, usersRes, reportsRes] = await Promise.all([
          api.admin.stats(),
          api.admin.users(),
          api.reports.list(),
        ]);
        if (!cancelled) {
          setStats(statsRes || {});
          setUsersByRole(usersRes || { students: [], instructors: [], admins: [] });
          setReports(Array.isArray(reportsRes) ? reportsRes : []);
        }
      } catch (_) {}
      finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const totalUsers = (usersByRole.students?.length || 0) + (usersByRole.instructors?.length || 0) + (usersByRole.admins?.length || 0);
  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  const systemStats = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers || totalUsers, color: 'primary' },
    { icon: BookOpen, label: 'Total Courses', value: stats.totalCourses ?? 0, color: 'success' },
    { icon: TrendingUp, label: 'Enrollments', value: stats.totalEnrollments ?? 0, color: 'warning' },
    { icon: DollarSign, label: 'Revenue', value: `$${((stats.revenue || 0) / 1000).toFixed(1)}k`, color: 'accent' },
  ];

  const userBreakdown = [
    { label: 'Students', count: usersByRole.students?.length ?? 0, color: 'var(--primary)' },
    { label: 'Instructors', count: usersByRole.instructors?.length ?? 0, color: 'var(--success)' },
    { label: 'Admins', count: usersByRole.admins?.length ?? 0, color: 'var(--warning)' },
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
              <span>{stats.activeUsers ?? 0} Active Users</span>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="stats-grid">
              {systemStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="stat-card animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
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
              <section className="section">
                <div className="section-title">
                  <h2>User Management</h2>
                  <Link to="/admin/users" className="view-all">Manage Users</Link>
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
                            width: `${totalUsers ? (item.count / totalUsers) * 100 : 0}%`,
                            background: item.color,
                          }}
                        />
                      </div>
                      <p className="breakdown-percentage">
                        {totalUsers ? Math.round((item.count / totalUsers) * 100) : 0}% of total users
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-title">
                  <h2>Reports & Complaints</h2>
                  <Link to="/admin/reports" className="view-all">View All</Link>
                </div>
                <div className="reports-list">
                  {reports.slice(0, 5).map((report) => (
                    <div key={report.id} className={`report-item ${report.status}`}>
                      <div className="report-icon">
                        {report.status === 'pending' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                      </div>
                      <div className="report-content">
                        <div className="report-header">
                          <h4>{report.subject}</h4>
                          <span className={`status-badge ${report.status}`}>{report.status}</span>
                        </div>
                        <p>{report.description}</p>
                        <div className="report-meta">
                          <span>Reported by: {report.userName}</span>
                          <span>{report.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="section">
                <div className="section-title">
                  <h2>Platform Health</h2>
                </div>
                <div className="health-grid">
                  <div className="health-card">
                    <div className="health-header">
                      <h3>Completion Rate</h3>
                      <span className="health-value">{stats.completionRate ?? 0}%</span>
                    </div>
                    <div className="health-bar">
                      <div className="health-fill" style={{ width: `${stats.completionRate ?? 0}%` }} />
                    </div>
                    <p>Students completing enrolled courses</p>
                  </div>
                  <div className="health-card">
                    <div className="health-header">
                      <h3>Active Users</h3>
                      <span className="health-value">
                        {stats.totalUsers ? Math.round(((stats.activeUsers || 0) / stats.totalUsers) * 100) : 0}%
                      </span>
                    </div>
                    <div className="health-bar">
                      <div
                        className="health-fill"
                        style={{
                          width: `${stats.totalUsers ? ((stats.activeUsers || 0) / stats.totalUsers) * 100 : 0}%`,
                        }}
                      />
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
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
