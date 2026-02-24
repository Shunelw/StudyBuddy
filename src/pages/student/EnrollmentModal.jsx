import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { api } from '../../utils/api';
import { CheckCircle, CreditCard, Lock, X, ArrowRight } from 'lucide-react';
import './EnrollmentModal.css';

const EnrollmentModal = ({ course, onClose }) => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentInfo, setPaymentInfo] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    const isFree = course.price === 0;

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length <= 2) return digits;
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    };

    const handleEnroll = () => {
        if (isFree) {
            completeEnrollment();
        } else {
            setStep(2);
        }
    };

    const handlePayment = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => completeEnrollment(), 1000);
    };

    const completeEnrollment = async () => {
        if (!user?.id) return;
        setLoading(true);
        setError('');
        try {
            await api.enrollments.enroll(user.id, course.id);
            const enrolledCourses = user.enrolledCourses || [];
            updateUser({ enrolledCourses: [...enrolledCourses, course.id] });
            setStep(3);
        } catch (e) {
            setError(e.message || 'Enrollment failed');
        } finally {
            setLoading(false);
        }
    };

    const handleViewCourse = () => {
        navigate(`/student/course/${course.id}`);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="enrollment-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                {step === 1 && (
                    <div className="modal-content">
                        <div className="modal-scroll">
                            <div className="modal-header">
                                <h2>Enroll in Course</h2>
                                <p>Join thousands of students learning this course</p>
                            </div>

                            <div className="course-summary">
                                <img src={course.image} alt={course.title} className="summary-image" />
                                <div className="summary-details">
                                    <h3>{course.title}</h3>
                                    <p className="summary-instructor">by {course.instructor}</p>
                                    <div className="summary-stats">
                                        <span>{course.duration}</span>
                                        <span>•</span>
                                        <span>{(course.lessons || []).length} lessons</span>
                                        <span>•</span>
                                        <span>{course.level}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="enrollment-benefits">
                                <h4>What's included:</h4>
                                <ul>
                                    <li>
                                        <CheckCircle size={20} />
                                        <span>Full lifetime access</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={20} />
                                        <span>{(course.lessons || []).length} video lessons</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={20} />
                                        <span>Downloadable resources</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={20} />
                                        <span>Certificate of completion</span>
                                    </li>
                                    <li>
                                        <CheckCircle size={20} />
                                        <span>Access on mobile and desktop</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="modal-price">
                                <div>
                                    <span className="price-label">Total</span>
                                    <span className="price-value">
                                        {isFree ? 'FREE' : `$${course.price}`}
                                    </span>
                                </div>
                            </div>

                            {error && <p className="auth-error" style={{ marginBottom: '0.5rem' }}>{error}</p>}
                            <div className="modal-actions">
                                <button className="btn btn-outline" onClick={onClose} disabled={loading}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary btn-lg" onClick={handleEnroll} disabled={loading}>
                                    {loading ? 'Enrolling...' : isFree ? 'Enroll for Free' : 'Continue to Payment'}
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <form onSubmit={handlePayment} className="modal-content">
                        <div className="modal-scroll">
                            <div className="modal-header">
                                <h2>Payment Information</h2>
                                <p>Complete your enrollment</p>
                            </div>

                            <div className="payment-summary">
                                <div className="payment-course">
                                    <strong>{course.title}</strong>
                                    <span>${course.price}</span>
                                </div>
                            </div>

                            <div className="payment-form-fields">
                                <div className="form-group">
                                    <label>Cardholder Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={paymentInfo.name}
                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Card Number</label>
                                    <div className="input-with-icon">
                                        {/* <CreditCard size={20} /> */}
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={paymentInfo.cardNumber}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                                            maxLength="19"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Expiry Date</label>
                                        <input
                                            type="text"
                                            placeholder="MM/YY"
                                            value={paymentInfo.expiry}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, expiry: formatExpiry(e.target.value) })}
                                            maxLength="5"
                                            inputMode="numeric"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>CVV</label>
                                        <div className="input-with-icon">
                                            {/* <Lock size={18} /> */}
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={paymentInfo.cvv}
                                                onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '') })}
                                                maxLength="3"
                                                inputMode="numeric"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="payment-security">
                                <Lock size={16} />
                                <span>Your payment information is secure and encrypted</span>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                                    Back
                                </button>
                                <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                    {loading ? 'Processing...' : `Pay $${course.price}`}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <div className="modal-content success-modal">
                        <div className="modal-scroll">
                            <div className="success-icon">
                                <CheckCircle size={80} />
                            </div>
                            <h2>{isFree ? 'Successfully Enrolled!' : 'Payment Successful!'}</h2>
                            <p>You're enrolled and ready to start learning.</p>

                            <div className="success-details">
                                <h3>{course.title}</h3>
                                <p>Your course is now available in your dashboard</p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <div className="modal-actions">
                                <button className="btn btn-outline" onClick={onClose}>
                                    Browse More Courses
                                </button>
                                <button className="btn btn-primary btn-lg" onClick={handleViewCourse}>
                                    Start Learning
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EnrollmentModal;
