import db from '../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const { instructorId } = req.query;

            let query = `
        SELECT c.*, u.name AS instructor, COALESCE(ec.enrolled_count, 0) AS enrolled_count
        FROM courses c
        LEFT JOIN users u ON c.instructor_id = u.id
        LEFT JOIN (
            SELECT course_id, COUNT(*)::int AS enrolled_count
            FROM enrollments
            GROUP BY course_id
        ) ec ON ec.course_id = c.id
      `;
            const params = [];

            if (instructorId) {
                query += ' WHERE c.instructor_id = $1';
                params.push(instructorId);
            }

            query += ' ORDER BY c.id';

            const result = await db.query(query, params);

            // Fetch lessons and quizzes for each course
            const courses = await Promise.all(
                result.rows.map(async (course) => {
                    const lessonsResult = await db.query(
                        'SELECT * FROM lessons WHERE course_id = $1 ORDER BY sort_order',
                        [course.id]
                    );

                    const quizzesResult = await db.query(
                        'SELECT * FROM quizzes WHERE course_id = $1',
                        [course.id]
                    );

                    // Fetch questions for each quiz
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

                    return {
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
                        students: parseInt(course.enrolled_count, 10) || 0,
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
                    };
                })
            );

            return res.status(200).json(courses);
        } catch (error) {
            console.error('Courses GET error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { title, description, instructorId, category, level, duration, price, image, lessons, quizzes } = req.body;

            const courseResult = await db.query(
                `INSERT INTO courses (title, description, instructor_id, category, level, duration, price, image)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
                [title, description, instructorId, category, level, duration, price || 0, image || '']
            );

            const course = courseResult.rows[0];

            // Insert lessons
            if (lessons && lessons.length > 0) {
                for (let i = 0; i < lessons.length; i++) {
                    const lesson = lessons[i];
                    await db.query(
                        `INSERT INTO lessons (course_id, title, description, duration, content, video_url, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                        [course.id, lesson.title, lesson.description || '', lesson.duration || '', lesson.content || '', lesson.videoUrl || '#', i + 1]
                    );
                }
            }

            // Insert quizzes
            if (quizzes && quizzes.length > 0) {
                for (const quiz of quizzes) {
                    const quizResult = await db.query(
                        'INSERT INTO quizzes (course_id, title) VALUES ($1, $2) RETURNING id',
                        [course.id, quiz.title]
                    );
                    const quizId = quizResult.rows[0].id;

                    if (quiz.questions && quiz.questions.length > 0) {
                        for (const q of quiz.questions) {
                            await db.query(
                                'INSERT INTO quiz_questions (quiz_id, question, options, correct_answer) VALUES ($1, $2, $3, $4)',
                                [quizId, q.question, JSON.stringify(q.options), q.correctAnswer]
                            );
                        }
                    }
                }
            }

            return res.status(201).json({ id: course.id, message: 'Course created' });
        } catch (error) {
            console.error('Courses POST error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
