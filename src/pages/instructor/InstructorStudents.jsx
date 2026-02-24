import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { api } from '../../utils/api';
import { Users, BookOpen, CheckCircle, Mail, Search } from 'lucide-react';
import './InstructorStudents.css';

const InstructorStudents = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterCourse, setFilterCourse] = useState('All');

    useEffect(() => {
        if (!user?.id) { setLoading(false); return; }
        api.instructor.students(user.id)
            .then((data) => setStudents(Array.isArray(data) ? data : []))
            .catch(() => setStudents([]))
            .finally(() => setLoading(false));
    }, [user?.id]);

    // All unique courses across all students for filter dropdown
    const allCourses = [...new Map(
        students.flatMap((s) => s.enrolledCourses || []).map((c) => [c.id, c])
    ).values()];

    const filtered = students.filter((s) => {
        const matchesSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.email.toLowerCase().includes(search.toLowerCase());
        const matchesCourse =
            filterCourse === 'All' ||
            (s.enrolledCourses || []).some((c) => String(c.id) === filterCourse);
        return matchesSearch && matchesCourse;
    });

    return (
        <div className="instructor-students-page">
            <div className="container">
                <div className="students-header animate-fade-in">
                    <div>
                        <h1>My Students</h1>
                        <p>Students enrolled in your courses</p>
                    </div>
                    <div className="students-summary">
                        <span className="summary-badge">
                            <Users size={16} />
                            {students.length} Total Students
                        </span>
                    </div>
                </div>

                {/* Filters */}
                <div className="students-filters animate-fade-in">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or email…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="course-filter"
                        value={filterCourse}
                        onChange={(e) => setFilterCourse(e.target.value)}
                    >
                        <option value="All">All Courses</option>
                        {allCourses.map((c) => (
                            <option key={c.id} value={String(c.id)}>{c.title}</option>
                        ))}
                    </select>
                </div>

                {loading ? (
                    <div className="loading-state">Loading students…</div>
                ) : filtered.length === 0 ? (
                    <div className="empty-students">
                        <Users size={56} />
                        <h3>{students.length === 0 ? 'No students yet' : 'No results found'}</h3>
                        <p>{students.length === 0 ? 'Students will appear here once they enroll in your courses.' : 'Try a different search or filter.'}</p>
                    </div>
                ) : (
                    <div className="students-grid animate-fade-in">
                        {filtered.map((student, i) => (
                            <div
                                key={student.id}
                                className="student-card animate-slide-in-left"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="student-card-header">
                                    <div className="student-avatar-lg">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="student-meta">
                                        <h3>{student.name}</h3>
                                        <div className="student-email">
                                            <Mail size={14} />
                                            {student.email}
                                        </div>
                                    </div>
                                </div>

                                <div className="student-stats-row">
                                    <div className="student-stat">
                                        <BookOpen size={15} />
                                        <span>{(student.enrolledCourses || []).length} course{(student.enrolledCourses || []).length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="student-stat">
                                        <CheckCircle size={15} />
                                        <span>{student.completedLessons} lessons done</span>
                                    </div>
                                </div>

                                <div className="enrolled-courses-list">
                                    <p className="enrolled-label">Enrolled in:</p>
                                    {(student.enrolledCourses || []).map((course) => (
                                        <span key={course.id} className="course-tag">
                                            {course.title}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorStudents;
