import React, { useState, useEffect } from 'react';
import { apiGetCourses, apiUpdateCourse, apiDeleteCourse, apiGetCourseStudents } from '../../utils/api';
import { Edit3, Trash2, X, Check, ChevronDown, ChevronUp, Users } from 'lucide-react';
import './AdminCourses.css';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [expandedId, setExpandedId] = useState(null);
    const [enrolledStudents, setEnrolledStudents] = useState({}); // courseId → students[]
    const [studentsLoading, setStudentsLoading] = useState({});

    const fetchCourses = async () => {
        try {
            const data = await apiGetCourses();
            setCourses(data);
        } catch (err) {
            console.error('Failed to load courses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleEdit = (course) => {
        setEditingId(course.id);
        setEditForm({
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
            price: course.price,
        });
    };

    const handleSaveEdit = async (courseId) => {
        try {
            await apiUpdateCourse(courseId, editForm);
            setEditingId(null);
            fetchCourses(); // refresh list
        } catch (err) {
            console.error('Failed to update course:', err);
        }
    };

    const handleDelete = async (courseId, courseTitle) => {
        if (!window.confirm(`Are you sure you want to delete "${courseTitle}"? This will also remove all lessons, quizzes, and enrollments.`)) {
            return;
        }
        try {
            await apiDeleteCourse(courseId);
            setCourses(courses.filter(c => c.id !== courseId));
            // Clean up expanded state
            if (expandedId === courseId) setExpandedId(null);
        } catch (err) {
            console.error('Failed to delete course:', err);
        }
    };

    const toggleStudents = async (courseId) => {
        if (expandedId === courseId) {
            setExpandedId(null);
            return;
        }
        setExpandedId(courseId);
        if (!enrolledStudents[courseId]) {
            setStudentsLoading(prev => ({ ...prev, [courseId]: true }));
            try {
                const students = await apiGetCourseStudents(courseId);
                setEnrolledStudents(prev => ({ ...prev, [courseId]: students }));
            } catch (err) {
                console.error('Failed to load enrolled students:', err);
            } finally {
                setStudentsLoading(prev => ({ ...prev, [courseId]: false }));
            }
        }
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="container"><p>Loading...</p></div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>All Courses ({courses.length})</h1>
                </div>

                <div className="admin-grid">
                    {courses.map(course => (
                        <div key={course.id} className="admin-course-card">
                            {editingId === course.id ? (
                                /* ---- EDIT MODE ---- */
                                <div className="edit-form">
                                    <div className="form-group">
                                        <label>Title</label>
                                        <input
                                            value={editForm.title}
                                            onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea
                                            rows={3}
                                            value={editForm.description}
                                            onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-row-2">
                                        <div className="form-group">
                                            <label>Category</label>
                                            <input
                                                value={editForm.category}
                                                onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Level</label>
                                            <select
                                                value={editForm.level}
                                                onChange={e => setEditForm({ ...editForm, level: e.target.value })}
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Price ($)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={editForm.price}
                                            onChange={e => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <div className="admin-actions">
                                        <button onClick={() => handleSaveEdit(course.id)} className="save-btn">
                                            <Check size={16} /> Save
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="cancel-btn">
                                            <X size={16} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* ---- VIEW MODE ---- */
                                <>
                                    <img src={course.image} alt={course.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }} />
                                    <h3>{course.title}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                        by {course.instructor}
                                    </p>
                                    <p>{course.category} · {course.level}</p>
                                    <p>{course.students} student{course.students !== 1 ? 's' : ''} enrolled</p>

                                    <div className="admin-actions">
                                        <button onClick={() => handleEdit(course)}>
                                            <Edit3 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course.id, course.title)}
                                            className="delete-btn"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>

                                    {/* Enrolled Students Toggle */}
                                    <button
                                        className="enrolled-toggle-btn"
                                        onClick={() => toggleStudents(course.id)}
                                    >
                                        <Users size={14} />
                                        {expandedId === course.id ? 'Hide' : 'View'} Enrolled Students
                                        {expandedId === course.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>

                                    {expandedId === course.id && (
                                        <div className="enrolled-students-panel">
                                            {studentsLoading[course.id] ? (
                                                <p className="enrolled-loading">Loading students...</p>
                                            ) : enrolledStudents[course.id]?.length > 0 ? (
                                                <ul className="enrolled-list">
                                                    {enrolledStudents[course.id].map(s => (
                                                        <li key={s.id} className="enrolled-item">
                                                            <div className="enrolled-avatar">{s.name.charAt(0).toUpperCase()}</div>
                                                            <div>
                                                                <p className="enrolled-name">{s.name}</p>
                                                                <p className="enrolled-email">{s.email}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="enrolled-empty">No students enrolled yet.</p>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;