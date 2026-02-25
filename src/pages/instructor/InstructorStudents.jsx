import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { apiGetCourses, apiGetCourseStudents } from '../../utils/api';
import { Users, BookOpen } from 'lucide-react';
import './InstructorStudents.css';

const InstructorStudents = () => {
    const { user } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                // 1. Get all courses for this instructor
                const courses = await apiGetCourses(user.id);
                const courseMap = {};
                courses.forEach(c => { courseMap[c.id] = c.title; });

                // 2. For each course, fetch enrolled students
                const studentMap = {}; // keyed by student id to deduplicate

                for (const course of courses) {
                    const enrolled = await apiGetCourseStudents(course.id);
                    for (const s of enrolled) {
                        if (!studentMap[s.id]) {
                            studentMap[s.id] = {
                                ...s,
                                myCourses: [], // courses from THIS instructor
                            };
                        }
                        studentMap[s.id].myCourses.push(courseMap[course.id]);
                    }
                }

                setStudents(Object.values(studentMap));
            } catch (err) {
                console.error('Failed to load students:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [user.id]);

    if (loading) {
        return (
            <div className="instructor-students-page">
                <div className="container"><p>Loading...</p></div>
            </div>
        );
    }

    return (
        <div className="instructor-students-page">
            <div className="container">
                <div className="page-header animate-fade-in">
                    <div>
                        <h1>My Students</h1>
                        <p>All students enrolled in your courses</p>
                    </div>
                    <div className="stats-badge">
                        <Users size={20} />
                        <span>{students.length} student{students.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                {students.length === 0 ? (
                    <div className="empty-state">
                        <Users size={48} />
                        <h3>No students yet</h3>
                        <p>Students will appear here once they enroll in your courses</p>
                    </div>
                ) : (
                    <div className="students-grid">
                        {students.map((student) => {
                            return (
                                <div key={student.id} className="student-card animate-fade-in">
                                    <div className="student-avatar-large">
                                        {student.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="student-card-info">
                                        <h3>{student.name}</h3>
                                        <p className="student-email">{student.email}</p>

                                        <div className="student-meta">
                                            <div className="meta-item">
                                                <BookOpen size={16} />
                                                <span>{student.myCourses.length} course{student.myCourses.length !== 1 ? 's' : ''} enrolled</span>
                                            </div>
                                        </div>

                                        <div className="enrolled-courses">
                                            {student.myCourses.map((title, i) => (
                                                <span key={i} className="course-tag">{title}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructorStudents;
