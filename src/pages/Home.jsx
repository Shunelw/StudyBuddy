import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, CheckCircle, Star } from 'lucide-react';
import { api } from '../utils/api';
import CourseCard from '../components/common/CourseCard';
import './Home.css';

const Home = () => {
    const [featuredCourses, setFeaturedCourses] = useState([]);
    useEffect(() => {
        api.courses.list().then((list) => setFeaturedCourses(Array.isArray(list) ? list.slice(0, 4) : [])).catch(() => setFeaturedCourses([]));
    }, []);

    const features = [
        {
            icon: BookOpen,
            title: 'Expert-Led Courses',
            description: 'Learn from industry professionals and experienced instructors'
        },
        {
            icon: Award,
            title: 'Earn Certificates',
            description: 'Get recognized for your achievements with verified certificates'
        },
        {
            icon: Users,
            title: 'Interactive Learning',
            description: 'Engage with instructors and fellow students in real-time'
        },
        {
            icon: TrendingUp,
            title: 'Track Progress',
            description: 'Monitor your learning journey with detailed analytics'
        }
    ];

    const stats = [
        { value: '10K+', label: 'Active Students' },
        { value: '500+', label: 'Quality Courses' },
        { value: '95%', label: 'Satisfaction Rate' },
        { value: '50+', label: 'Expert Instructors' }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-gradient"></div>
                <div className="container">
                    <div className="hero-content animate-fade-in">
                        <div className="hero-text">
                            <h1 className="hero-title">
                                {/* Where Learning Meets */} Study
                                <span className="gradient-text"> Buddy</span>
                            </h1>
                            <h2 className="hero-description">
                                Where Learning Meets Convenience
                            </h2>
                            <p className="hero-subdescription">
                                Unlock your potential with our comprehensive online learning platform.
                                Access thousands of courses, learn from experts, and advance your career
                                at your own pace.
                            </p>
                            <div className="hero-buttons">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free
                                    <TrendingUp size={20} />
                                </Link>
                                <Link to="/student/courses" className="btn btn-outline btn-lg">
                                    Explore Courses
                                </Link>
                            </div>
                            <div className="hero-stats">
                                {stats.map((stat, index) => (
                                    <div key={index} className="stat-item">
                                        <div className="stat-value">{stat.value}</div>
                                        <div className="stat-label">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hero-visual">
                            <div className="floating-card card-1 animate-float">
                                <BookOpen size={32} />
                                <div className="card-content">
                                    <h4>Interactive Lessons</h4>
                                    <p>Engaging video content</p>
                                </div>
                            </div>
                            <div className="floating-card card-2 animate-float-delayed">
                                <Award size={32} />
                                <div className="card-content">
                                    <h4>Certificates</h4>
                                    <p>Prove your skills</p>
                                </div>
                            </div>
                            <div className="floating-card card-3 animate-float-slow">
                                <Star size={32} fill="currentColor" />
                                <div className="card-content">
                                    <h4>4.8 Rating</h4>
                                    <p>Trusted by thousands</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Why Choose StudyBuddy?</h2>
                        <p className="section-description">
                            Everything you need for a successful learning journey
                        </p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="feature-card animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="feature-icon">
                                        <Icon size={28} />
                                    </div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="courses-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Courses</h2>
                        <p className="section-description">
                            Start learning with our most popular courses
                        </p>
                    </div>

                    <div className="courses-grid">
                        {featuredCourses.map((course, index) => (
                            <div key={course.id} style={{ animationDelay: `${index * 0.1}s` }}>
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </div>

                    <div className="section-cta">
                        <Link to="/student/courses" className="btn btn-primary btn-lg">
                            View All Courses
                            <TrendingUp size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content">
                        <h2>Ready to Start Your Learning Journey?</h2>
                        <p>Join thousands of students already learning on StudyBuddy</p>
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Sign Up Now
                            </Link>
                            <Link to="/login" className="btn btn-outline btn-lg">
                                Log In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <BookOpen size={32} />
                            <h3>StudyBuddy</h3>
                            <p>Where Learning Meets Convenience</p>
                        </div>
                        <div className="footer-links">
                            <div className="footer-column">
                                <h4>Platform</h4>
                                <a href="#courses">Courses</a>
                                <a href="#about">About Us</a>
                                <a href="#contact">Contact</a>
                            </div>
                            <div className="footer-column">
                                <h4>Support</h4>
                                <a href="#help">Help Center</a>
                                <a href="#faq">FAQ</a>
                                <a href="#privacy">Privacy Policy</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>&copy; 2026 StudyBuddy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;