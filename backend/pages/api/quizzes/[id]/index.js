import db from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query; // quiz id

    if (req.method === 'GET') {
        try {
            const quizResult = await db.query(
                `SELECT q.*, c.title AS course_title
         FROM quizzes q
         LEFT JOIN courses c ON q.course_id = c.id
         WHERE q.id = $1`,
                [id]
            );

            if (quizResult.rows.length === 0) {
                return res.status(404).json({ error: 'Quiz not found' });
            }

            const quiz = quizResult.rows[0];

            const questionsResult = await db.query(
                'SELECT id, question, options, correct_answer AS "correctAnswer" FROM quiz_questions WHERE quiz_id = $1',
                [id]
            );

            return res.status(200).json({
                id: quiz.id,
                title: quiz.title,
                courseId: quiz.course_id,
                courseTitle: quiz.course_title,
                questions: questionsResult.rows,
            });
        } catch (error) {
            console.error('Quiz GET error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
