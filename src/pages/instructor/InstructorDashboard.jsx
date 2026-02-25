import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { mockCourses, mockQuestions, mockUsers } from '../../utils/mockData';
import { BookOpen, Users, MessageCircle, Award, Plus } from 'lucide-react';
import '../student/StudentDashboard.css';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
    const { user } = useAuth();

    // All courses taught by this instructor
    const instructorCourses = mockCourses.filter(c => c.instructorId === user.id);

    // All pending questions across instructor's courses
    const myCourseIds = instructorCourses.map(c => c.id);
    const pendingQuestions = mockQuestions.filter(
        q => q.status === 'pending' && myCourseIds.includes(q.courseId)
    );

    // Total real students enrolled across all instructor courses
    const totalStudents = mockUsers.students.filter(s =>
        s.enrolledCourses.some(cid => myCourseIds.includes(cid))
    ).length;

    // const avgRating = instructorCourses.length > 0
    //     ? (instructorCourses.reduce((acc, c) => acc + c.rating, 0) / instructorCourses.length).toFixed(1)
    //     : '0.0';

    const stats = [
        { icon: BookOpen, label: 'My Courses', value: instructorCourses.length, color: 'primary' },
        { icon: Users, label: 'Total Students', value: totalStudents, color: 'success' },
        { icon: MessageCircle, label: 'Pending Questions', value: pendingQuestions.length, color: 'warning' },
        // { icon: Award, label: 'Avg Rating', value: avgRating, color: 'accent' },
    ];

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

                        {instructorCourses.length > 0 ? (
                            <div className="courses-grid-instructor">
                                {instructorCourses.map((course, index) => {
                                    // Count real enrolled students for this course
                                    const enrolledCount = mockUsers.students.filter(s =>
                                        s.enrolledCourses.includes(course.id)
                                    ).length;

                                    return (
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
                                                        <span>{enrolledCount} student{enrolledCount !== 1 ? 's' : ''} enrolled</span>
                                                    </div>
                                                    {/* <div className="stat-item">
                                                        <Award size={16} />
                                                        <span>{course.rating} rating</span>
                                                    </div> */}
                                                    <div className="stat-item">
                                                        <BookOpen size={16} />
                                                        <span>{course.lessons.length} lessons</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
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
