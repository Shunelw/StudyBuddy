import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiGetReports, apiResolveReport } from '../../utils/api';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './AdminReports.css';

const AdminReports = () => {
    const [params] = useSearchParams();
    const statusFilter = params.get('status');
    const [allReports, setAllReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await apiGetReports();
                setAllReports(data);
            } catch (err) {
                console.error('Failed to load reports:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    const reports = statusFilter
        ? allReports.filter(r => r.status === statusFilter)
        : allReports;

    const handleResolve = async (reportId) => {
        try {
            await apiResolveReport(reportId);
            setAllReports(prev =>
                prev.map(r => r.id === reportId ? { ...r, status: 'resolved' } : r)
            );
        } catch (err) {
            console.error('Failed to resolve report:', err);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="container"><p>Loading...</p></div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="admin-header">
                    <h1>Reports &amp; Complaints</h1>
                </div>

                <div className="reports-list">
                    {reports.map(report => (
                        <div key={report.id} className={`report-item ${report.status}`}>
                            <div className="report-icon">
                                {report.status === 'pending'
                                    ? <AlertCircle size={24} />
                                    : <CheckCircle size={24} />}
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
                                    <span>{report.userName}</span>
                                    <span>{new Date(report.date).toLocaleDateString()}</span>
                                </div>
                                {report.status === 'pending' && (
                                    <button
                                        className="btn btn-primary btn-sm"
                                        style={{ marginTop: '0.75rem' }}
                                        onClick={() => handleResolve(report.id)}
                                    >
                                        <CheckCircle size={16} />
                                        Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {reports.length === 0 && <p>No reports found</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminReports;