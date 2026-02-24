import React, { useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { mockCourses, mockCategories } from '../../utils/mockData';
import CourseCard from '../../components/common/CourseCard';
import EnrollmentModal from '../../pages/student/EnrollmentModal';
import { Search, Filter, BookOpen } from 'lucide-react';
import './Courses.css';

const Courses = () => {
    const { user } = useAuth();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');
    const [enrollingCourse, setEnrollingCourse] = useState(null);

    const enrolledCourseIds = user?.enrolledCourses || [];

    const handleEnroll = (courseId) => {
        const course = mockCourses.find(c => c.id === courseId);
        if (course) setEnrollingCourse(course);
    };

    const filteredCourses = mockCourses.filter(course => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
        return matchesSearch && matchesCategory && matchesLevel;
    });

    return (
        <div className="courses-page">
            <div className="container">
                {/* Header */}
                <div className="page-header animate-fade-in">
                    <div>
                        <h1>Browse Courses</h1>
                        <p>Discover courses to advance your skills</p>
                    </div>
                    <div className="header-stats">
                        <div className="stat-badge">
                            <BookOpen size={20} />
                            <span>{mockCourses.length} Courses Available</span>
                        </div>
                    </div>
                </div>

                {/* Search + Filters */}
                <div className="search-filter-section animate-fade-in">
                    <div className="search-box">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters">
                        <div className="filter-group">
                            <Filter size={18} />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                {mockCategories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select
                                value={selectedLevel}
                                onChange={(e) => setSelectedLevel(e.target.value)}
                            >
                                <option value="All">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Category chips */}
                <div className="categories-section">
                    <div className="category-chips">
                        <button
                            className={`category-chip ${selectedCategory === 'All' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('All')}
                        >
                            All Courses
                        </button>
                        {mockCategories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-chip ${selectedCategory === cat.name ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.name)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results Info */}
                <div className="results-info">
                    <p>
                        Showing <strong>{filteredCourses.length}</strong> course
                        {filteredCourses.length !== 1 ? 's' : ''}
                        {searchTerm && ` for "${searchTerm}"`}
                    </p>
                </div>

                {/* Courses Grid */}
                <div className="courses-grid">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map((course, index) => {
                            const isEnrolled = enrolledCourseIds.includes(course.id);
                            return (
                                <div
                                    key={course.id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <CourseCard
                                        course={course}
                                        enrollButton={!isEnrolled}
                                        onEnroll={handleEnroll}
                                    />
                                </div>
                            );
                        })
                    ) : (
                        <div className="empty-state">
                            <BookOpen size={64} />
                            <h3>No courses found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Enrollment Modal */}
            {enrollingCourse && (
                <EnrollmentModal
                    course={enrollingCourse}
                    onClose={() => setEnrollingCourse(null)}
                />
            )}
        </div>
    );
};

export default Courses;