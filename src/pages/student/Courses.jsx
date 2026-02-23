import React, { useState, useEffect } from 'react';
import { useAuth } from '../../utils/AuthContext';
import { api } from '../../utils/api';
import CourseCard from '../../components/common/CourseCard';
import EnrollmentModal from './EnrollmentModal';
import { Search, Filter, BookOpen } from 'lucide-react';
import './Courses.css';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [enrollingCourse, setEnrollingCourse] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const [coursesRes, categoriesRes] = await Promise.all([
          api.courses.list(),
          api.categories.list().catch(() => []),
        ]);
        if (!cancelled) {
          setCourses(Array.isArray(coursesRes) ? coursesRes : []);
          setCategories(Array.isArray(categoriesRes) ? categoriesRes : []);
        }
      } catch (e) {
        if (!cancelled) setError(e.message || 'Failed to load courses');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const enrolledCourseIds = user?.enrolledCourses || [];

  const handleEnroll = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (course) setEnrollingCourse(course);
  };

  const filteredCourses = courses.filter((course) => {
    const title = course?.title || '';
    const description = course?.description || '';
    const category = course?.category || '';
    const level = course?.level || '';
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="courses-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>Browse Courses</h1>
            <p>Discover courses to advance your skills</p>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <BookOpen size={20} />
              <span>{courses.length} Courses Available</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <div className="search-filter-section">
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
                {(categories || []).map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
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

        <div className="results-info">
          <p>
            Showing <strong>{filteredCourses.length}</strong> course
            {filteredCourses.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading courses...</p>
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => {
                const isEnrolled = enrolledCourseIds.includes(course.id);
                return (
                  <div key={course.id ?? index} style={{ animationDelay: `${index * 0.1}s` }}>
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
        )}
      </div>

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
