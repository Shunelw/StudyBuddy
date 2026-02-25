import db from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query; // course id

    try {
        // Get all students enrolled in this course, plus all their enrolled course titles
        const result = await db.query(
            `SELECT u.id, u.name, u.email,
                    ARRAY(
                        SELECT c.title FROM enrollments e2
                        JOIN courses c ON c.id = e2.course_id
                        WHERE e2.student_id = u.id
                    ) AS "enrolledCourses"
             FROM enrollments e
             JOIN users u ON u.id = e.student_id
             WHERE e.course_id = $1
             ORDER BY u.name`,
            [id]
        );

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Course students GET error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
