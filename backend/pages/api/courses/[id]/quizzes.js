import db from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query; // course id

    if (req.method === 'POST') {
        let client;
        try {
            const { title, questions = [] } = req.body;
            if (!title) {
                return res.status(400).json({ error: 'title is required' });
            }

            if (!Array.isArray(questions)) {
                return res.status(400).json({ error: 'questions must be an array' });
            }

            for (const [index, q] of questions.entries()) {
                const questionText = (q?.question || '').trim();
                const options = Array.isArray(q?.options) ? q.options : [];
                const correctAnswer = Number.isInteger(q?.correctAnswer) ? q.correctAnswer : -1;

                if (!questionText) {
                    return res.status(400).json({ error: `Question ${index + 1} is missing text` });
                }
                if (options.length < 2 || options.some(opt => !String(opt || '').trim())) {
                    return res.status(400).json({ error: `Question ${index + 1} must include at least 2 non-empty choices` });
                }
                if (correctAnswer < 0 || correctAnswer >= options.length) {
                    return res.status(400).json({ error: `Question ${index + 1} has invalid correctAnswer` });
                }
            }

            client = await db.pool.connect();
            await client.query('BEGIN');

            const result = await client.query(
                'INSERT INTO quizzes (course_id, title) VALUES ($1, $2) RETURNING *',
                [id, title]
            );
            const quizId = result.rows[0].id;

            const createdQuestions = [];
            for (const q of questions) {
                const insertQuestion = await client.query(
                    `INSERT INTO quiz_questions (quiz_id, question, options, correct_answer)
                     VALUES ($1, $2, $3, $4)
                     RETURNING id, question, options, correct_answer AS "correctAnswer"`,
                    [quizId, q.question.trim(), JSON.stringify(q.options), q.correctAnswer]
                );
                createdQuestions.push(insertQuestion.rows[0]);
            }

            await client.query('COMMIT');

            return res.status(201).json({
                id: quizId,
                title: result.rows[0].title,
                questions: createdQuestions,
            });
        } catch (error) {
            if (client) {
                await client.query('ROLLBACK');
            }
            console.error('Quiz POST error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        } finally {
            if (client) {
                client.release();
            }
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
