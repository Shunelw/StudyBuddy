const db = require('../../../lib/db');

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const courseResult = await db.query(
                `SELECT c.*, u.name AS instructor
         FROM courses c
         LEFT JOIN users u ON c.instructor_id = u.id
         WHERE c.id = $1`,
                [id]
            );

            if (courseResult.rows.length === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }

            const course = courseResult.rows[0];

            const lessonsResult = await db.query(
                'SELECT * FROM lessons WHERE course_id = $1 ORDER BY sort_order',
                [id]
            );

            const quizzesResult = await db.query(
                'SELECT * FROM quizzes WHERE course_id = $1',
                [id]
            );

            const quizzes = await Promise.all(
                quizzesResult.rows.map(async (quiz) => {
                    const questionsResult = await db.query(
                        'SELECT id, question, options, correct_answer AS "correctAnswer" FROM quiz_questions WHERE quiz_id = $1',
                        [quiz.id]
                    );
                    return {
                        id: quiz.id,
                        title: quiz.title,
                        questions: questionsResult.rows,
                    };
                })
            );

            return res.status(200).json({
                id: course.id,
                title: course.title,
                description: course.description,
                instructor: course.instructor,
                instructorId: course.instructor_id,
                category: course.category,
                level: course.level,
                duration: course.duration,
                price: parseFloat(course.price),
                rating: parseFloat(course.rating),
                students: course.students_count,
                image: course.image,
                lessons: lessonsResult.rows.map(l => ({
                    id: l.id,
                    title: l.title,
                    description: l.description,
                    duration: l.duration,
                    content: l.content,
                    videoUrl: l.video_url,
                })),
                quizzes,
            });
        } catch (error) {
            console.error('Course GET error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { title, description, category, level, duration, price, image } = req.body;

            const result = await db.query(
                `UPDATE courses SET
          title = COALESCE($1, title),
          description = COALESCE($2, description),
          category = COALESCE($3, category),
          level = COALESCE($4, level),
          duration = COALESCE($5, duration),
          price = COALESCE($6, price),
          image = COALESCE($7, image)
        WHERE id = $8 RETURNING *`,
                [title, description, category, level, duration, price, image, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Course not found' });
            }

            return res.status(200).json(result.rows[0]);
        } catch (error) {
            console.error('Course PUT error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
