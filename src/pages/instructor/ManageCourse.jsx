import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { apiGetCourse, apiAddLesson, apiDeleteLesson, apiAddQuiz, apiDeleteQuiz } from '../../utils/api';
import './ManageCourse.css';

const ManageCourse = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [quizzes, setQuizzes] = useState([]);
    const [tab, setTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [lessonForm, setLessonForm] = useState({
        title: '',
        description: '',
        duration: '',
        videoUrl: ''
    });

    const [quizForm, setQuizForm] = useState({ title: '' });

    // Fetch course data from API
    const fetchCourse = async () => {
        try {
            const data = await apiGetCourse(courseId);
            setCourse(data);
            setLessons(data.lessons || []);
            setQuizzes(data.quizzes || []);
        } catch (err) {
            console.error('Failed to load course:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [courseId]);

    if (loading) return <div className="manage-course-page"><p>Loading...</p></div>;
    if (!course) return <div className="manage-course-page"><p>Course not found</p></div>;

    /* ---------------- LESSONS ---------------- */

    const addLesson = async () => {
        if (!lessonForm.title) return;
        setSaving(true);
        try {
            const newLesson = await apiAddLesson(courseId, lessonForm);
            setLessons([...lessons, newLesson]);
            setLessonForm({ title: '', description: '', duration: '', videoUrl: '' });
        } catch (err) {
            console.error('Failed to add lesson:', err);
        } finally {
            setSaving(false);
        }
    };

    const deleteLesson = async (id) => {
        setSaving(true);
        try {
            await apiDeleteLesson(courseId, id);
            setLessons(lessons.filter(l => l.id !== id));
        } catch (err) {
            console.error('Failed to delete lesson:', err);
        } finally {
            setSaving(false);
        }
    };

    /* ---------------- QUIZZES ---------------- */

    const addQuiz = async () => {
        if (!quizForm.title) return;
        setSaving(true);
        try {
            const newQuiz = await apiAddQuiz(courseId, { title: quizForm.title });
            setQuizzes([...quizzes, newQuiz]);
            setQuizForm({ title: '' });
        } catch (err) {
            console.error('Failed to add quiz:', err);
        } finally {
            setSaving(false);
        }
    };

    const deleteQuiz = async (id) => {
        setSaving(true);
        try {
            await apiDeleteQuiz(courseId, id);
            setQuizzes(quizzes.filter(q => q.id !== id));
        } catch (err) {
            console.error('Failed to delete quiz:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="manage-course-page">

            {/* 🔙 Back to Dashboard */}
            <button
                onClick={() => navigate('/instructor/dashboard')}
                className="back-btn"
            >
                <ArrowLeft size={20} />
                Back to Dashboard
            </button>

            <h1>{course.title}</h1>

            {/* Tabs */}
            <div className="manage-tabs">
                <button
                    className={tab === 'overview' ? 'active' : ''}
                    onClick={() => setTab('overview')}
                >
                    Overview
                </button>
                <button
                    className={tab === 'lessons' ? 'active' : ''}
                    onClick={() => setTab('lessons')}
                >
                    Lessons
                </button>
                <button
                    className={tab === 'quizzes' ? 'active' : ''}
                    onClick={() => setTab('quizzes')}
                >
                    Quizzes
                </button>
            </div>

            {/* ---------------- OVERVIEW ---------------- */}
            {tab === 'overview' && (
                <div className="card">
                    <p><strong>Category:</strong> {course.category}</p>
                    <p><strong>Students:</strong> {course.students}</p>
                    <p><strong>Rating:</strong> {course.rating}</p>
                </div>
            )}

            {/* ---------------- LESSONS ---------------- */}
            {tab === 'lessons' && (
                <>
                    <div className="form-card dashed">
                        <h2>Add New Lesson</h2>

                        <label>Lesson Title</label>
                        <input
                            value={lessonForm.title}
                            onChange={e =>
                                setLessonForm({ ...lessonForm, title: e.target.value })
                            }
                            placeholder="e.g. Introduction to HTML"
                        />

                        <label>Description</label>
                        <textarea
                            value={lessonForm.description}
                            onChange={e =>
                                setLessonForm({ ...lessonForm, description: e.target.value })
                            }
                        />

                        <div className="form-row">
                            <input
                                placeholder="Duration (e.g. 45 min)"
                                value={lessonForm.duration}
                                onChange={e =>
                                    setLessonForm({ ...lessonForm, duration: e.target.value })
                                }
                            />
                            <input
                                placeholder="Video URL (optional)"
                                value={lessonForm.videoUrl}
                                onChange={e =>
                                    setLessonForm({ ...lessonForm, videoUrl: e.target.value })
                                }
                            />
                        </div>

                        <button className="primary-btn" onClick={addLesson} disabled={saving}>
                            {saving ? 'Adding...' : '+ Add Lesson'}
                        </button>
                    </div>

                    <div className="list-card">
                        <h2>Lessons</h2>

                        {lessons.length === 0 && <p>No lessons yet</p>}

                        {lessons.map(l => (
                            <div key={l.id} className="list-item">
                                <div>
                                    <h4>{l.title}</h4>
                                    <p>{l.description}</p>
                                    <span>{l.duration}</span>
                                </div>
                                <button
                                    className="danger-btn"
                                    onClick={() => deleteLesson(l.id)}
                                    disabled={saving}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ---------------- QUIZZES ---------------- */}
            {tab === 'quizzes' && (
                <>
                    <div className="form-card dashed">
                        <h2>Add New Quiz</h2>

                        <input
                            placeholder="Quiz title"
                            value={quizForm.title}
                            onChange={e =>
                                setQuizForm({ title: e.target.value })
                            }
                        />

                        <button className="primary-btn" onClick={addQuiz} disabled={saving}>
                            {saving ? 'Adding...' : '+ Add Quiz'}
                        </button>
                    </div>

                    <div className="list-card">
                        <h2>Quizzes</h2>

                        {quizzes.length === 0 && <p>No quizzes yet</p>}

                        {quizzes.map(q => (
                            <div key={q.id} className="list-item">
                                <div>
                                    <h4>{q.title}</h4>
                                    <span>{q.questions?.length || 0} questions</span>
                                </div>
                                <button
                                    className="danger-btn"
                                    onClick={() => deleteQuiz(q.id)}
                                    disabled={saving}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ManageCourse;