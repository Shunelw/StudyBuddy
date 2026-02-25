-- ============================================================
-- STUDYBUDDY - USER FUNCTION QUERIES
-- This file contains all major system queries
-- Grouped by: Student, Instructor, Admin
-- ============================================================



-- ============================================================
-- 👨‍🎓 STUDENT FUNCTIONS
-- ============================================================

-- 1. Register new student
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'John Doe', 'john@example.com', '$2a$10$Dtwhk.MoWvpXtEFu9/FtIuyIZtQ9Y1hde8lGGdH/IIR/2VtpPQOJG', 'student');


-- 2. Login (Backend verifies password)
SELECT * FROM users
WHERE email = 'john@example.com'
AND role = 'student';


-- 3. View all available courses
SELECT c.*, u.name AS instructor_name
FROM courses c
LEFT JOIN users u ON c.instructor_id = u.id;


-- 4. View single course details
SELECT * FROM courses
WHERE id = 1;


-- 5. Enroll in a course
INSERT INTO enrollments (student_id, course_id) VALUES
(1, 1),
(1, 2);


-- 6. View my enrolled courses
SELECT c.*
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = 1;


-- 7. Mark lesson as completed
INSERT INTO completed_lessons (student_id, lesson_id) VALUES
(1, 1),
(1, 2);

-- 8. View total completed lessons
SELECT 
    COUNT(*) AS total_completed_lessons
FROM completed_lessons
WHERE student_id = 1;

-- View total quizzes taken by a student
SELECT 
    COUNT(*) AS total_quizzes_taken4
FROM quiz_scores
WHERE student_id = 1;

-- View average quiz score for a student
SELECT 
    ROUND(AVG(score), 2) AS average_score
FROM quiz_scores
WHERE student_id = 1;

-- 9. Submit quiz score after taking quiz
INSERT INTO quiz_scores (student_id, quiz_id, score, taken_at) VALUES
(1, 1, 85, '2026-01-15'),
(1, 2, 92, '2026-01-20');

-- view total correct percent for quizz
SELECT 
    COUNT(*) AS total_quizzes_taken,
    ROUND(AVG(score), 2) AS average_correct_percentage,
    ROUND(100 - AVG(score), 2) AS average_wrong_percentage
FROM quiz_scores
WHERE student_id = 1;


-- 10. View my quiz scores
SELECT q.title, qs.score, qs.taken_at
FROM quiz_scores qs
JOIN quizzes q ON qs.quiz_id = q.id
WHERE qs.student_id = 1;


-- 11. Ask question in course Q&A
INSERT INTO questions (
	id, 
	student_id, 
	course_id, 
	question, 
	answer, 
	status, 
	created_at) 
VALUES
	(1, 1, 1, 'How do I center a div in CSS?', NULL, 'pending', '2026-01-25'),
	(2, 1, 1, 'What is the difference between padding and margin?', 'Padding is the space inside an element, while margin is the space outside an element.', 'answered', '2026-01-20');


-- 12. View my submitted questions
SELECT * FROM questions
WHERE student_id = 1;


-- 13. Make payment for a course
INSERT INTO payments (
	student_id, 
	course_id, 
	amount, 
	currency, 
	status, 
	provider, 
	provider_reference, 
	card_last4, 
	cardholder_name, 
	paid_at) 
VALUES
(1, 2, 79.99, 'USD', 'paid', 'card', 'seed-payment-1', '4242', 'John Doe', '2026-01-10');


-- 14. View my certificates
SELECT c.title, cert.certificate_code, cert.issued_at
FROM certificates cert
JOIN courses c ON cert.course_id = c.id
WHERE cert.student_id = 1;


-- 15. Submit system report (technical/content issue)
INSERT INTO reports (id, type, user_id, subject, description, status, created_at) VALUES
(1, 'technical', 1, 'Video not loading in Lesson 3', 'The video in lesson 3 keeps buffering and won''t play.', 'pending', '2026-01-26'),
(2, 'content', 1, 'Video buffering', 'The video in lesson 5 keeps buffering.', 'resolved', '2026-01-24');




-- ============================================================
-- 👨‍🏫 INSTRUCTOR FUNCTIONS
-- ============================================================

-- 2. Login (Backend verifies password)
SELECT * FROM users
WHERE email = 'jinchun@example.com'
AND role = 'instructor';

-- 16. Create new course
INSERT INTO courses (id, title, description, instructor_id, category, level, duration, price, rating, students_count, image) VALUES
(1, 'Introduction to Web Development', 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.', 2, 'Programming', 'Beginner', '8 weeks', 0, 4.8, 1250, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'),
(2, 'Data Science with Python', 'Master data analysis, visualization, and machine learning with Python.', 2, 'Data Science', 'Intermediate', '12 weeks', 79.99, 4.9, 890, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'),
(3, 'Digital Marketing Masterclass', 'Learn SEO, social media marketing, and content strategy.', 2, 'Marketing', 'Beginner', '6 weeks', 0, 4.6, 2100, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'),
(4, 'UI/UX Design Fundamentals', 'Create visually appealing and user-friendly interfaces that are easy to navigate.', 2, 'Design', 'Beginner', '10 weeks', 59.99, 4.7, 1500, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'),
(5, 'Mobile App Development', 'Build cross-platform mobile apps using React Native.', 2, 'Programming', 'Intermediate', '10 weeks', 69.99, 4.8, 980, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'),
(6, 'Database System with PostgreSQL', 'Learn relational database design and SQL using PostgreSQL.', 2, 'Data Science', 'Intermediate', '8 weeks', 0, 4.9, 1120, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400'),
(7, 'Software Project Management', 'Manage software projects using Agile and Scrum.', 2, 'Business', 'Beginner', '6 weeks', 39.99, 4.5, 760, 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400');

-- View total number of courses created by instructor (Instructor ID = 2)
SELECT COUNT(*) AS total_courses_created
FROM courses
WHERE instructor_id = 2;

-- 17. Update course details
UPDATE courses
SET price = 59.99
WHERE id = 1
AND instructor_id = 2;


-- 18. Delete course
DELETE FROM courses
WHERE id = 1
AND instructor_id = 2;


-- 19. Add lesson to course
INSERT INTO lessons (id, course_id, title, description, duration, content, video_url, sort_order) VALUES
-- Course 1: Web Development
(1, 1, 'HTML Basics', 'Introduction to HTML structure and elements', '45 min', 'Learn about HTML tags, attributes, and document structure...', '#', 1),
(2, 1, 'CSS Fundamentals', 'Styling web pages with CSS', '60 min', 'Master CSS selectors, properties, and layout techniques...', '#', 2),
(3, 1, 'JavaScript Introduction', 'Getting started with JavaScript programming', '75 min', 'Learn variables, functions, and basic programming concepts...', '#', 3),
-- Course 2: Data Science
(4, 2, 'Python Basics for Data Science', 'Essential Python concepts', '50 min', 'Learn Python fundamentals for data analysis...', '#', 1),
(5, 2, 'Data Analysis with Pandas', 'Working with data frames', '90 min', 'Master Pandas library for data manipulation...', '#', 2),
-- Course 3: Digital Marketing
(6, 3, 'Introduction to Digital Marketing', 'Overview of digital marketing channels', '40 min', 'Learn what digital marketing is and why it matters...', '#', 1),
(7, 3, 'SEO Basics', 'Search engine optimization fundamentals', '60 min', 'Understand keywords, on-page SEO, and ranking factors...', '#', 2),
(8, 3, 'Social Media Marketing', 'Marketing on social platforms', '50 min', 'Learn strategies for Facebook, Instagram, and TikTok...', '#', 3),
-- Course 4: UI/UX Design
(9, 4, 'Introduction to UI/UX', 'Understanding UI vs UX', '45 min', 'Learn the difference between UI and UX design...', '#', 1),
(10, 4, 'User Research', 'Understanding user needs', '60 min', 'Learn personas, surveys, and usability testing...', '#', 2),
(11, 4, 'Wireframing & Prototyping', 'Designing layouts and flows', '75 min', 'Create wireframes and interactive prototypes...', '#', 3),
-- Course 5: Mobile App Dev
(12, 5, 'React Native Basics', 'Getting started with React Native', '60 min', 'Learn components, styling, and navigation...', '#', 1),
-- Course 6: Database
(13, 6, 'Relational Database Basics', 'Tables, keys, and relationships', '70 min', 'Learn primary keys, foreign keys, and normalization...', '#', 1),
-- Course 7: Project Management
(14, 7, 'Agile Fundamentals', 'Introduction to Agile methodology', '50 min', 'Learn Scrum, sprints, and standups...', '#', 1);



-- 20. Create quiz for course
INSERT INTO quizzes (id, course_id, title) VALUES
(1, 1, 'HTML Quiz'),
(2, 2, 'Python Fundamentals Quiz'),
(3, 3, 'Digital Marketing Basics Quiz'),
(4, 4, 'UI/UX Fundamentals Quiz');

-- 21. Add quiz question
INSERT INTO quiz_questions (quiz_id, question, options, correct_answer) VALUES
-- Quiz 1: HTML
(1, 'What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"]', 0),
(1, 'Which HTML tag is used for the largest heading?', '["<head>", "<h6>", "<h1>", "<heading>"]', 2),
-- Quiz 2: Python
(2, 'Which library is commonly used for data manipulation in Python?', '["NumPy", "Pandas", "Matplotlib", "All of the above"]', 3),
-- Quiz 3: Digital Marketing
(3, 'What does SEO stand for?', '["Search Engine Optimization", "Social Engagement Optimization", "System Engine Output", "Search Experience Operation"]', 0),
(3, 'Which platform is best for visual marketing?', '["LinkedIn", "Twitter", "Instagram", "Reddit"]', 2),
-- Quiz 4: UI/UX
(4, 'What does UX stand for?', '["User Experience", "User Extension", "Unified Experience", "User Execution"]', 0);


-- 22. Answer student question
UPDATE questions
SET answer = 'Use display:flex;',
    status = 'answered'
WHERE id = 1;

-- View all student questions for courses owned by instructor
SELECT 
    q.id,
    u.name AS student_name,
    c.title AS course_title,
    q.question,
    q.answer,
    q.status,
    q.created_at
FROM questions q
JOIN courses c ON q.course_id = c.id
JOIN users u ON q.student_id = u.id
WHERE c.instructor_id = 2
ORDER BY q.created_at DESC;

--  View Only Pending (Unanswered) Questions
SELECT 
    q.id,
    u.name AS student_name,
    c.title AS course_title,
    q.question,
    q.created_at
FROM questions q
JOIN courses c ON q.course_id = c.id
JOIN users u ON q.student_id = u.id
WHERE c.instructor_id = 2
AND q.status = 'pending'
ORDER BY q.created_at DESC;

-- -- Instructor replies to question id = 1
UPDATE questions
SET 
    answer = 'You can center a div using flexbox: display:flex; justify-content:center; align-items:center;',
    status = 'answered'
WHERE id = 1;

-- 23. View students enrolled in my course
SELECT u.id, u.name, u.email
FROM enrollments e
JOIN users u ON e.student_id = u.id
JOIN courses c ON e.course_id = c.id
WHERE c.instructor_id = 2;



-- ============================================================
-- 👨‍💼 ADMIN FUNCTIONS
-- ============================================================

-- 26. View all payments
SELECT p.*, u.name, c.title
FROM payments p
JOIN users u ON p.student_id = u.id
JOIN courses c ON p.course_id = c.id;

-- Delete course (example: course id = 3)
DELETE FROM courses
WHERE id = 3;

-- Update course details (example: course id = 2)
UPDATE courses
SET 
    title = 'Advanced Data Science with Python',
    price = 99.99,
    level = 'Advanced',
    duration = '14 weeks'
WHERE id = 2;

-- View total students for course id = 1
SELECT 
    c.id,
    c.title,
    COUNT(e.student_id) AS total_students
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id
WHERE c.id = 1
GROUP BY c.id, c.title;

-- View Students Enrolled in a Course
SELECT 
    u.id AS student_id,
    u.name AS student_name,
    u.email,
    e.enrolled_at
FROM enrollments e
JOIN users u ON e.student_id = u.id
WHERE e.course_id = 1
AND u.role = 'student'
ORDER BY e.enrolled_at DESC;

-- Total users in platform
SELECT COUNT(*) AS total_users
FROM users;

-- Total enrollments 
SELECT COUNT(*) AS total_enrollments
FROM enrollments;

-- Total courses created
SELECT COUNT(*) AS total_courses
FROM courses;

-- Total revenue from paid courses
SELECT 
    SUM(amount) AS total_revenue
FROM payments
WHERE status = 'paid';

-- Total completion rate
SELECT 
    ROUND(
        (COUNT(DISTINCT cl.lesson_id)::decimal / 
        (SELECT COUNT(*) FROM lessons)) * 100, 
    2) AS overall_completion_percentage
FROM completed_lessons cl;

-- Total Active users
SELECT COUNT(DISTINCT student_id) AS active_quiz_users
FROM quiz_scores
WHERE taken_at >= NOW() - INTERVAL '30 days';

-- View pending reports
SELECT COUNT(*) AS pending_reports
FROM reports
WHERE status = 'pending';

-- View total users
SELECT 
    id,
    name,
    email
FROM users
WHERE role IN ('student', 'instructor')
ORDER BY role, name;

-- 27. Update report status
UPDATE reports
SET status = 'resolved'
WHERE id = 1;


-- 28. Issue certificate to student
INSERT INTO certificates (
    student_id, course_id, certificate_code
)
VALUES (
    1,
    2,
    'CERT-2026-0001'
);



-- ============================================================
-- 📊 EXTRA SYSTEM QUERIES (Analytics / Useful Operations)
-- ============================================================

-- Count number of students in a course
SELECT COUNT(*)
FROM enrollments
WHERE course_id = 1;


-- Get average quiz score for a student
SELECT AVG(score)
FROM quiz_scores
WHERE student_id = 1;