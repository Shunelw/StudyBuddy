import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query; // course id

    if (req.method === 'POST') {
        try {
            const { title } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'title is required' });
            }

            const result = await db.query(
                'INSERT INTO quizzes (course_id, title) VALUES ($1, $2) RETURNING *',
                [id, title]
            );

            return res.status(201).json({
                id: result.rows[0].id,
                title: result.rows[0].title,
                questions: [],
            });
        } catch (error) {
            console.error('Quiz POST error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { quizId } = req.query;
            if (!quizId) {
                return res.status(400).json({ error: 'quizId query param required' });
            }

            const result = await db.query(
                'DELETE FROM quizzes WHERE id = $1 AND course_id = $2 RETURNING id',
                [quizId, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            return res.status(200).json({ message: 'Quiz deleted' });
        } catch (error) {
            console.error('Quiz DELETE error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
