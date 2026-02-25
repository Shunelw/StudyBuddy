import db from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'PUT') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const { answer } = req.body;

    if (!answer) {
        return res.status(400).json({ error: 'Answer is required' });
    }

    try {
        const result = await db.query(
            "UPDATE questions SET answer = $1, status = 'answered' WHERE id = $2 RETURNING *",
            [answer, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Question not found' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Answer question error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
