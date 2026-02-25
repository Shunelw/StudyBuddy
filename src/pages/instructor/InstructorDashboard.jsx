import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { apiGetCourses, apiGetCourseStudents, apiGetQuestions } from '../../utils/api';
import { BookOpen, Users, MessageCircle, Plus } from 'lucide-react';
import '../student/StudentDashboard.css';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [totalStudents, setTotalStudents] = useState(0);
    const [pendingQuestions, setPendingQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await apiGetCourses(user.id);
                setCourses(data);

                // Fetch enrolled student count across all courses (deduplicated)
                const studentIdSet = new Set();
                for (const course of data) {
                    const students = await apiGetCourseStudents(course.id);
                    students.forEach(s => studentIdSet.add(s.id));
                }
                setTotalStudents(studentIdSet.size);

                const questionLists = await Promise.all(
                    data.map(course => apiGetQuestions({ courseId: course.id }))
                );
                const allQuestions = questionLists.flat();
                const uniqueQuestions = Array.from(new Map(allQuestions.map(q => [q.id, q])).values());
                setPendingQuestions(uniqueQuestions.filter(q => q.status === 'pending'));
            } catch (err) {
                console.error('Failed to load instructor courses:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [user.id]);

    const stats = [
        { icon: BookOpen, label: 'My Courses', value: courses.length, color: 'primary' },
        { icon: Users, label: 'Total Students', value: totalStudents, color: 'success' },
        { icon: MessageCircle, label: 'Pending Questions', value: pendingQuestions.length, color: 'warning' },
    ];

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
                <div className="dashboard-header animate-fade-in">
                    <div>
                        <h1>Welcome, {user.name}!</h1>
                        <p>Manage your courses and help your students succeed</p>
                    </div>
                    <Link to="/instructor/create-course" className="btn btn-primary">
                        <Plus size={18} />
                        Create New Course
                    </Link>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="stat-card animate-slide-in-left"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className={`stat-icon stat-icon-${stat.color}`}>
                                    <Icon size={24} />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-value">{stat.value}</div>
                                    <div className="stat-label">{stat.label}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="dashboard-content">
                    {/* My Courses */}
                    <section className="section">
                        <div className="section-title">
                            <h2>My Courses</h2>
                            <Link to="/instructor/courses" className="view-all">View All</Link>
                        </div>

                        {courses.length > 0 ? (
                            <div className="courses-grid-instructor">
                                {courses.map((course, index) => (
                                    <div
                                        key={course.id}
                                        className="instructor-course-card animate-fade-in"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="course-thumbnail">
                                            <img src={course.image} alt={course.title} />
                                            <div className="course-overlay">
                                                <Link to={`/instructor/course/${course.id}`} className="btn btn-outline btn-sm">
                                                    Manage Course
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="course-info">
                                            <span className="course-category">{course.category}</span>
                                            <h3>{course.title}</h3>
                                            <div className="course-stats">
                                                <div className="stat-item">
                                                    <Users size={16} />
                                                    <span>{course.students} student{course.students !== 1 ? 's' : ''} enrolled</span>
                                                </div>
                                                <div className="stat-item">
                                                    <BookOpen size={16} />
                                                    <span>{course.lessons?.length || 0} lessons</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <BookOpen size={48} />
                                <h3>No courses yet</h3>
                                <p>Create your first course to start teaching</p>
                                <Link to="/instructor/create-course" className="btn btn-primary">
                                    <Plus size={18} />
                                    Create Course
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Student Questions */}
                    <section className="section">
                        <div className="section-title">
                            <h2>Student Questions</h2>
                            <Link to="/instructor/qa" className="view-all">View All</Link>
                        </div>

                        <div className="questions-list">
                            {pendingQuestions.slice(0, 5).map((q) => (
                                <div key={q.id} className="question-item">
                                    <div className="question-header">
                                        <div className="student-info">
                                            <div className="student-avatar">{q.studentName.charAt(0)}</div>
                                            <div>
                                                <h4>{q.studentName}</h4>
                                                <p className="course-name">{q.courseName}</p>
                                            </div>
                                        </div>
                                        <span className="question-date">{q.date}</span>
                                    </div>
                                    <p className="question-text">{q.question}</p>
                                    <div className="question-actions">
                                        <span className="status-badge pending">Pending</span>
                                        <Link
                                            to={`/instructor/qa?questionId=${q.id}`}
                                            className="btn btn-outline btn-sm"
                                        >
                                            <MessageCircle size={16} />
                                            Answer
                                        </Link>
                                    </div>
                                </div>
                            ))}

                            {pendingQuestions.length === 0 && (
                                <div className="empty-activity">
                                    <MessageCircle size={32} />
                                    <p>No pending questions</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;
