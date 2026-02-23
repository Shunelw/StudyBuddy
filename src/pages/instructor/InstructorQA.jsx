import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { api } from '../../utils/api';
import './InstructorQA.css';

const InstructorQA = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [sending, setSending] = useState(false);

  const [searchParams] = useSearchParams();
  const focusedQuestionId = searchParams.get('questionId');

  useEffect(() => {
    let cancelled = false;
    api.qa
      .list()
      .then((list) => {
        if (!cancelled) setQuestions(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setQuestions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (focusedQuestionId) setActiveId(focusedQuestionId);
  }, [focusedQuestionId]);

  const submitAnswer = async (id) => {
    if (!answerText.trim()) return;
    setSending(true);
    try {
      await api.qa.answer(id, answerText.trim(), user?.name || 'Instructor', 'instructor');
      const list = await api.qa.list();
      setQuestions(Array.isArray(list) ? list : []);
      setActiveId(null);
      setAnswerText('');
    } catch (_) {}
    setSending(false);
  };

  const pending = questions.filter((q) => q.status === 'pending');

  return (
    <div className="qa-page">
      <h1>Student Questions</h1>

      {loading && <p>Loading...</p>}
      {!loading && pending.length === 0 && <div className="qa-empty">No pending questions 🎉</div>}

      {pending.map((q) => (
        <div
          key={q.id}
          className={`qa-card ${String(q.id) === focusedQuestionId ? 'highlight' : ''}`}
        >
          <div className="qa-header">
            <div>
              <h3>{q.studentName || 'Anonymous'}</h3>
              <span className="qa-course">{q.courseName || 'General'}</span>
            </div>
            <span className="qa-date">{q.date}</span>
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
                  disabled={!answerText.trim() || sending}
                  onClick={() => submitAnswer(q.id)}
                >
                  {sending ? 'Sending...' : 'Submit'}
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
