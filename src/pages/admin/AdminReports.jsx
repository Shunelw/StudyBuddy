import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../utils/api';
import { AlertCircle, CheckCircle } from 'lucide-react';
import './AdminReports.css';

const AdminReports = () => {
  const [params] = useSearchParams();
  const statusFilter = params.get('status');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.reports
      .list(statusFilter || undefined)
      .then((list) => setReports(Array.isArray(list) ? list : []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="admin-header">
          <h1>Reports & Complaints</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="reports-list">
            {reports.map((report) => (
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
                    <span>{report.userName}</span>
                    <span>{report.date}</span>
                  </div>
                </div>
              </div>
            ))}
            {reports.length === 0 && <p>No reports found</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
