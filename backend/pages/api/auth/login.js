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

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    try {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1 AND role = $2',
            [email, role]
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

        if (role === 'student') {
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
        }

        // Fetch instructor courses
        let courses = [];
        if (role === 'instructor') {
            const coursesResult = await db.query(
                'SELECT id FROM courses WHERE instructor_id = $1',
                [user.id]
            );
            courses = coursesResult.rows.map(r => r.id);
        }

        const userData = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            ...(role === 'student' && { enrolledCourses, completedLessons, quizScores, certificates: [] }),
            ...(role === 'instructor' && { courses }),
        };

        return res.status(200).json(userData);
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
