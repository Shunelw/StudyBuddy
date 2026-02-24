import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const usersResult = await db.query('SELECT COUNT(*) AS count FROM users');
        const coursesResult = await db.query('SELECT COUNT(*) AS count FROM courses');
        const enrollmentsResult = await db.query('SELECT COUNT(*) AS count FROM enrollments');

        // Active users = students with at least one enrollment
        const activeUsersResult = await db.query(
            'SELECT COUNT(DISTINCT student_id) AS count FROM enrollments'
        );

        // Revenue = sum of course prices * number of enrollments for paid courses
        const revenueResult = await db.query(
            `SELECT COALESCE(SUM(c.price), 0) AS total
       FROM enrollments e
       JOIN courses c ON e.course_id = c.id
       WHERE c.price > 0`
        );

        // Completion rate = completed lessons / total possible lessons per enrolled student
        const completionResult = await db.query(
            `SELECT
         CASE WHEN COUNT(*) = 0 THEN 0
         ELSE ROUND(
           (SELECT COUNT(*)::numeric FROM completed_lessons) /
           (SELECT COALESCE(NULLIF(SUM(lesson_count), 0), 1) FROM (
             SELECT COUNT(l.id) AS lesson_count
             FROM enrollments e
             JOIN lessons l ON l.course_id = e.course_id
             GROUP BY e.student_id, e.course_id
           ) sub) * 100
         ) END AS rate
       FROM enrollments`
        );

        return res.status(200).json({
            totalUsers: parseInt(usersResult.rows[0].count),
            totalCourses: parseInt(coursesResult.rows[0].count),
            totalEnrollments: parseInt(enrollmentsResult.rows[0].count),
            activeUsers: parseInt(activeUsersResult.rows[0].count),
            revenue: parseFloat(revenueResult.rows[0].total),
            completionRate: parseInt(completionResult.rows[0].rate) || 0,
        });
    } catch (error) {
        console.error('Stats error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
