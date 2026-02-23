/**
 * StudyBuddy API client — all requests go to studybuddy-api backend.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }
  return data;
}

// Auth
export const api = {
  auth: {
    login: (email, password, role) =>
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      }),
    register: (name, email, password, role) =>
      request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role }),
      }),
  },

  courses: {
    list: (params = {}) => {
      const sp = new URLSearchParams(params);
      return request(`/api/courses${sp.toString() ? `?${sp}` : ''}`);
    },
    get: (id) => request(`/api/courses/${id}`),
    update: (id, body) =>
      request(`/api/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
    create: (body) =>
      request('/api/courses', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  categories: {
    list: () => request('/api/categories'),
  },

  enrollments: {
    list: (studentId) => request(`/api/enrollments?studentId=${encodeURIComponent(studentId)}`),
    enroll: (studentId, courseId) =>
      request('/api/enrollments', {
        method: 'POST',
        body: JSON.stringify({ studentId, courseId }),
      }),
  },

  progress: {
    get: (studentId, courseId) =>
      request(`/api/progress?studentId=${encodeURIComponent(studentId)}&courseId=${courseId}`),
    completeLesson: (studentId, lessonId) =>
      request('/api/progress', {
        method: 'POST',
        body: JSON.stringify({ studentId, lessonId }),
      }),
  },

  quiz: {
    submit: (studentId, quizId, score, courseId) =>
      request('/api/quiz/submit', {
        method: 'POST',
        body: JSON.stringify({ studentId, quizId, score, courseId }),
      }),
  },

  qa: {
    list: (courseId) =>
      request(courseId ? `/api/qa?courseId=${courseId}` : '/api/qa'),
    ask: (body) =>
      request('/api/qa', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    answer: (questionId, answer, authorName, authorRole) =>
      request(`/api/qa/${questionId}/answer`, {
        method: 'POST',
        body: JSON.stringify({ answer, authorName, authorRole }),
      }),
  },

  admin: {
    stats: () => request('/api/admin/stats'),
    users: () => request('/api/admin/users'),
  },

  reports: {
    list: (status) =>
      request(status ? `/api/reports?status=${encodeURIComponent(status)}` : '/api/reports'),
  },
};

export default api;
