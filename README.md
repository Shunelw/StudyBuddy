# StudyBuddy — Frontend

A React + Vite SPA for the StudyBuddy learning management platform. Students can browse courses, enroll, track progress, take quizzes, and use Q&A — while instructors and admins have their own dashboards.

> **Backend repo:** https://github.com/YiN189/studybuddy-api

---

## Screenshots

### Home
![Home](https://raw.githubusercontent.com/YiN189/studybuddy-api/main/docs/screenshots/home.png)

### Student Dashboard
![Student Dashboard](https://raw.githubusercontent.com/YiN189/studybuddy-api/main/docs/screenshots/student-dashboard.png)

### Browse Courses
![Courses](https://raw.githubusercontent.com/YiN189/studybuddy-api/main/docs/screenshots/courses.png)

### Course View
![Course View](https://raw.githubusercontent.com/YiN189/studybuddy-api/main/docs/screenshots/course-view.png)

### Quiz
![Quiz](https://raw.githubusercontent.com/YiN189/studybuddy-api/main/docs/screenshots/quiz.png)

### Instructor Dashboard
![Instructor Dashboard](https://raw.githubusercontent.com/YiN189/studybuddy-api/main/docs/screenshots/instructor-dashboard.png)

### Admin Dashboard
![Admin Dashboard](https://raw.githubusercontent.com/YiN189/studybuddy-api/main/docs/screenshots/admin-dashboard.png)

---

## Team Members

| Name |
| --- |
| Nyi Phyo Kyaw |
| Yoon Hsu Hlaing |
| Shune Lai Wai |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 18, Vite |
| Routing | React Router v6 |
| Icons | Lucide React |
| Styling | CSS |
| Deployment | Nginx (inside Docker) |

---

## Features

- **Authentication** — Register and log in as Student, Instructor, or Admin.
- **Course Browsing** — Browse all courses with filtering by category, level, and keyword search.
- **Enrollment** — Students can enroll in free or paid courses.
- **Lesson Progress** — Mark lessons as completed and track progress percentage per course.
- **Quizzes** — Take quizzes embedded in courses and receive instant scores.
- **Q&A Forum** — Students ask questions; instructors provide answers per course.
- **Instructor Dashboard** — View enrolled students, manage courses, create new courses, and answer Q&A.
- **Admin Dashboard** — View system statistics, manage users, courses, and handle reports.
- **Issue Reporting** — Students can report technical or content issues.

---

## Project Structure

```
StudyBuddy/
└── src/
    ├── utils/
    │   ├── api.js              Axios instance
    │   ├── AuthContext.jsx     Auth state provider
    │   └── mockData.js         Mock/seed data for development
    ├── App.jsx                 Router, navbar, auth state
    ├── components/common/
    │   ├── Navigation.jsx
    │   └── CourseCard.jsx
    └── pages/
        ├── Home.jsx
        ├── Login.jsx
        ├── Register.jsx
        ├── student/
        │   ├── StudentDashboard.jsx
        │   ├── Courses.jsx
        │   ├── CourseView.jsx
        │   ├── EnrollmentModal.jsx
        │   ├── Quiz.jsx
        │   └── StudentQA.jsx
        ├── instructor/
        │   ├── InstructorDashboard.jsx
        │   ├── CreateCourse.jsx
        │   ├── ManageCourse.jsx
        │   ├── InstructorStudents.jsx
        │   └── InstructorQA.jsx
        └── admin/
            ├── AdminDashboard.jsx
            ├── AdminCourses.jsx
            ├── AdminUsers.jsx
            └── AdminReports.jsx
```

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

### Running with Docker Compose

Clone both repos side by side and run from the backend repo:

```
project2/
├── studybuddy-api/   ← backend repo (https://github.com/YiN189/studybuddy-api)
└── StudyBuddy/       ← this repo
```

```bash
cd studybuddy-api
docker-compose up --build -d
```

### Running Locally (without Docker)

```bash
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

> Make sure the backend is running at `http://localhost:3000` before starting the frontend.
