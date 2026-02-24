import React, { useState, useEffect } from 'react';
import { apiGetCourses } from '../../utils/api';
import './AdminCourses.css';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        apiGetCourses().then(setCourses).catch(console.error);
    }, []);

    const handleEdit = (course) => {
        console.log('Edit course:', course);
    };

    const handleDelete = (course) => {
        console.log('Delete course:', course);
    };

    return (
        <div className="admin-page">
            <div className="container">
                <div className="admin-header">
                    <h1>All Courses</h1>
                </div>

                <div className="admin-grid">
                    {courses.map(course => (
                        <div key={course.id} className="admin-course-card">
                            <h3>{course.title}</h3>
                            <p>{course.category}</p>
                            <p>{course.students} students</p>

                            <div className="admin-actions">
                                <button onClick={() => handleEdit(course)}>
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(course)}
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