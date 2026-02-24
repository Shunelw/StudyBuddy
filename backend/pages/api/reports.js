import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const result = await db.query(
                `SELECT r.*, u.name AS "userName"
         FROM reports r
         LEFT JOIN users u ON r.user_id = u.id
         ORDER BY r.created_at DESC`
            );

            const reports = result.rows.map(r => ({
                id: r.id,
                type: r.type,
                userId: r.user_id,
                userName: r.userName,
                subject: r.subject,
                description: r.description,
                date: r.created_at,
                status: r.status,
            }));

            return res.status(200).json(reports);
        } catch (error) {
            console.error('Reports GET error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { type, userId, subject, description } = req.body;

            if (!type || !userId || !subject) {
                return res.status(400).json({ error: 'type, userId, and subject are required' });
            }

            const result = await db.query(
                'INSERT INTO reports (type, user_id, subject, description) VALUES ($1, $2, $3, $4) RETURNING *',
                [type, userId, subject, description || '']
            );

            return res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Reports POST error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, status } = req.body;

            if (!id || !status) {
                return res.status(400).json({ error: 'id and status are required' });
            }

            const result = await db.query(
                'UPDATE reports SET status = $1 WHERE id = $2 RETURNING *',
                [status, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Report not found' });
            }

            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Reports PUT error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
