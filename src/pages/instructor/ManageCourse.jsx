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

    const blankQuestion = () => ({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
    });

    const [quizForm, setQuizForm] = useState({
        title: '',
        questions: [blankQuestion()],
    });

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
        if (!quizForm.title.trim()) return;
        const hasInvalidQuestion = quizForm.questions.some(
            q => !q.question.trim() || q.options.some(opt => !opt.trim())
        );
        if (hasInvalidQuestion) {
            alert('Each question needs text and all 4 choices filled in.');
            return;
        }

        setSaving(true);
        try {
            const newQuiz = await apiAddQuiz(courseId, {
                title: quizForm.title.trim(),
                questions: quizForm.questions.map(q => ({
                    question: q.question.trim(),
                    options: q.options.map(opt => opt.trim()),
                    correctAnswer: q.correctAnswer,
                })),
            });
            setQuizzes([...quizzes, newQuiz]);
            setQuizForm({ title: '', questions: [blankQuestion()] });
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

    const updateQuizQuestion = (index, question) => {
        const next = [...quizForm.questions];
        next[index] = { ...next[index], question };
        setQuizForm({ ...quizForm, questions: next });
    };

    const updateQuizOption = (qIndex, optionIndex, optionValue) => {
        const next = [...quizForm.questions];
        const nextOptions = [...next[qIndex].options];
        nextOptions[optionIndex] = optionValue;
        next[qIndex] = { ...next[qIndex], options: nextOptions };
        setQuizForm({ ...quizForm, questions: next });
    };

    const setCorrectAnswer = (qIndex, optionIndex) => {
        const next = [...quizForm.questions];
        next[qIndex] = { ...next[qIndex], correctAnswer: optionIndex };
        setQuizForm({ ...quizForm, questions: next });
    };

    const addQuestion = () => {
        setQuizForm({
            ...quizForm,
            questions: [...quizForm.questions, blankQuestion()],
        });
    };

    const removeQuestion = (index) => {
        if (quizForm.questions.length === 1) return;
        const next = quizForm.questions.filter((_, i) => i !== index);
        setQuizForm({ ...quizForm, questions: next });
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

                        <label>Quiz Title</label>
                        <input
                            placeholder="Quiz title"
                            value={quizForm.title}
                            onChange={e =>
                                setQuizForm({ ...quizForm, title: e.target.value })
                            }
                        />

                        <div className="quiz-questions-builder">
                            {quizForm.questions.map((question, qIndex) => (
                                <div className="quiz-question-card" key={qIndex}>
                                    <div className="quiz-question-header">
                                        <h4>Question {qIndex + 1}</h4>
                                        {quizForm.questions.length > 1 && (
                                            <button
                                                type="button"
                                                className="danger-btn"
                                                onClick={() => removeQuestion(qIndex)}
                                                disabled={saving}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <label>Question</label>
                                    <input
                                        placeholder="Enter question text"
                                        value={question.question}
                                        onChange={(e) => updateQuizQuestion(qIndex, e.target.value)}
                                    />

                                    <label>Choices</label>
                                    <div className="quiz-options-grid">
                                        {question.options.map((opt, optIndex) => (
                                            <div key={optIndex} className="quiz-option-row">
                                                <input
                                                    placeholder={`Choice ${optIndex + 1}`}
                                                    value={opt}
                                                    onChange={(e) => updateQuizOption(qIndex, optIndex, e.target.value)}
                                                />
                                                <label className="correct-choice-label">
                                                    <input
                                                        type="radio"
                                                        name={`correct-${qIndex}`}
                                                        checked={question.correctAnswer === optIndex}
                                                        onChange={() => setCorrectAnswer(qIndex, optIndex)}
                                                    />
                                                    Correct
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="primary-btn" type="button" onClick={addQuestion} disabled={saving}>
                            + Add Question
                        </button>

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
                                    {(q.questions || []).map((question, qIndex) => (
                                        <div key={question.id || `${q.id}-q-${qIndex}`} className="quiz-question-preview">
                                            <p><strong>Q{qIndex + 1}:</strong> {question.question}</p>
                                            <ul>
                                                {(question.options || []).map((choice, cIndex) => (
                                                    <li key={`${q.id}-q-${qIndex}-c-${cIndex}`}>
                                                        {choice}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
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
