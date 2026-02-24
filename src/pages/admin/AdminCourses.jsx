import React, { useState } from 'react';
import { mockCourses } from '../../utils/mockData';
import './AdminCourses.css';

const AdminCourses = () => {
    const [courses] = useState(mockCourses);

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>All Courses ({courses.length})</h1>
                </div>

                <div className="admin-grid">
                    {courses.map(course => (
                        <div key={course.id} className="admin-course-card">
                            <img src={course.image} alt={course.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.75rem' }} />
                            <h3>{course.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                by {course.instructor}
                            </p>
                            <p>{course.category} · {course.level}</p>
                            <p>{course.students} students · ⭐ {course.rating}</p>

                            <div className="admin-actions">
                                <button onClick={() => console.log('Edit', course)}>Edit</button>
                                <button
                                    onClick={() => console.log('Delete', course)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminCourses;