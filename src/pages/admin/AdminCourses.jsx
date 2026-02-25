import React, { useState, useEffect } from 'react';
import { apiGetCourses, apiUpdateCourse, apiDeleteCourse } from '../../utils/api';
import { Edit3, Trash2, X, Check } from 'lucide-react';
import './AdminCourses.css';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

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
        } catch (err) {
            console.error('Failed to delete course:', err);
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
                                    <p>{course.students} students</p>

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