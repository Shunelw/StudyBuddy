-- StudyBuddy Seed Data
-- Run AFTER schema.sql: psql -d studybuddy -f backend/db/seed.sql
-- Passwords are bcrypt hashes of the plaintext passwords shown in comments

-- ============================================================
-- USERS
-- ============================================================
-- student123
INSERT INTO users (id, name, email, password_hash, role) VALUES
(1, 'John Doe', 'john@example.com', '$2a$10$Dtwhk.MoWvpXtEFu9/FtIuyIZtQ9Y1hde8lGGdH/IIR/2VtpPQOJG', 'student');

-- instructor123
INSERT INTO users (id, name, email, password_hash, role) VALUES
(2, 'T. JinChun Lu', 'jinchun@example.com', '$2a$10$u2kcsR42T2OpDAeAwHIA4u/lA4u16U5YXJwv5C2x7S5MzTVCiBmoW', 'instructor');

-- admin123
INSERT INTO users (id, name, email, password_hash, role) VALUES
(3, 'Admin User', 'admin@example.com', '$2a$10$QL3uwjQykuTY1NKIHKqVaOFLoeTSx5Efu4O6XUGj5qQTn2vLJmFki', 'admin');

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT INTO categories (id, name, count) VALUES
(1, 'Programming', 45),
(2, 'Data Science', 32),
(3, 'Marketing', 28),
(4, 'Design', 38),
(5, 'Business', 25),
(6, 'Photography', 18);

SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));

-- ============================================================
-- COURSES
-- ============================================================
INSERT INTO courses (id, title, description, instructor_id, category, level, duration, price, rating, students_count, image) VALUES
(1, 'Introduction to Web Development', 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.', 2, 'Programming', 'Beginner', '8 weeks', 0, 4.8, 1250, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'),
(2, 'Data Science with Python', 'Master data analysis, visualization, and machine learning with Python.', 2, 'Data Science', 'Intermediate', '12 weeks', 79.99, 4.9, 890, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'),
(3, 'Digital Marketing Masterclass', 'Learn SEO, social media marketing, and content strategy.', 2, 'Marketing', 'Beginner', '6 weeks', 0, 4.6, 2100, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'),
(4, 'UI/UX Design Fundamentals', 'Create visually appealing and user-friendly interfaces that are easy to navigate.', 2, 'Design', 'Beginner', '10 weeks', 59.99, 4.7, 1500, 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400'),
(5, 'Mobile App Development', 'Build cross-platform mobile apps using React Native.', 2, 'Programming', 'Intermediate', '10 weeks', 69.99, 4.8, 980, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400'),
(6, 'Database System with PostgreSQL', 'Learn relational database design and SQL using PostgreSQL.', 2, 'Data Science', 'Intermediate', '8 weeks', 0, 4.9, 1120, 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400'),
(7, 'Software Project Management', 'Manage software projects using Agile and Scrum.', 2, 'Business', 'Beginner', '6 weeks', 39.99, 4.5, 760, 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400');

SELECT setval('courses_id_seq', (SELECT MAX(id) FROM courses));

-- ============================================================
-- LESSONS
-- ============================================================
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

SELECT setval('lessons_id_seq', (SELECT MAX(id) FROM lessons));

-- ============================================================
-- QUIZZES
-- ============================================================
INSERT INTO quizzes (id, course_id, title) VALUES
(1, 1, 'HTML Quiz'),
(2, 2, 'Python Fundamentals Quiz'),
(3, 3, 'Digital Marketing Basics Quiz'),
(4, 4, 'UI/UX Fundamentals Quiz');

SELECT setval('quizzes_id_seq', (SELECT MAX(id) FROM quizzes));

-- ============================================================
-- QUIZ QUESTIONS
-- ============================================================
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

-- ============================================================
-- ENROLLMENTS
-- ============================================================
INSERT INTO enrollments (student_id, course_id) VALUES
(1, 1),
(1, 2);

-- ============================================================
-- PAYMENTS
-- ============================================================
INSERT INTO payments (student_id, course_id, amount, currency, status, provider, provider_reference, card_last4, cardholder_name, paid_at) VALUES
(1, 2, 79.99, 'USD', 'paid', 'card', 'seed-payment-1', '4242', 'John Doe', '2026-01-10');

-- ============================================================
-- COMPLETED LESSONS
-- ============================================================
INSERT INTO completed_lessons (student_id, lesson_id) VALUES
(1, 1),
(1, 2);

-- ============================================================
-- QUIZ SCORES
-- ============================================================
INSERT INTO quiz_scores (student_id, quiz_id, score, taken_at) VALUES
(1, 1, 85, '2026-01-15'),
(1, 2, 92, '2026-01-20');

-- ============================================================
-- Q&A QUESTIONS
-- ============================================================
INSERT INTO questions (id, student_id, course_id, question, answer, status, created_at) VALUES
(1, 1, 1, 'How do I center a div in CSS?', NULL, 'pending', '2026-01-25'),
(2, 1, 1, 'What is the difference between padding and margin?', 'Padding is the space inside an element, while margin is the space outside an element.', 'answered', '2026-01-20');

SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));

-- ============================================================
-- REPORTS
-- ============================================================
INSERT INTO reports (id, type, user_id, subject, description, status, created_at) VALUES
(1, 'technical', 1, 'Video not loading in Lesson 3', 'The video in lesson 3 keeps buffering and won''t play.', 'pending', '2026-01-26'),
(2, 'content', 1, 'Video buffering', 'The video in lesson 5 keeps buffering.', 'resolved', '2026-01-24');

SELECT setval('reports_id_seq', (SELECT MAX(id) FROM reports));
