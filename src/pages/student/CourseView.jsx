import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { apiGetCourse, apiEnrollCourse, apiCompleteLesson } from '../../utils/api';
import {
    BookOpen, Play, Clock, Users, Star, CheckCircle,
    Lock, Award, ArrowLeft, Download
} from 'lucide-react';
import './CourseView.css';

const CourseView = () => {
    const { courseId } = useParams();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedLesson, setSelectedLesson] = useState(null);

    useEffect(() => {
        apiGetCourse(courseId).then(data => {
            setCourse(data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [courseId]);

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><h2>Loading...</h2></div>;
    }

    if (!course) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Course not found</h2>
                <button onClick={() => navigate('/student/courses')} className="btn btn-primary">
                    Browse Courses
                </button>
            </div>
        );
    }

    const isEnrolled = user.enrolledCourses?.includes(course.id);
    const completedLessonIds = user.completedLessons || [];
    const completedCount = course.lessons.filter(l => completedLessonIds.includes(l.id)).length;
    const totalLessons = course.lessons.length;
    const progress = {
        completed: completedCount,
        total: totalLessons,
        percentage: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0
    };

    const handleEnroll = async () => {
        if (course.price === 0 || window.confirm(`Enroll in "${course.title}" for $${course.price}?`)) {
            try {
                await apiEnrollCourse(course.id, user.id);
                const enrolledCourses = user.enrolledCourses || [];
                updateUser({ enrolledCourses: [...enrolledCourses, course.id] });
                alert('Successfully enrolled! You can now access all lessons.');
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleLessonClick = (lesson) => {
        if (!isEnrolled) {
            alert('Please enroll in this course to access lessons');
            return;
        }
        setSelectedLesson(lesson);
    };

    const handleCompleteLesson = async (lessonId) => {
        if (!completedLessonIds.includes(lessonId)) {
            try {
                await apiCompleteLesson(course.id, user.id, lessonId);
                updateUser({ completedLessons: [...completedLessonIds, lessonId] });
                alert('Lesson marked as complete!');
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleTakeQuiz = (quizId) => {
        navigate(`/student/quiz/${course.id}/${quizId}`);
    };

    return (
        <div className="course-view-page">
            <div className="container">
                {/* Back Button */}
                <button onClick={() => navigate('/student/dashboard')} className="back-btn"> {/* i fixed '/student/courses' to '/student/dashboard'*/}
                    <ArrowLeft size={20} />
                    Back to Courses
                </button>

                {/* Course Header */}
                <div className="course-header animate-fade-in">
                    <div className="course-header-content">
                        <div className="course-header-left">
                            <span className="course-category">{course.category}</span>
                            <h1>{course.title}</h1>
                            <p className="course-description">{course.description}</p>

                            <div className="course-meta">
                                <div className="meta-item">
                                    <Star size={18} fill="currentColor" />
                                    <span>{course.rating}</span>
                                </div>
                                <div className="meta-item">
                                    <Users size={18} />
                                    <span>{course.students} students</span>
                                </div>
                                <div className="meta-item">
                                    <Clock size={18} />
                                    <span>{course.duration}</span>
                                </div>
                                <div className="meta-item">
                                    <BookOpen size={18} />
                                    <span>{course.lessons.length} lessons</span>
                                </div>
                            </div>

                            <div className="course-instructor-info">
                                <div className="instructor-avatar">{course.instructor.charAt(0)}</div>
                                <div>
                                    <p className="instructor-label">Instructor</p>
                                    <p className="instructor-name">{course.instructor}</p>
                                </div>
                            </div>
                        </div>

                        <div className="course-header-right">
                            <div className="course-thumbnail">
                                <img src={course.image} alt={course.title} />
                            </div>

                            {!isEnrolled ? (
                                <div className="enroll-card">
                                    <div className="course-price">
                                        {course.price === 0 ? (
                                            <span className="free-price">FREE</span>
                                        ) : (
                                            <span className="paid-price">${course.price}</span>
                                        )}
                                    </div>
                                    <button onClick={handleEnroll} className="btn btn-primary btn-lg btn-block">
                                        Enroll Now
                                    </button>
                                    <div className="enroll-info">
                                        <CheckCircle size={16} />
                                        <span>Full lifetime access</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="progress-card">
                                    <h3>Your Progress</h3>
                                    <div className="circular-progress">
                                        <svg width="120" height="120">
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="50"
                                                fill="none"
                                                stroke="var(--border)"
                                                strokeWidth="8"
                                            />
                                            <circle
                                                cx="60"
                                                cy="60"
                                                r="50"
                                                fill="none"
                                                stroke="var(--primary)"
                                                strokeWidth="8"
                                                strokeDasharray={`${2 * Math.PI * 50}`}
                                                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress.percentage / 100)}`}
                                                strokeLinecap="round"
                                                transform="rotate(-90 60 60)"
                                            />
                                        </svg>
                                        <div className="progress-text">{progress.percentage}%</div>
                                    </div>
                                    <p>{progress.completed} of {progress.total} lessons completed</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="course-content">
                    <div className="content-sidebar">
                        <h2>Course Content</h2>

                        {/* Lessons */}
                        <div className="lessons-list">
                            {course.lessons.map((lesson, index) => {
                                const isCompleted = completedLessonIds.includes(lesson.id);
                                const isLocked = !isEnrolled;

                                return (
                                    <div
                                        key={lesson.id}
                                        className={`lesson-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${selectedLesson?.id === lesson.id ? 'active' : ''}`}
                                        onClick={() => handleLessonClick(lesson)}
                                    >
                                        <div className="lesson-number">{index + 1}</div>
                                        <div className="lesson-info">
                                            <h4>{lesson.title}</h4>
                                            <p>{lesson.description}</p>
                                            <div className="lesson-meta">
                                                <Clock size={14} />
                                                <span>{lesson.duration}</span>
                                            </div>
                                        </div>
                                        <div className="lesson-status">
                                            {isLocked ? (
                                                <Lock size={20} />
                                            ) : isCompleted ? (
                                                <CheckCircle size={20} className="completed-icon" />
                                            ) : (
                                                <Play size={20} />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quizzes */}
                        {course.quizzes && course.quizzes.length > 0 && (
                            <div className="quizzes-section">
                                <h3>Quizzes</h3>
                                {course.quizzes.map((quiz) => (
                                    <div
                                        key={quiz.id}
                                        className={`quiz-item ${!isEnrolled ? 'locked' : ''}`}
                                        onClick={() => isEnrolled && handleTakeQuiz(quiz.id)}
                                    >
                                        <Award size={24} />
                                        <div>
                                            <h4>{quiz.title}</h4>
                                            <p>{quiz.questions.length} questions</p>
                                        </div>
                                        {!isEnrolled && <Lock size={20} />}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Lesson Viewer */}
                    <div className="content-main">
                        {selectedLesson ? (
                            <div className="lesson-viewer animate-fade-in">
                                <h2>{selectedLesson.title}</h2>
                                <p className="lesson-description">{selectedLesson.description}</p>

                                <div className="video-player">
                                    <div className="video-placeholder">
                                        <Play size={64} />
                                        <p>Video Player</p>
                                        <small>In production, video would play here</small>
                                    </div>
                                </div>

                                <div className="lesson-content">
                                    <h3>Lesson Content</h3>
                                    <div className="content-text">
                                        {selectedLesson.content}
                                    </div>

                                    <div className="lesson-materials">
                                        <h4>Materials</h4>
                                        <button className="material-btn">
                                            <Download size={18} />
                                            Download Lesson Notes.pdf
                                        </button>
                                    </div>
                                </div>

                                <div className="lesson-actions">
                                    {!completedLessonIds.includes(selectedLesson.id) && (
                                        <button
                                            onClick={() => handleCompleteLesson(selectedLesson.id)}
                                            className="btn btn-primary"
                                        >
                                            <CheckCircle size={20} />
                                            Mark as Complete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="no-lesson-selected">
                                <BookOpen size={64} />
                                <h3>Select a lesson to start learning</h3>
                                <p>Choose a lesson from the sidebar to view its content</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseView;