const db = require('../../lib/db');

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const result = await db.query('SELECT * FROM categories ORDER BY id');
        return res.status(200).json(result.rows);
    } catch (error) {
        console.error('Categories error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
