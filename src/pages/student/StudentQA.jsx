import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { api } from '../../utils/api';
import { MessageCircle, Send } from 'lucide-react';
import './StudentQA.css';

const StudentQA = () => {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.qa.list()
      .then((list) => { if (!cancelled) setQaList(Array.isArray(list) ? list : []); })
      .catch(() => { if (!cancelled) setQaList([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    setSending(true);
    try {
      await api.qa.ask({
        studentId: user?.id,
        studentName: user?.name || 'Student',
        courseId: null,
        courseName: null,
        question: question.trim(),
      });
      const list = await api.qa.list();
      setQaList(Array.isArray(list) ? list : []);
      setQuestion('');
    } catch (_) {}
    setSending(false);
  };

  return (
    <div className="qa-page container">
      <h1>Q&A</h1>
      <p>Ask questions and learn from the community</p>

      <div className="qa-ask-box">
        <textarea
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAskQuestion} disabled={sending}>
          <Send size={16} />
          {sending ? 'Sending...' : 'Ask'}
        </button>
      </div>

      <div className="qa-list">
        {loading && <p>Loading questions...</p>}
        {!loading && qaList.length === 0 && <p>No questions yet. Be the first to ask!</p>}
        {qaList.map((item) => (
          <div key={item.id} className={`qa-item ${item.status}`}>
            <div className="qa-question">
              <MessageCircle size={18} />
              <div>
                <strong>{item.studentName || 'Anonymous'}</strong>
                <span> • {item.date}</span>
                <p>{item.question}</p>
              </div>
            </div>
            {item.answers?.length > 0 && (
              <div className="qa-answers">
                {item.answers.map((ans, idx) => (
                  <div key={idx} className="qa-answer">
                    <strong>{ans.author}:</strong> {ans.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentQA;
