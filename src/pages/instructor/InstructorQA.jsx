import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { apiAnswerQuestion, apiGetCourses, apiGetQuestions } from '../../utils/api';
import './InstructorQA.css';

const InstructorQA = () => {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [activeId, setActiveId] = useState(null);
    const [answerText, setAnswerText] = useState('');
    const [loading, setLoading] = useState(true);

    const [searchParams] = useSearchParams();
    const focusedQuestionId = searchParams.get('questionId');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courses = await apiGetCourses(user.id);
                setMyCourses(courses);
                const allQuestions = await Promise.all(
                    courses.map(c => apiGetQuestions({ courseId: c.id }))
                );
                const flattened = allQuestions.flat();
                const deduped = Array.from(new Map(flattened.map(q => [q.id, q])).values());
                setQuestions(deduped);
            } catch (error) {
                console.error('Failed to load instructor Q&A:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    useEffect(() => {
        if (focusedQuestionId) {
            setActiveId(Number(focusedQuestionId));
        }
    }, [focusedQuestionId]);

    const pending = useMemo(
        () => questions.filter(q => q.status === 'pending'),
        [questions]
    );

    const submitAnswer = async (id) => {
        if (!answerText.trim()) return;
        try {
            await apiAnswerQuestion(id, answerText.trim());
            setQuestions(prev =>
                prev.map(q => (
                    q.id === id
                        ? { ...q, answer: answerText.trim(), status: 'answered' }
                        : q
                ))
            );
            setActiveId(null);
            setAnswerText('');
        } catch (error) {
            console.error('Failed to submit answer:', error);
            alert(`Failed to submit answer: ${error.message}`);
        }
    };

    if (loading) {
        return (
            <div className="qa-page">
                <p>Loading Q&A...</p>
            </div>
        );
    }

    return (
        <div className="qa-page">
            <h1>Student Questions</h1>
            <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
                {myCourses.length} course{myCourses.length !== 1 ? 's' : ''} managed
            </p>

            {pending.length === 0 && (
                <div className="qa-empty">No pending questions.</div>
            )}

            {pending.map(q => (
                <div key={q.id} className={`qa-card ${String(q.id) === focusedQuestionId ? 'highlight' : ''}`}>
                    <div className="qa-header">
                        <div>
                            <h3>{q.studentName}</h3>
                            <span className="qa-course">{q.courseName}</span>
                        </div>
                        <span className="qa-date">{new Date(q.date).toLocaleDateString()}</span>
                    </div>

                    <p className="qa-question">{q.question}</p>

                    {activeId === q.id && (
                        <div className="qa-answer-box">
                            <textarea
                                rows="3"
                                value={answerText}
                                onChange={(e) => setAnswerText(e.target.value)}
                                placeholder="Write a helpful answer..."
                            />

                            <div className="qa-actions">
                                <button className="btn btn-primary" disabled={!answerText.trim()} onClick={() => submitAnswer(q.id)}>
                                    Submit
                                </button>
                                <button
                                    className="btn btn-outline"
                                    onClick={() => {
                                        setActiveId(null);
                                        setAnswerText('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {activeId !== q.id && (
                        <button className="btn btn-outline" onClick={() => setActiveId(q.id)}>
                            Answer
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default InstructorQA;
