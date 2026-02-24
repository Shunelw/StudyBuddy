import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Star, Award } from 'lucide-react';
import './CourseCard.css';

const CourseCard = ({ course, enrollButton = false, onEnroll, viewOnly = false }) => {
    return (
        <div className="course-card animate-fade-in">
            <div className="course-image-wrapper">
                <img src={course.image} alt={course.title} className="course-image" />
                <div className="course-level-badge">
                    <span className={`level-badge level-${(course.level || '').toLowerCase()}`}>
                        {course.level}
                    </span>
                </div>
            </div>

            <div className="course-card-body">
                <div className="course-category-tag">{course.category}</div>

                <h3 className="course-card-title">{course.title}</h3>

                <p className="course-card-description">{course.description}</p>

                <div className="course-card-footer">
                    <div className="course-instructor-row">
                        <div className="instructor-avatar-small">
                            {(course.instructor || '?').charAt(0)}
                        </div>
                        <span className="instructor-name-small">{course.instructor}</span>
                    </div>

                    <div className="course-price-tag">
                        {course.price === 0 ? (
                            <span className="price-free">FREE</span>
                        ) : (
                            <span className="price-amount">${course.price}</span>
                        )}
                    </div>
                </div>

                {!viewOnly && (
                    <div className="course-card-action">
                        {enrollButton ? (
                            <button onClick={() => onEnroll(course.id)} className="btn-enroll">
                                Enroll Now
                            </button>
                        ) : (
                            <Link to={`/student/course/${course.id}`} className="btn-enroll">
                                View Course
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCard;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Edit, Trash2 } from 'lucide-react';
// import './CourseCard.css';

// const CourseCard = ({
//     course,
//     enrollButton = false,
//     onEnroll,
//     viewOnly = false,
//     variant = 'student', // ✅ NEW: student | admin
//     onEdit,
//     onDelete
// }) => {
//     return (
//         <div className={`course-card animate-fade-in ${variant}`}>
//             <div className="course-image-wrapper">
//                 <img src={course.image} alt={course.title} className="course-image" />
//                 <div className="course-level-badge">
//                     <span className={`level-badge level-${course.level.toLowerCase()}`}>
//                         {course.level}
//                     </span>
//                 </div>
//             </div>

//             <div className="course-card-body">
//                 <div className="course-category-tag">{course.category}</div>

//                 <h3 className="course-card-title">{course.title}</h3>

//                 <p className="course-card-description">
//                     {course.description}
//                 </p>

//                 {/* STUDENT FOOTER */}
//                 {variant === 'student' && (
//                     <>
//                         <div className="course-card-footer">
//                             <div className="course-instructor-row">
//                                 <div className="instructor-avatar-small">
//                                     {course.instructor.charAt(0)}
//                                 </div>
//                                 <span className="instructor-name-small">
//                                     {course.instructor}
//                                 </span>
//                             </div>

//                             <div className="course-price-tag">
//                                 {course.price === 0 ? (
//                                     <span className="price-free">FREE</span>
//                                 ) : (
//                                     <span className="price-amount">${course.price}</span>
//                                 )}
//                             </div>
//                         </div>

//                         {!viewOnly && (
//                             <div className="course-card-action">
//                                 {enrollButton ? (
//                                     <button
//                                         onClick={() => onEnroll(course.id)}
//                                         className="btn-enroll"
//                                     >
//                                         Enroll Now
//                                     </button>
//                                 ) : (
//                                     <Link
//                                         to={`/student/course/${course.id}`}
//                                         className="btn-enroll"
//                                     >
//                                         View Course
//                                     </Link>
//                                 )}
//                             </div>
//                         )}
//                     </>
//                 )}

//                 {/* ADMIN FOOTER */}
//                 {variant === 'admin' && (
//                     <div className="admin-course-footer">
//                         <p className="course-meta">
//                             👥 {course.students} students
//                         </p>

//                         <div className="admin-course-actions">
//                             <button
//                                 className="btn-outline"
//                                 onClick={() => onEdit?.(course)}
//                             >
//                                 <Edit size={16} />
//                                 Edit
//                             </button>

//                             <button
//                                 className="btn-danger"
//                                 onClick={() => onDelete?.(course)}
//                             >
//                                 <Trash2 size={16} />
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CourseCard;