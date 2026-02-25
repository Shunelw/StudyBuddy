import db from '../../../lib/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { email, password, role } = req.body;
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!normalizedEmail || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const result = await db.query(
            'SELECT * FROM users WHERE LOWER(email) = LOWER($1) ORDER BY id LIMIT 1',
            [normalizedEmail]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Fetch enrolled courses and completed lessons for students
        let enrolledCourses = [];
        let completedLessons = [];
        let quizScores = [];
        let certificates = [];

        if (user.role === 'student') {
            const enrollResult = await db.query(
                'SELECT course_id FROM enrollments WHERE student_id = $1',
                [user.id]
            );
            enrolledCourses = enrollResult.rows.map(r => r.course_id);

            const completedResult = await db.query(
                'SELECT lesson_id FROM completed_lessons WHERE student_id = $1',
                [user.id]
            );
            completedLessons = completedResult.rows.map(r => r.lesson_id);

            const scoresResult = await db.query(
                'SELECT quiz_id AS "quizId", score, taken_at AS date FROM quiz_scores WHERE student_id = $1',
                [user.id]
            );
            quizScores = scoresResult.rows;

            const certificatesResult = await db.query(
                `SELECT cert.id, cert.course_id AS "courseId", c.title AS "courseTitle",
                        cert.certificate_code AS "certificateCode", cert.issued_at AS "issuedAt"
                 FROM certificates cert
                 JOIN courses c ON c.id = cert.course_id
                 WHERE cert.student_id = $1
                 ORDER BY cert.issued_at DESC`,
                [user.id]
            );
            certificates = certificatesResult.rows;
        }

        // Fetch instructor courses
        let courses = [];
        if (user.role === 'instructor') {
            const coursesResult = await db.query(
                'SELECT id FROM courses WHERE instructor_id = $1',
                [user.id]
            );
            courses = coursesResult.rows.map(r => r.id);
        }

        if (role && user.role !== role) {
            // Ignore selected role mismatches and authenticate with real account role.
            // This keeps login resilient when users choose the wrong role button.
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            ...(user.role === 'student' && { enrolledCourses, completedLessons, quizScores, certificates }),
            ...(user.role === 'instructor' && { courses }),
        };

        return res.status(200).json(userData);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
