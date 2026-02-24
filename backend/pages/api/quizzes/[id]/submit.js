import db from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query; // quiz id
    const { studentId, score } = req.body;

    if (!studentId || score === undefined) {
        return res.status(400).json({ error: 'studentId and score are required' });
    }

    try {
        await db.query(
            'INSERT INTO quiz_scores (student_id, quiz_id, score) VALUES ($1, $2, $3)',
            [studentId, id, score]
        );

        return res.status(201).json({ message: 'Score submitted' });
    } catch (error) {
        console.error('Submit quiz error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
