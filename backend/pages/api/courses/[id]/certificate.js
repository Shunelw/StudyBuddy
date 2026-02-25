import db from '../../../../lib/db';

const makeCertificateCode = (studentId, courseId) => {
    const stamp = Date.now().toString(36).toUpperCase();
    return `SB-${courseId}-${studentId}-${stamp}`;
};

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;
    const { studentId } = req.body;

    if (!studentId) {
        return res.status(400).json({ error: 'studentId is required' });
    }

    try {
        const existing = await db.query(
            `SELECT cert.id, cert.student_id AS "studentId", cert.course_id AS "courseId",
                    cert.certificate_code AS "certificateCode", cert.issued_at AS "issuedAt",
                    c.title AS "courseTitle"
             FROM certificates cert
             JOIN courses c ON c.id = cert.course_id
             WHERE cert.student_id = $1 AND cert.course_id = $2`,
            [studentId, id]
        );
        if (existing.rows.length > 0) {
            return res.status(200).json({ ...existing.rows[0], alreadyIssued: true });
        }

        const enrolled = await db.query(
            'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
            [studentId, id]
        );
        if (enrolled.rows.length === 0) {
            return res.status(403).json({ error: 'Student is not enrolled in this course' });
        }

        const totalLessonsResult = await db.query(
            'SELECT COUNT(*)::int AS total FROM lessons WHERE course_id = $1',
            [id]
        );
        const totalLessons = totalLessonsResult.rows[0].total;
        if (totalLessons === 0) {
            return res.status(400).json({ error: 'Course has no lessons yet' });
        }

        const completedLessonsResult = await db.query(
            `SELECT COUNT(*)::int AS completed
             FROM completed_lessons cl
             JOIN lessons l ON l.id = cl.lesson_id
             WHERE cl.student_id = $1 AND l.course_id = $2`,
            [studentId, id]
        );
        const completed = completedLessonsResult.rows[0].completed;
        if (completed < totalLessons) {
            return res.status(400).json({
                error: 'Course is not completed yet',
                progress: { completed, total: totalLessons },
            });
        }

        const code = makeCertificateCode(studentId, id);
        const inserted = await db.query(
            `INSERT INTO certificates (student_id, course_id, certificate_code)
             VALUES ($1, $2, $3)
             RETURNING id, student_id AS "studentId", course_id AS "courseId",
                       certificate_code AS "certificateCode", issued_at AS "issuedAt"`,
            [studentId, id, code]
        );

        const course = await db.query('SELECT title FROM courses WHERE id = $1', [id]);

        return res.status(201).json({
            ...inserted.rows[0],
            courseTitle: course.rows[0]?.title || '',
        });
    } catch (error) {
        console.error('Certificate POST error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
