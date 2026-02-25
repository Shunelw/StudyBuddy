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

    if (req.method === 'POST') {
        try {
            const { title, description, duration, videoUrl } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'title is required' });
            }

            // Get current max sort_order for this course
            const maxOrder = await db.query(
                'SELECT COALESCE(MAX(sort_order), 0) AS max FROM lessons WHERE course_id = $1',
                [id]
            );

            const result = await db.query(
                `INSERT INTO lessons (course_id, title, description, duration, video_url, sort_order)
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
                [id, title, description || '', duration || '', videoUrl || '#', maxOrder.rows[0].max + 1]
            );

            const l = result.rows[0];
            return res.status(201).json({
                id: l.id,
                title: l.title,
                description: l.description,
                duration: l.duration,
                content: l.content,
                videoUrl: l.video_url,
            });
        } catch (error) {
            console.error('Lesson POST error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const { lessonId } = req.query;
            if (!lessonId) {
                return res.status(400).json({ error: 'lessonId query param required' });
            }

            const result = await db.query(
                'DELETE FROM lessons WHERE id = $1 AND course_id = $2 RETURNING id',
                [lessonId, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Lesson not found' });
            }

            return res.status(200).json({ message: 'Lesson deleted' });
        } catch (error) {
            console.error('Lesson DELETE error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
