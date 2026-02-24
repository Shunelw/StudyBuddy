import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { mockQuestions } from '../../utils/mockData';
import './InstructorQA.css';

const InstructorQA = () => {
    const [questions, setQuestions] = useState(mockQuestions);
    const [activeId, setActiveId] = useState(null);
    const [answerText, setAnswerText] = useState('');

    const [searchParams] = useSearchParams();
    const focusedQuestionId = searchParams.get('questionId');

    // Auto-open answer box if coming from dashboard
    useEffect(() => {
        if (focusedQuestionId) {
            setActiveId(Number(focusedQuestionId));
        }
    }, [focusedQuestionId]);

    const submitAnswer = (id) => {
        setQuestions(prev =>
            prev.map(q =>
                q.id === id
                    ? { ...q, answer: answerText, status: 'answered' }
                    : q
            )
        );
        setActiveId(null);
        setAnswerText('');
    };

    const pending = questions.filter(q => q.status === 'pending');

    return (
        <div className="qa-page">
            <h1>Student Questions</h1>

            {pending.length === 0 && (
                <div className="qa-empty">No pending questions 🎉</div>
            )}

            {pending.map(q => (
                <div
                    key={q.id}
                    className={`qa-card ${String(q.id) === focusedQuestionId ? 'highlight' : ''
                        }`}
                >
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
                                placeholder="Write a helpful answer…"
                            />

                            <div className="qa-actions">
                                <button
                                    className="btn btn-primary"
                                    disabled={!answerText.trim()}
                                    onClick={() => submitAnswer(q.id)}
                                >
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
                        <button
                            className="btn btn-outline"
                            onClick={() => setActiveId(q.id)}
                        >
                            Answer
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default InstructorQA;