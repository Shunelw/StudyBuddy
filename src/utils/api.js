// StudyBuddy API Client
// Centralized fetch helpers for all backend endpoints

const API_BASE = '/api';

async function request(path, options = {}) {
    const url = `${API_BASE}${path}`;
    const config = {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    };

    const response = await fetch(url, config);

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
}

// ── Auth ──────────────────────────────────────────────
export const apiLogin = (email, password, role) =>
    request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
    });

export const apiRegister = (name, email, password, role) =>
    request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
    });

// ── Users ──────────────────────────────────────────────
export const apiGetUsers = () => request('/users');

// ── Courses ────────────────────────────────────────────
export const apiGetCourses = (instructorId) => {
    const query = instructorId ? `?instructorId=${instructorId}` : '';
    return request(`/courses${query}`);
};

export const apiGetCourse = (id) => request(`/courses/${id}`);

export const apiCreateCourse = (courseData) =>
    request('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData),
    });

export const apiUpdateCourse = (id, courseData) =>
    request(`/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(courseData),
    });

export const apiEnrollCourse = (courseId, studentId) =>
    request(`/courses/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ studentId }),
    });

export const apiGetLessons = (courseId) =>
    request(`/courses/${courseId}/lessons`);

export const apiCompleteLesson = (courseId, studentId, lessonId) =>
    request(`/courses/${courseId}/lessons/complete`, {
        method: 'POST',
        body: JSON.stringify({ studentId, lessonId }),
    });

// ── Quizzes ────────────────────────────────────────────
export const apiGetQuiz = (quizId) => request(`/quizzes/${quizId}`);

export const apiSubmitQuiz = (quizId, studentId, score) =>
    request(`/quizzes/${quizId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ studentId, score }),
    });

// ── Q&A Questions ──────────────────────────────────────
export const apiGetQuestions = ({ studentId, courseId } = {}) => {
    const params = new URLSearchParams();
    if (studentId) params.set('studentId', studentId);
    if (courseId) params.set('courseId', courseId);
    const query = params.toString() ? `?${params}` : '';
    return request(`/questions${query}`);
};

export const apiAskQuestion = (studentId, courseId, question) =>
    request('/questions', {
        method: 'POST',
        body: JSON.stringify({ studentId, courseId, question }),
    });

export const apiAnswerQuestion = (questionId, answer) =>
    request(`/questions/${questionId}/answer`, {
        method: 'PUT',
        body: JSON.stringify({ answer }),
    });

// ── Reports ────────────────────────────────────────────
export const apiGetReports = () => request('/reports');

export const apiCreateReport = (type, userId, subject, description) =>
    request('/reports', {
        method: 'POST',
        body: JSON.stringify({ type, userId, subject, description }),
    });

export const apiResolveReport = (reportId) =>
    request('/reports', {
        method: 'PUT',
        body: JSON.stringify({ id: reportId, status: 'resolved' }),
    });

// ── Stats ──────────────────────────────────────────────
export const apiGetStats = () => request('/stats');

// ── Categories ─────────────────────────────────────────
export const apiGetCategories = () => request('/categories');
