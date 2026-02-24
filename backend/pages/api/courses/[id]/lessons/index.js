import db from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query; // course id

    if (req.method === 'GET') {
        try {
            const result = await db.query(
                'SELECT id, title, description, duration, content, video_url AS "videoUrl" FROM lessons WHERE course_id = $1 ORDER BY sort_order',
                [id]
            );
            return res.status(200).json(result.rows);
        } catch (error) {
            console.error('Lessons GET error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
