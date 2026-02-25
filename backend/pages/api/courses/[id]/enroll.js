import db from '../../../../lib/db';

export default async function handler(req, res) {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query; // course id
    const { studentId, payment } = req.body;

    if (!studentId) {
        return res.status(400).json({ error: 'studentId is required' });
    }

    let client;
    try {
        const courseResult = await db.query(
            'SELECT id, title, price FROM courses WHERE id = $1',
            [id]
        );
        if (courseResult.rows.length === 0) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const course = courseResult.rows[0];
        const price = parseFloat(course.price) || 0;

        // Check if already enrolled
        const existing = await db.query(
            'SELECT id FROM enrollments WHERE student_id = $1 AND course_id = $2',
            [studentId, id]
        );

        if (existing.rows.length > 0) {
            return res.status(409).json({ error: 'Already enrolled' });
        }

        if (price > 0 && !payment) {
            return res.status(400).json({ error: 'Payment is required for paid courses' });
        }

        let cardLast4 = null;
        if (price > 0 && payment) {
            const cardNumber = String(payment.cardNumber || '').replace(/\s+/g, '');
            cardLast4 = cardNumber.slice(-4);
            if (!payment.name || cardLast4.length !== 4) {
                return res.status(400).json({ error: 'Invalid payment details' });
            }
        }

        client = await db.pool.connect();
        await client.query('BEGIN');

        await client.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES ($1, $2)',
            [studentId, id]
        );

        let paymentId = null;
        if (price > 0 && payment) {
            const paymentResult = await client.query(
                `INSERT INTO payments
                (student_id, course_id, amount, currency, status, provider, provider_reference, card_last4, cardholder_name)
                 VALUES ($1, $2, $3, 'USD', 'paid', 'card', $4, $5, $6)
                 RETURNING id`,
                [
                    studentId,
                    id,
                    price,
                    `sb-${studentId}-${id}-${Date.now()}`,
                    cardLast4,
                    payment.name,
                ]
            );
            paymentId = paymentResult.rows[0].id;
        }

        await client.query('COMMIT');

        return res.status(201).json({
            message: 'Enrolled successfully',
            courseTitle: course.title,
            price,
            paymentId,
        });
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        console.error('Enroll error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (client) {
            client.release();
        }
    }
}
