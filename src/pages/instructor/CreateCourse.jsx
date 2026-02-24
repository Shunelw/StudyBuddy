import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import { apiCreateCourse } from '../../utils/api';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import '../student/StudentDashboard.css';
import './CreateCourse.css';

const CreateCourse = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState({
        title: '',
        description: '',
        category: 'Programming',
        level: 'Beginner',
        duration: '',
        price: '',
        image: ''
    });

    const [lessons, setLessons] = useState([]);
    const [currentLesson, setCurrentLesson] = useState({
        title: '',
        description: '',
        duration: '',
        content: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData({ ...courseData, [name]: value });
    };

    const handleLessonChange = (e) => {
        const { name, value } = e.target;
        setCurrentLesson({ ...currentLesson, [name]: value });
    };

    const addLesson = () => {
        if (currentLesson.title && currentLesson.description) {
            setLessons([...lessons, { ...currentLesson, id: Date.now() }]);
            setCurrentLesson({ title: '', description: '', duration: '', content: '' });
        }
    };

    const removeLesson = (id) => {
        setLessons(lessons.filter(l => l.id !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiCreateCourse({
                ...courseData,
                instructorId: user.id,
                price: parseFloat(courseData.price) || 0,
                lessons,
            });
            alert(`Course "${courseData.title}" created successfully with ${lessons.length} lessons!`);
            navigate('/instructor/dashboard');
        } catch (err) {
            alert('Failed to create course: ' + err.message);
        }
    };

    return (
        <div className="dashboard-page">
            <div className="container">
                <button onClick={() => navigate('/instructor/dashboard')} className="back-btn">
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div className="create-course-container">
                    <div className="page-header">
                        <h1>Create New Course</h1>
                        <p>Share your knowledge with students worldwide</p>
                    </div>

                    <form onSubmit={handleSubmit} className="course-form">
                        {/* Basic Information */}
                        <div className="form-section">
                            <h2>Basic Information</h2>

                            <div className="form-group">
                                <label htmlFor="title">Course Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={courseData.title}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Introduction to Web Development"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Course Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={courseData.description}
                                    onChange={handleInputChange}
                                    placeholder="Describe what students will learn in this course..."
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="category">Category *</label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={courseData.category}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Programming">Programming</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Marketing">Marketing</option>
                                        <option value="Design">Design</option>
                                        <option value="Business">Business</option>
                                        <option value="Photography">Photography</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="level">Level *</label>
                                    <select
                                        id="level"
                                        name="level"
                                        value={courseData.level}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="duration">Duration *</label>
                                    <input
                                        type="text"
                                        id="duration"
                                        name="duration"
                                        value={courseData.duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 8 weeks"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="price">Price (USD) *</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={courseData.price}
                                        onChange={handleInputChange}
                                        placeholder="0 for free course"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="image">Course Image URL</label>
                                <div className="image-upload">
                                    <Upload size={24} />
                                    <input
                                        type="url"
                                        id="image"
                                        name="image"
                                        value={courseData.image}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="help-text">Or paste an image URL</p>
                                </div>
                            </div>
                        </div>

                        {/* Lessons */}
                        <div className="form-section">
                            <h2>Course Lessons</h2>
                            <p className="section-description">Add lessons to your course curriculum</p>

                            <div className="lessons-list">
                                {lessons.map((lesson, index) => (
                                    <div key={lesson.id} className="lesson-item-edit">
                                        <div className="lesson-number">{index + 1}</div>
                                        <div className="lesson-info">
                                            <h4>{lesson.title}</h4>
                                            <p>{lesson.description}</p>
                                            <span className="lesson-duration">{lesson.duration}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeLesson(lesson.id)}
                                            className="btn-remove"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="add-lesson-form">
                                <h3>Add New Lesson</h3>
                                <div className="form-group">
                                    <label>Lesson Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={currentLesson.title}
                                        onChange={handleLessonChange}
                                        placeholder="e.g., Introduction to HTML"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Lesson Description</label>
                                    <textarea
                                        name="description"
                                        value={currentLesson.description}
                                        onChange={handleLessonChange}
                                        placeholder="Brief description of the lesson..."
                                        rows="2"
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            name="duration"
                                            value={currentLesson.duration}
                                            onChange={handleLessonChange}
                                            placeholder="e.g., 45 min"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Video URL (optional)</label>
                                        <input
                                            type="url"
                                            name="content"
                                            value={currentLesson.content}
                                            onChange={handleLessonChange}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={addLesson}
                                    className="btn btn-outline"
                                    disabled={!currentLesson.title || !currentLesson.description}
                                >
                                    <Plus size={18} />
                                    Add Lesson
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="form-actions">
                            <button type="button" onClick={() => navigate('/instructor/dashboard')} className="btn btn-outline">
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary btn-lg">
                                Create Course
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;