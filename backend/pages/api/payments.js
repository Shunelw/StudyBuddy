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
            `SELECT p.id, p.student_id AS "studentId", p.course_id AS "courseId",
                    p.amount::float AS amount, p.currency, p.status, p.provider,
                    p.provider_reference AS "reference", p.card_last4 AS "cardLast4",
                    p.cardholder_name AS "cardholderName", p.paid_at AS "paidAt",
                    c.title AS "courseTitle"
             FROM payments p
             JOIN courses c ON c.id = p.course_id
             WHERE p.student_id = $1
             ORDER BY p.paid_at DESC`,
            [studentId]
        );

        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Payments GET error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
