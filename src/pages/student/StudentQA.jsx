import React, { useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { mockCourses, mockQuestions } from '../../utils/mockData';
import { MessageCircle, Send } from 'lucide-react';
import './StudentQA.css';

let nextQuestionId = mockQuestions.length + 1;

const StudentQA = () => {
    const { user } = useAuth();

    // All enrolled courses for the dropdown
    const enrolledCourses = mockCourses.filter(c =>
        (user.enrolledCourses || []).includes(c.id)
    );

    const [question, setQuestion] = useState('');
    const [selectedCourse, setSelectedCourse] = useState(
        enrolledCourses.length > 0 ? enrolledCourses[0].id : ''
    );
    const [qaList, setQaList] = useState(() =>
        mockQuestions.filter(q => q.studentId === user.id)
    );

    const handleAskQuestion = () => {
        if (!question.trim() || !selectedCourse) return;

        const course = mockCourses.find(c => c.id === Number(selectedCourse));
        const newQuestion = {
            id: nextQuestionId++,
            studentId: user.id,
            studentName: user.name,
            courseId: Number(selectedCourse),
            courseName: course?.title || '',
            question: question.trim(),
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            answer: null,
        };

        // Add to mock list (in-memory only)
        mockQuestions.push(newQuestion);
        setQaList([...qaList, newQuestion]);
        setQuestion('');
    };

    return (
        <div className="qa-page container">
            <h1>Q&amp;A</h1>
            <p>Ask questions about your enrolled courses</p>

            {/* Ask Question */}
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
                        <button className="btn btn-primary" onClick={handleAskQuestion}>
                            <Send size={16} />
                            Ask
                        </button>
                    </>
                ) : (
                    <p>Enroll in a course first to ask questions.</p>
                )}
            </div>

            {/* Questions List */}
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