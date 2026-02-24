import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import './AdminCourses.css';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    api.courses
      .list()
      .then((list) => setCourses(Array.isArray(list) ? list : []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (course) => {
    alert(`Edit functionality for "${course.title}" is managed by the course instructor.`);
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setDeletingId(course.id);
    try {
      await api.courses.delete(course.id);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    } catch (e) {
      alert(e.message || 'Failed to delete course');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>All Courses</h1>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="admin-grid">
            {courses.map((course) => (
              <div key={course.id} className="admin-course-card">
                <h3>{course.title}</h3>
                <p>{course.category}</p>
                <p>{course.students ?? 0} students</p>
                <div className="admin-actions">
                  <button onClick={() => handleEdit(course)}>Edit</button>
                  <button
                    onClick={() => handleDelete(course)}
                    className="delete-btn"
                    disabled={deletingId === course.id}
                  >
                    {deletingId === course.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCourses;
