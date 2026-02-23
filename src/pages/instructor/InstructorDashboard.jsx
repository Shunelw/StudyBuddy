import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { api } from '../../utils/api';
import { BookOpen, Users, MessageCircle, Award, Plus, TrendingUp } from 'lucide-react';
import '../student/StudentDashboard.css';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const [coursesRes, qaRes] = await Promise.all([
          api.courses.list({ instructorId: user.id }),
          api.qa.list(),
        ]);
        if (!cancelled) {
          setInstructorCourses(Array.isArray(coursesRes) ? coursesRes : []);
          setQuestions(Array.isArray(qaRes) ? qaRes : []);
        }
      } catch (_) {
        if (!cancelled) setInstructorCourses([]);
        if (!cancelled) setQuestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  const pendingQuestions = questions.filter((q) => q.status === 'pending');

  const stats = [
    { icon: BookOpen, label: 'My Courses', value: instructorCourses.length, color: 'primary' },
    {
      icon: Users,
      label: 'Total Students',
      value: instructorCourses.reduce((acc, c) => acc + (c.students || 0), 0),
      color: 'success',
    },
    { icon: MessageCircle, label: 'Pending Questions', value: pendingQuestions.length, color: 'warning' },
    {
      icon: Award,
      label: 'Avg Rating',
      value:
        instructorCourses.length > 0
          ? (instructorCourses.reduce((acc, c) => acc + (c.rating || 0), 0) / instructorCourses.length).toFixed(1)
          : '0.0',
      color: 'accent',
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header animate-fade-in">
          <div>
            <h1>Welcome, {user?.name}!</h1>
            <p>Manage your courses and help your students succeed</p>
          </div>
          <Link to="/instructor/create-course" className="btn btn-primary">
            <Plus size={18} />
            Create New Course
          </Link>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={`stat-icon stat-icon-${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dashboard-content">
          <section className="section">
            <div className="section-title">
              <h2>My Courses</h2>
              <Link to="/instructor/qa" className="view-all">View All</Link>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : instructorCourses.length > 0 ? (
              <div className="courses-grid-instructor">
                {instructorCourses.map((course, index) => (
                  <div key={course.id} className="instructor-course-card animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="course-thumbnail">
                      <img src={course.image} alt={course.title} />
                      <div className="course-overlay">
                        <Link to={`/instructor/course/${course.id}`} className="btn btn-outline btn-sm">
                          Manage Course
                        </Link>
                      </div>
                    </div>
                    <div className="course-info">
                      <span className="course-category">{course.category}</span>
                      <h3>{course.title}</h3>
                      <div className="course-stats">
                        <div className="stat-item">
                          <Users size={16} />
                          <span>{course.students ?? 0} students</span>
                        </div>
                        <div className="stat-item">
                          <Award size={16} />
                          <span>{course.rating ?? 0} rating</span>
                        </div>
                        <div className="stat-item">
                          <BookOpen size={16} />
                          <span>{(course.lessons || []).length} lessons</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <BookOpen size={48} />
                <h3>No courses yet</h3>
                <p>Create your first course to start teaching</p>
                <Link to="/instructor/create-course" className="btn btn-primary">
                  <Plus size={18} />
                  Create Course
                </Link>
              </div>
            )}
          </section>

          <section className="section">
            <div className="section-title">
              <h2>Student Questions</h2>
              <Link to="/instructor/qa" className="view-all">View All</Link>
            </div>
            <div className="questions-list">
              {pendingQuestions.slice(0, 5).map((question) => (
                <div key={question.id} className="question-item">
                  <div className="question-header">
                    <div className="student-info">
                      <div className="student-avatar">{(question.studentName || '?').charAt(0)}</div>
                      <div>
                        <h4>{question.studentName || 'Anonymous'}</h4>
                        <p className="course-name">{question.courseName || 'General'}</p>
                      </div>
                    </div>
                    <span className="question-date">{question.date}</span>
                  </div>
                  <p className="question-text">{question.question}</p>
                  <div className="question-actions">
                    <span className="status-badge pending">Pending</span>
                    <Link to={`/instructor/qa?questionId=${question.id}`} className="btn btn-outline btn-sm">
                      <MessageCircle size={16} />
                      Answer
                    </Link>
                  </div>
                </div>
              ))}
              {pendingQuestions.length === 0 && !loading && (
                <div className="empty-activity">
                  <MessageCircle size={32} />
                  <p>No pending questions</p>
                </div>
              )}
            </div>
          </section>

          <section className="section">
            <div className="section-title">
              <h2>Performance Overview</h2>
            </div>
            <div className="performance-grid">
              <div className="performance-card">
                <TrendingUp size={32} />
                <h3>Student Enrollment</h3>
                <p className="performance-value">+{Math.floor(Math.random() * 50 + 20)}%</p>
                <p className="performance-label">This month</p>
              </div>
              <div className="performance-card">
                <Award size={32} />
                <h3>Course Completion</h3>
                <p className="performance-value">{Math.floor(Math.random() * 30 + 60)}%</p>
                <p className="performance-label">Average rate</p>
              </div>
              <div className="performance-card">
                <MessageCircle size={32} />
                <h3>Response Rate</h3>
                <p className="performance-value">{Math.floor(Math.random() * 20 + 75)}%</p>
                <p className="performance-label">Questions answered</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
