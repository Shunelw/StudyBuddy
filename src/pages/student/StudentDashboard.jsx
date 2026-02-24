import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { mockCourses } from '../../utils/mockData';
import { BookOpen, Award, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import './StudentDashboard.css';

const formatQuizDate = (date) => {
    return date ? String(date).replace('2024', '2026') : '';
};

const StudentDashboard = () => {
    const { user } = useAuth();

    const enrolledCourses = mockCourses.filter(c =>
        (user.enrolledCourses || []).includes(c.id)
    );

    const getStudentProgress = (courseId) => {
        const course = mockCourses.find(c => c.id === courseId);
        if (!course) return { completed: 0, total: 0, percentage: 0 };
        const completedLessons = course.lessons.filter(l =>
            (user.completedLessons || []).includes(l.id)
        ).length;
        const totalLessons = course.lessons.length;
        const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        return { completed: completedLessons, total: totalLessons, percentage };
    };

    const avgScore = user.quizScores?.length
        ? Math.round(user.quizScores.reduce((acc, q) => acc + q.score, 0) / user.quizScores.length)
        : 0;

    const stats = [
        { icon: BookOpen, label: 'Enrolled Courses', value: enrolledCourses.length, color: 'primary' },
        { icon: CheckCircle, label: 'Completed Lessons', value: user.completedLessons?.length || 0, color: 'success' },
        { icon: Award, label: 'Quizzes Taken', value: user.quizScores?.length || 0, color: 'secondary' },
        { icon: TrendingUp, label: 'Average Score', value: avgScore + '%', color: 'accent' },
    ];

    return (
        <div className="dashboard-page">
            <div className="container">
                <div className="dashboard-header animate-fade-in">
                    <div>
                        <h1>Welcome back, {user.name}!</h1>
                        <p>Continue your learning journey</p>
                    </div>
                    <Link to="/student/courses" className="btn btn-primary">
                        <BookOpen size={18} />
                        Browse Courses
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
                    <section className="section">
                        <div className="section-title">
                            <h2>Continue Learning</h2>
                            <Link to="/student/courses" className="view-all">View All Courses</Link>
                        </div>

                        {enrolledCourses.length > 0 ? (
                            <div className="courses-list">
                                {enrolledCourses.map((course, index) => {
                                    const progress = getStudentProgress(course.id);
                                    return (
                                        <div
                                            key={course.id}
                                            className="course-progress-card animate-fade-in"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className="course-progress-image">
                                                <img src={course.image} alt={course.title} />
                                            </div>
                                            <div className="course-progress-content">
                                                <div className="course-progress-header">
                                                    <div>
                                                        <span className="course-category">{course.category}</span>
                                                        <h3>{course.title}</h3>
                                                        <p className="course-instructor">by {course.instructor}</p>
                                                    </div>
                                                    <div className="progress-circle">
                                                        <span className="progress-text">{progress.percentage}%</span>
                                                    </div>
                                                </div>

                                                <div className="course-progress-bar">
                                                    <div className="progress-info">
                                                        <span>{progress.completed} of {progress.total} lessons completed</span>
                                                    </div>
                                                    <div className="progress-bar-track">
                                                        <div
                                                            className="progress-bar-fill"
                                                            style={{ width: `${progress.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <Link
                                                    to={`/student/course/${course.id}`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    <Clock size={16} />
                                                    Continue Learning
                                                </Link>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <BookOpen size={48} />
                                <h3>No courses enrolled yet</h3>
                                <p>Start your learning journey by enrolling in a course</p>
                                <Link to="/student/courses" className="btn btn-primary">
                                    Browse Courses
                                </Link>
                            </div>
                        )}
                    </section>

                    <section className="section">
                        <div className="section-title">
                            <h2>Recent Activity</h2>
                        </div>
                        <div className="activity-list">
                            {user.quizScores?.slice(0, 5).map((quiz, index) => (
                                <div key={index} className="activity-item">
                                    <div className="activity-icon">
                                        <Award size={20} />
                                    </div>
                                    <div className="activity-content">
                                        <p>Completed quiz with score: <strong>{quiz.score}%</strong></p>
                                        <span className="activity-date">{formatQuizDate(quiz.date)}</span>
                                    </div>
                                </div>
                            ))}
                            {(!user.quizScores || user.quizScores.length === 0) && (
                                <div className="empty-activity">
                                    <p>No recent activity</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;