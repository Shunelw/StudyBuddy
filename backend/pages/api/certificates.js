import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { studentId } = req.query;
        if (!studentId) {
            return res.status(400).json({ error: 'studentId is required' });
        }

        const result = await db.query(
            `SELECT cert.id, cert.student_id AS "studentId", cert.course_id AS "courseId",
                    cert.certificate_code AS "certificateCode", cert.issued_at AS "issuedAt",
                    c.title AS "courseTitle"
             FROM certificates cert
             JOIN courses c ON c.id = cert.course_id
             WHERE cert.student_id = $1
             ORDER BY cert.issued_at DESC`,
            [studentId]
        );

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Certificates GET error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
