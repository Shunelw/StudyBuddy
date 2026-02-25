import db from '../../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { studentId, lessonId } = req.body;

    if (!studentId || !lessonId) {
        return res.status(400).json({ error: 'studentId and lessonId are required' });
    }

    try {
        await db.query(
            'INSERT INTO completed_lessons (student_id, lesson_id) VALUES ($1, $2) ON CONFLICT (student_id, lesson_id) DO NOTHING',
            [studentId, lessonId]
        );

        return res.status(200).json({ message: 'Lesson marked as complete' });
    } catch (error) {
        console.error('Complete lesson error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
