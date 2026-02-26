import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { api } from '../../utils/api';
import { useAuth } from '../../utils/AuthContext';
import './ManageCourse.css';

const ManageCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    duration: '',
    videoUrl: '',
    content: '',
  });
  const [quizForm, setQuizForm] = useState({ title: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api.courses
      .get(courseId)
      .then((c) => {
        if (!cancelled) {
          setCourse(c);
          setLessons(c?.lessons || []);
          setQuizzes(c?.quizzes || []);
        }
      })
      .catch(() => {
        if (!cancelled) setCourse(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [courseId]);

  const saveCourse = async (updates) => {
    if (!course?.id) return;
    setSaving(true);
    try {
      const updated = await api.courses.update(course.id, updates);
      setCourse(updated);
      if (updates.lessons != null) setLessons(updated.lessons || []);
      if (updates.quizzes != null) setQuizzes(updated.quizzes || []);
    } catch (_) {}
    setSaving(false);
  };

  const addLesson = () => {
    if (!lessonForm.title) return;
    const newLesson = {
      id: Date.now(),
      title: lessonForm.title,
      description: lessonForm.description || '',
      duration: lessonForm.duration || '',
      videoUrl: lessonForm.videoUrl || '#',
      content: lessonForm.content || '',
    };
    const nextLessons = [...lessons, newLesson];
    setLessons(nextLessons);
    setLessonForm({ title: '', description: '', duration: '', videoUrl: '', content: '' });
    saveCourse({ ...course, lessons: nextLessons });
  };

  // const deleteLesson = (id) => {
  //   const nextLessons = lessons.filter((l) => l.id !== id);
  //   setLessons(nextLessons);
  //   saveCourse({ ...course, lessons: nextLessons });
  // };

  // const addQuiz = () => {
  //   if (!quizForm.title) return;
  //   const newQuiz = { id: Date.now(), title: quizForm.title, questions: [] };
  //   const nextQuizzes = [...quizzes, newQuiz];
  //   setQuizzes(nextQuizzes);
  //   setQuizForm({ title: '' });
  //   saveCourse({ ...course, quizzes: nextQuizzes });
  // };

  const deleteQuiz = (id) => {
    const nextQuizzes = quizzes.filter((q) => q.id !== id);
    setQuizzes(nextQuizzes);
    saveCourse({ ...course, quizzes: nextQuizzes });
  };

  if (loading) return <p>Loading course...</p>;
  if (!course) return <p>Course not found</p>;
  if (course.instructorId !== user?.id) {
    return (
      <div className="manage-course-page">
        <button onClick={() => navigate('/instructor/dashboard')} className="back-btn">
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <p style={{ color: 'red', marginTop: '2rem' }}>
          Access denied. You can only manage your own courses.
        </p>
      </div>
    );
  }

  return (
    <div className="manage-course-page">
      <button onClick={() => navigate('/instructor/dashboard')} className="back-btn">
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      <h1>{course.title}</h1>

      <div className="manage-tabs">
        <button className={tab === 'overview' ? 'active' : ''} onClick={() => setTab('overview')}>Overview</button>
        <button className={tab === 'lessons' ? 'active' : ''} onClick={() => setTab('lessons')}>Lessons</button>
        <button className={tab === 'quizzes' ? 'active' : ''} onClick={() => setTab('quizzes')}>Quizzes</button>
      </div>

      {tab === 'overview' && (
        <div className="card">
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Students:</strong> {course.students ?? 0}</p>
          <p><strong>Rating:</strong> {course.rating ?? 0}</p>
        </div>
      )}

      {tab === 'lessons' && (
        <>
          <div className="form-card dashed">
            <h2>Add New Lesson</h2>
            <label>Lesson Title</label>
            <input
              value={lessonForm.title}
              onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
              placeholder="e.g. Introduction to HTML"
            />
            <label>Description</label>
            <textarea
              value={lessonForm.description}
              onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
            />
            <div className="form-row">
              <input
                placeholder="Duration (e.g. 45 min)"
                value={lessonForm.duration}
                onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
              />
              <input
                placeholder="Video URL (optional)"
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
              />
            </div>
            <button className="primary-btn" onClick={addLesson} disabled={saving}>+ Add Lesson</button>
          </div>
          <div className="list-card">
            <h2>Lessons</h2>
            {lessons.length === 0 && <p>No lessons yet</p>}
            {lessons.map((l) => (
              <div key={l.id} className="list-item">
                <div>
                  <h4>{l.title}</h4>
                  <p>{l.description}</p>
                  <span>{l.duration}</span>
                </div>
                <button className="danger-btn" onClick={() => deleteLesson(l.id)} disabled={saving}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'quizzes' && (
        <>
          <div className="form-card dashed">
            <h2>Add New Quiz</h2>
            <input
              placeholder="Quiz title"
              value={quizForm.title}
              onChange={(e) => setQuizForm({ title: e.target.value })}
            />
            <button className="primary-btn" onClick={addQuiz} disabled={saving}>+ Add Quiz</button>
          </div>
          <div className="list-card">
            <h2>Quizzes</h2>
            {quizzes.length === 0 && <p>No quizzes yet</p>}
            {quizzes.map((q) => (
              <div key={q.id} className="list-item">
                <div>
                  <h4>{q.title}</h4>
                  <span>{(q.questions || []).length} questions</span>
                </div>
                <button className="danger-btn" onClick={() => deleteQuiz(q.id)} disabled={saving}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageCourse;
