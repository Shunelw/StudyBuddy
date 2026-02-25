import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { apiCreateReport, apiGetReports } from '../../utils/api';
import { AlertCircle, Send, CheckCircle } from 'lucide-react';
import './StudentReport.css';

const StudentReport = () => {
    const { user } = useAuth();

    const [form, setForm] = useState({
        subject: '',
        type: 'complaint',
        description: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [myReports, setMyReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const all = await apiGetReports();
                setMyReports(all.filter(r => r.userId === user.id));
            } catch (err) {
                console.error('Failed to load reports:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [user.id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.subject.trim() || !form.description.trim()) return;

        try {
            const newReport = await apiCreateReport(form.type, user.id, form.subject, form.description);
            // Build display-friendly report object
            const displayReport = {
                id: newReport.id,
                type: form.type,
                userId: user.id,
                userName: user.name,
                subject: form.subject,
                description: form.description,
                status: 'pending',
                date: new Date().toISOString(),
            };
            setMyReports(prev => [...prev, displayReport]);
            setForm({ subject: '', type: 'complaint', description: '' });
            setSubmitted(true);

            setTimeout(() => setSubmitted(false), 3000);
        } catch (err) {
            console.error('Failed to submit report:', err);
        }
    };

    return (
        <div className="student-report-page">
            <div className="container">
                <div className="report-header animate-fade-in">
                    <AlertCircle size={32} />
                    <div>
                        <h1>Report / Complaint</h1>
                        <p>Submit a concern or feedback to the admin team</p>
                    </div>
                </div>

                {submitted && (
                    <div className="success-banner animate-fade-in">
                        <CheckCircle size={20} />
                        Your report has been submitted. The admin team will review it.
                    </div>
                )}

                {/* Report Form */}
                <div className="report-form-card animate-fade-in">
                    <h2>Submit a Report</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row-2">
                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={form.type}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                >
                                    <option value="complaint">Complaint</option>
                                    <option value="bug">Bug Report</option>
                                    <option value="suggestion">Suggestion</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    placeholder="Brief summary of the issue"
                                    value={form.subject}
                                    onChange={e => setForm({ ...form, subject: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                rows={5}
                                placeholder="Describe your issue or feedback in detail..."
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            <Send size={16} />
                            Submit Report
                        </button>
                    </form>
                </div>

                {/* My Previous Reports */}
                {loading ? (
                    <p>Loading your reports...</p>
                ) : myReports.length > 0 && (
                    <div className="my-reports">
                        <h2>My Previous Reports</h2>
                        <div className="reports-list">
                            {myReports.map(r => (
                                <div key={r.id} className={`report-card ${r.status}`}>
                                    <div className="report-card-header">
                                        <div>
                                            <span className="report-type-badge">{r.type || 'report'}</span>
                                            <h4>{r.subject}</h4>
                                        </div>
                                        <span className={`status-badge ${r.status}`}>{r.status}</span>
                                    </div>
                                    <p>{r.description}</p>
                                    <span className="report-date">{new Date(r.date).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentReport;
