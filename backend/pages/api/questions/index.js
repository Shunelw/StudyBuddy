import db from '../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const { studentId, courseId } = req.query;

            let query = `
        SELECT q.*, u.name AS "studentName", c.title AS "courseName"
        FROM questions q
        LEFT JOIN users u ON q.student_id = u.id
        LEFT JOIN courses c ON q.course_id = c.id
      `;
            const conditions = [];
            const params = [];

            if (studentId) {
                params.push(studentId);
                conditions.push(`q.student_id = $${params.length}`);
            }

            if (courseId) {
                params.push(courseId);
                conditions.push(`q.course_id = $${params.length}`);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' ORDER BY q.created_at DESC';

            const result = await db.query(query, params);

            const questions = result.rows.map(q => ({
                id: q.id,
                studentId: q.student_id,
                studentName: q.studentName,
                courseId: q.course_id,
                courseName: q.courseName,
                question: q.question,
                date: q.created_at,
                status: q.status,
                answer: q.answer,
            }));

            return res.status(200).json(questions);
        } catch (error) {
            console.error('Questions GET error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { studentId, courseId, question } = req.body;

            if (!studentId || !courseId || !question) {
                return res.status(400).json({ error: 'studentId, courseId, and question are required' });
            }

            const result = await db.query(
                'INSERT INTO questions (student_id, course_id, question) VALUES ($1, $2, $3) RETURNING *',
                [studentId, courseId, question]
            );

            return res.status(201).json(result.rows[0]);
        } catch (error) {
            console.error('Questions POST error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
