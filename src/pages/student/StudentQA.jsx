import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { apiGetQuestions, apiAskQuestion, apiGetCourses } from '../../utils/api';
import { MessageCircle, Send } from 'lucide-react';
import './StudentQA.css';

const StudentQA = () => {
    const { user } = useAuth();
    const [question, setQuestion] = useState('');
    const [qaList, setQaList] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Load courses for the dropdown
        apiGetCourses().then(data => {
            const enrolled = data.filter(c => (user.enrolledCourses || []).includes(c.id));
            setCourses(enrolled);
            if (enrolled.length > 0) setSelectedCourse(enrolled[0].id);
        }).catch(console.error);

        // Load existing questions
        apiGetQuestions({ studentId: user.id })
            .then(setQaList)
            .catch(console.error);
    }, [user.id]);

    const handleAskQuestion = async () => {
        if (!question.trim() || !selectedCourse) return;

        try {
            await apiAskQuestion(user.id, selectedCourse, question);
            // Refresh questions
            const updated = await apiGetQuestions({ studentId: user.id });
            setQaList(updated);
            setQuestion('');
        } catch (err) {
            console.error('Failed to ask question:', err);
        }
    };

    return (
        <div className="qa-page container">
            <h1>Q&A</h1>
            <p>Ask questions and learn from the community</p>

            {/* Ask Question */}
            <div className="qa-ask-box">
                {courses.length > 0 && (
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(Number(e.target.value))}
                        style={{ marginBottom: '0.5rem', width: '100%', padding: '0.5rem' }}
                    >
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                    </select>
                )}
                <textarea
                    placeholder="Ask a question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleAskQuestion}>
                    <Send size={16} />
                    Ask
                </button>
            </div>

            {/* Questions List */}
            <div className="qa-list">
                {qaList.length === 0 && (
                    <p>No questions yet. Be the first to ask!</p>
                )}

                {qaList.map((item) => (
                    <div
                        key={item.id}
                        className={`qa-item ${item.status}`}
                    >
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