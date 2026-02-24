import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { apiGetCourse, apiSubmitQuiz } from '../../utils/api';
import { Award, Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import './Quiz.css';

const Quiz = () => {
    const { courseId, quizId } = useParams();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes

    useEffect(() => {
        apiGetCourse(courseId).then(data => {
            setCourse(data);
            const foundQuiz = data?.quizzes?.find(q => q.id === parseInt(quizId));
            setQuiz(foundQuiz || null);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [courseId, quizId]);

    React.useEffect(() => {
        if (!showResults && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !showResults) {
            handleSubmit();
        }
    }, [timeLeft, showResults]);

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><h2>Loading...</h2></div>;
    }

    if (!course || !quiz) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <h2>Quiz not found</h2>
                <button onClick={() => navigate('/student/courses')} className="btn btn-primary">
                    Back to Courses
                </button>
            </div>
        );
    }

    const handleAnswerSelect = (questionId, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: answerIndex
        });
    };

    const handleNext = () => {
        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        let correct = 0;
        quiz.questions.forEach((question) => {
            if (selectedAnswers[question.id] === question.correctAnswer) {
                correct++;
            }
        });

        const score = Math.round((correct / quiz.questions.length) * 100);

        // Save quiz result to backend
        try {
            await apiSubmitQuiz(quiz.id, user.id, score);
        } catch (err) {
            console.error('Failed to submit quiz:', err);
        }

        const quizScores = user.quizScores || [];
        const newScore = {
            quizId: quiz.id,
            courseId: course.id,
            score: score,
            date: new Date().toISOString().split('T')[0]
        };

        updateUser({
            quizScores: [...quizScores, newScore]
        });

        setShowResults(true);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const calculateResults = () => {
        let correct = 0;
        quiz.questions.forEach((question) => {
            if (selectedAnswers[question.id] === question.correctAnswer) {
                correct++;
            }
        });
        return {
            correct,
            total: quiz.questions.length,
            score: Math.round((correct / quiz.questions.length) * 100)
        };
    };

    if (showResults) {
        const results = calculateResults();
        const passed = results.score >= 70;

        return (
            <div className="quiz-page">
                <div className="container">
                    <div className="quiz-results animate-scale-in">
                        <div className={`results-header ${passed ? 'passed' : 'failed'}`}>
                            <div className="results-icon">
                                {passed ? <Award size={64} /> : <XCircle size={64} />}
                            </div>
                            <h1>{passed ? 'Congratulations!' : 'Keep Trying!'}</h1>
                            <p>{passed ? 'You passed the quiz!' : 'You need 70% to pass'}</p>
                        </div>

                        <div className="results-score">
                            <div className="score-circle">
                                <svg width="200" height="200">
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke="var(--border)"
                                        strokeWidth="12"
                                    />
                                    <circle
                                        cx="100"
                                        cy="100"
                                        r="80"
                                        fill="none"
                                        stroke={passed ? 'var(--success)' : 'var(--error)'}
                                        strokeWidth="12"
                                        strokeDasharray={`${2 * Math.PI * 80}`}
                                        strokeDashoffset={`${2 * Math.PI * 80 * (1 - results.score / 100)}`}
                                        strokeLinecap="round"
                                        transform="rotate(-90 100 100)"
                                    />
                                </svg>
                                <div className="score-text">
                                    <div className="score-value">{results.score}%</div>
                                    <div className="score-label">Your Score</div>
                                </div>
                            </div>

                            <div className="results-stats">
                                <div className="stat">
                                    <CheckCircle size={24} />
                                    <div>
                                        <div className="stat-value">{results.correct}</div>
                                        <div className="stat-label">Correct Answers</div>
                                    </div>
                                </div>
                                <div className="stat">
                                    <XCircle size={24} />
                                    <div>
                                        <div className="stat-value">{results.total - results.correct}</div>
                                        <div className="stat-label">Wrong Answers</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="results-review">
                            <h2>Review Answers</h2>
                            {quiz.questions.map((question, index) => {
                                const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                                return (
                                    <div key={question.id} className={`review-question ${isCorrect ? 'correct' : 'incorrect'}`}>
                                        <div className="review-header">
                                            <span className="question-number">Question {index + 1}</span>
                                            {isCorrect ? (
                                                <CheckCircle size={20} className="correct-icon" />
                                            ) : (
                                                <XCircle size={20} className="incorrect-icon" />
                                            )}
                                        </div>
                                        <h4>{question.question}</h4>
                                        <div className="review-answers">
                                            {question.options.map((option, optIndex) => (
                                                <div
                                                    key={optIndex}
                                                    className={`review-option ${optIndex === question.correctAnswer ? 'correct-answer' : ''
                                                        } ${optIndex === selectedAnswers[question.id] && optIndex !== question.correctAnswer ? 'wrong-answer' : ''
                                                        }`}
                                                >
                                                    {option}
                                                    {optIndex === question.correctAnswer && <CheckCircle size={16} />}
                                                    {optIndex === selectedAnswers[question.id] && optIndex !== question.correctAnswer && <XCircle size={16} />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="results-actions">
                            <button onClick={() => navigate(`/student/course/${courseId}`)} className="btn btn-outline">
                                Back to Course
                            </button>
                            <button onClick={() => window.location.reload()} className="btn btn-primary">
                                Retake Quiz
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="quiz-page">
            <div className="container">
                <button onClick={() => navigate(`/student/course/${courseId}`)} className="back-btn">
                    <ArrowLeft size={20} />
                    Back to Course
                </button>

                <div className="quiz-container animate-fade-in">
                    {/* Quiz Header */}
                    <div className="quiz-header">
                        <div>
                            <h1>{quiz.title}</h1>
                            <p>{course.title}</p>
                        </div>
                        <div className="quiz-timer">
                            <Clock size={24} />
                            <span className={timeLeft < 300 ? 'timer-warning' : ''}>{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="quiz-progress">
                        <div className="progress-info">
                            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="progress-bar-track">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    {/* Question */}
                    <div className="question-container">
                        <h2 className="question-text">{question.question}</h2>

                        <div className="options-list">
                            {question.options.map((option, index) => (
                                <label
                                    key={index}
                                    className={`option-item ${selectedAnswers[question.id] === index ? 'selected' : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={selectedAnswers[question.id] === index}
                                        onChange={() => handleAnswerSelect(question.id, index)}
                                    />
                                    <span className="option-label">{String.fromCharCode(65 + index)}</span>
                                    <span className="option-text">{option}</span>
                                    <span className="option-radio"></span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="quiz-navigation">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className="btn btn-outline"
                        >
                            <ArrowLeft size={20} />
                            Previous
                        </button>

                        <div className="question-dots">
                            {quiz.questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`dot ${index === currentQuestion ? 'active' : ''} ${selectedAnswers[quiz.questions[index].id] !== undefined ? 'answered' : ''}`}
                                    onClick={() => setCurrentQuestion(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>

                        {currentQuestion === quiz.questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                                className="btn btn-primary"
                            >
                                Submit Quiz
                                <Award size={20} />
                            </button>
                        ) : (
                            <button onClick={handleNext} className="btn btn-primary">
                                Next
                                <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Quiz;