import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { apiAskQuestion, apiGetCourses, apiGetQuestions } from '../../utils/api';
import { MessageCircle, Send } from 'lucide-react';
import './StudentQA.css';

const StudentQA = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [qaList, setQaList] = useState([]);
    const [question, setQuestion] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [allCourses, questions] = await Promise.all([
                    apiGetCourses(),
                    apiGetQuestions({ studentId: user.id }),
                ]);
                setCourses(allCourses);
                setQaList(questions);
            } catch (error) {
                console.error('Failed to load student Q&A:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    const enrolledCourses = useMemo(
        () => courses.filter(c => (user.enrolledCourses || []).includes(c.id)),
        [courses, user.enrolledCourses]
    );

    useEffect(() => {
        if (!selectedCourse && enrolledCourses.length > 0) {
            setSelectedCourse(enrolledCourses[0].id);
        }
    }, [enrolledCourses, selectedCourse]);

    const handleAskQuestion = async () => {
        if (!question.trim() || !selectedCourse || submitting) return;
        setSubmitting(true);
        try {
            await apiAskQuestion(user.id, Number(selectedCourse), question.trim());
            const updated = await apiGetQuestions({ studentId: user.id });
            setQaList(updated);
            setQuestion('');
        } catch (error) {
            console.error('Failed to ask question:', error);
            alert(`Failed to submit question: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="qa-page container">
                <p>Loading Q&A...</p>
            </div>
        );
    }

    return (
        <div className="qa-page container">
            <h1>Q&amp;A</h1>
            <p>Ask questions about your enrolled courses</p>

            <div className="qa-ask-box">
                {enrolledCourses.length > 0 ? (
                    <>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(Number(e.target.value))}
                            style={{ marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }}
                        >
                            {enrolledCourses.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                        <textarea
                            placeholder="Ask a question about this course..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleAskQuestion} disabled={submitting}>
                            <Send size={16} />
                            {submitting ? 'Sending...' : 'Ask'}
                        </button>
                    </>
                ) : (
                    <p>Enroll in a course first to ask questions.</p>
                )}
            </div>

            <div className="qa-list">
                {qaList.length === 0 && (
                    <p>No questions yet. Be the first to ask!</p>
                )}

                {qaList.map((item) => (
                    <div key={item.id} className={`qa-item ${item.status}`}>
                        <div className="qa-question">
                            <MessageCircle size={18} />
                            <div>
                                <strong>{item.studentName || user.name}</strong>
                                <span> • {item.courseName}</span>
                                <span> • {new Date(item.date).toLocaleDateString()}</span>
                                <p>{item.question}</p>
                            </div>
                        </div>

                        {item.answer && (
                            <div className="qa-answers">
                                <div className="qa-answer">
                                    <strong>Instructor:</strong> {item.answer}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentQA;
