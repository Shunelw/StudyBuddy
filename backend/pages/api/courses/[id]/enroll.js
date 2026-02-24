const db = require('../../../../lib/db');

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query; // course id
    const { studentId } = req.body;

    if (!studentId) {
        return res.status(400).json({ error: 'studentId is required' });
    }

    try {
        // Check if already enrolled
        const existing = await db.query(
            'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
            [studentId, id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Already enrolled' });
        }

        await db.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)',
            [studentId, id]
        );

        // Increment students count
        await db.query(
            'UPDATE courses SET students_count = students_count + 1 WHERE id = $1',
            [id]
        );

        return res.status(201).json({ message: 'Enrolled successfully' });
    } catch (error) {
        console.error('Enroll error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
