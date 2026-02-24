

export const mockUsers = {
    students: [
        {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            password: 'student123',
            enrolledCourses: [1, 2],
            completedLessons: [1, 2],
            quizScores: [
                { quizId: 1, score: 85, date: '2026-01-15' },
                { quizId: 2, score: 92, date: '2026-01-20' }
            ],
            certificates: []
        }
    ],
    instructors: [
        {
            id: 1,
            name: 'T. JinChun Lu',
            email: 'jinchun@example.com',
            password: 'instructor123',
            courses: [1, 2]
        }
    ],
    admins: [
        {
            id: 1,
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123'
        }
    ]
};

export const mockCourses = [
    {
        id: 1,
        title: 'Introduction to Web Development',
        description: 'Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.',
        instructor: 'T. JinChun Lu',
        instructorId: 1,
        category: 'Programming',
        level: 'Beginner',
        duration: '8 weeks',
        price: 0,
        rating: 4.8,
        students: 1250,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
        lessons: [
            {
                id: 1,
                title: 'HTML Basics',
                description: 'Introduction to HTML structure and elements',
                duration: '45 min',
                content: 'Learn about HTML tags, attributes, and document structure...',
                videoUrl: '#'
            },
            {
                id: 2,
                title: 'CSS Fundamentals',
                description: 'Styling web pages with CSS',
                duration: '60 min',
                content: 'Master CSS selectors, properties, and layout techniques...',
                videoUrl: '#'
            },
            {
                id: 3,
                title: 'JavaScript Introduction',
                description: 'Getting started with JavaScript programming',
                duration: '75 min',
                content: 'Learn variables, functions, and basic programming concepts...',
                videoUrl: '#'
            }
        ],
        quizzes: [
            {
                id: 1,
                title: 'HTML Quiz',
                questions: [
                    {
                        id: 1,
                        question: 'What does HTML stand for?',
                        options: [
                            'Hyper Text Markup Language',
                            'High Tech Modern Language',
                            'Home Tool Markup Language',
                            'Hyperlinks and Text Markup Language'
                        ],
                        correctAnswer: 0
                    },
                    {
                        id: 2,
                        question: 'Which HTML tag is used for the largest heading?',
                        options: ['<head>', '<h6>', '<h1>', '<heading>'],
                        correctAnswer: 2
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        title: 'Data Science with Python',
        description: 'Master data analysis, visualization, and machine learning with Python.',
        instructor: 'T. JinChun Lu',
        instructorId: 1,
        category: 'Data Science',
        level: 'Intermediate',
        duration: '12 weeks',
        price: 79.99,
        rating: 4.9,
        students: 890,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
        lessons: [
            {
                id: 4,
                title: 'Python Basics for Data Science',
                description: 'Essential Python concepts',
                duration: '50 min',
                content: 'Learn Python fundamentals for data analysis...',
                videoUrl: '#'
            },
            {
                id: 5,
                title: 'Data Analysis with Pandas',
                description: 'Working with data frames',
                duration: '90 min',
                content: 'Master Pandas library for data manipulation...',
                videoUrl: '#'
            }
        ],
        quizzes: [
            {
                id: 2,
                title: 'Python Fundamentals Quiz',
                questions: [
                    {
                        id: 1,
                        question: 'Which library is commonly used for data manipulation in Python?',
                        options: ['NumPy', 'Pandas', 'Matplotlib', 'All of the above'],
                        correctAnswer: 3
                    }
                ]
            }
        ]
    },
    // {
    //     id: 3,
    //     title: 'Digital Marketing Masterclass',
    //     description: 'Learn SEO, social media marketing, and content strategy.',
    //     instructor: 'Marketing Expert',
    //     instructorId: 1,
    //     category: 'Marketing',
    //     level: 'Beginner',
    //     duration: '6 weeks',
    //     price: 0,
    //     rating: 4.6,
    //     students: 2100,
    //     image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    //     lessons: [],
    //     quizzes: []
    // },
    // {
    //     id: 4,
    //     title: 'UI/UX Design Fundamentals',
    //     description: 'Create beautiful and user-friendly interfaces.',
    //     instructor: 'Design Pro',
    //     instructorId: 1,
    //     category: 'Design',
    //     level: 'Beginner',
    //     duration: '10 weeks',
    //     price: 59.99,
    //     rating: 4.7,
    //     students: 1500,
    //     image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    //     lessons: [],
    //     quizzes: []
    // }

    {
        id: 3,
        title: 'Digital Marketing Masterclass',
        description: 'Learn SEO, social media marketing, and content strategy.',
        instructor: 'T. JinChun Lu',
        instructorId: 1,
        category: 'Marketing',
        level: 'Beginner',
        duration: '6 weeks',
        price: 0,
        rating: 4.6,
        students: 2100,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
        lessons: [
            {
                id: 6,
                title: 'Introduction to Digital Marketing',
                description: 'Overview of digital marketing channels',
                duration: '40 min',
                content: 'Learn what digital marketing is and why it matters...',
                videoUrl: '#'
            },
            {
                id: 7,
                title: 'SEO Basics',
                description: 'Search engine optimization fundamentals',
                duration: '60 min',
                content: 'Understand keywords, on-page SEO, and ranking factors...',
                videoUrl: '#'
            },
            {
                id: 8,
                title: 'Social Media Marketing',
                description: 'Marketing on social platforms',
                duration: '50 min',
                content: 'Learn strategies for Facebook, Instagram, and TikTok...',
                videoUrl: '#'
            }
        ],
        quizzes: [
            {
                id: 3,
                title: 'Digital Marketing Basics Quiz',
                questions: [
                    {
                        id: 1,
                        question: 'What does SEO stand for?',
                        options: [
                            'Search Engine Optimization',
                            'Social Engagement Optimization',
                            'System Engine Output',
                            'Search Experience Operation'
                        ],
                        correctAnswer: 0
                    },
                    {
                        id: 2,
                        question: 'Which platform is best for visual marketing?',
                        options: ['LinkedIn', 'Twitter', 'Instagram', 'Reddit'],
                        correctAnswer: 2
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        title: 'UI/UX Design Fundamentals',
        description: 'Create visually appealing and user-friendly interfaces that are easy to navigate.',
        instructor: 'T. JinChun Lu',
        instructorId: 1,
        category: 'Design',
        level: 'Beginner',
        duration: '10 weeks',
        price: 59.99,
        rating: 4.7,
        students: 1500,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
        lessons: [
            {
                id: 9,
                title: 'Introduction to UI/UX',
                description: 'Understanding UI vs UX',
                duration: '45 min',
                content: 'Learn the difference between UI and UX design...',
                videoUrl: '#'
            },
            {
                id: 10,
                title: 'User Research',
                description: 'Understanding user needs',
                duration: '60 min',
                content: 'Learn personas, surveys, and usability testing...',
                videoUrl: '#'
            },
            {
                id: 11,
                title: 'Wireframing & Prototyping',
                description: 'Designing layouts and flows',
                duration: '75 min',
                content: 'Create wireframes and interactive prototypes...',
                videoUrl: '#'
            }
        ],
        quizzes: [
            {
                id: 4,
                title: 'UI/UX Fundamentals Quiz',
                questions: [
                    {
                        id: 1,
                        question: 'What does UX stand for?',
                        options: [
                            'User Experience',
                            'User Extension',
                            'Unified Experience',
                            'User Execution'
                        ],
                        correctAnswer: 0
                    }
                ]
            }
        ]
    },
    {
        id: 5,
        title: 'Mobile App Development',
        description: 'Build cross-platform mobile apps using React Native.',
        instructor: 'T. JinChun Lu',
        instructorId: 1,
        category: 'Programming',
        level: 'Intermediate',
        duration: '10 weeks',
        price: 69.99,
        rating: 4.8,
        students: 980,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
        lessons: [
            {
                id: 12,
                title: 'React Native Basics',
                description: 'Getting started with React Native',
                duration: '60 min',
                content: 'Learn components, styling, and navigation...',
                videoUrl: '#'
            }
        ],
        quizzes: []
    },
    {
        id: 6,
        title: 'Database System with PostgreSQL',
        description: 'Learn relational database design and SQL using PostgreSQL.',
        instructor: 'T. JinChun Lu',
        instructorId: 1,
        category: 'Data Science',
        level: 'Intermediate',
        duration: '8 weeks',
        price: 0,
        rating: 4.9,
        students: 1120,
        image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
        lessons: [
            {
                id: 13,
                title: 'Relational Database Basics',
                description: 'Tables, keys, and relationships',
                duration: '70 min',
                content: 'Learn primary keys, foreign keys, and normalization...',
                videoUrl: '#'
            }
        ],
        quizzes: []
    },
    {
        id: 7,
        title: 'Software Project Management',
        description: 'Manage software projects using Agile and Scrum.',
        instructor: 'T. JinChun Lu',
        instructorId: 1,
        category: 'Business',
        level: 'Beginner',
        duration: '6 weeks',
        price: 39.99,
        rating: 4.5,
        students: 760,
        image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400',
        lessons: [
            {
                id: 14,
                title: 'Agile Fundamentals',
                description: 'Introduction to Agile methodology',
                duration: '50 min',
                content: 'Learn Scrum, sprints, and standups...',
                videoUrl: '#'
            }
        ],
        quizzes: []
    }
];

export const mockCategories = [
    { id: 1, name: 'Programming', count: 45 },
    { id: 2, name: 'Data Science', count: 32 },
    { id: 3, name: 'Marketing', count: 28 },
    { id: 4, name: 'Design', count: 38 },
    { id: 5, name: 'Business', count: 25 },
    { id: 6, name: 'Photography', count: 18 }
];

export const mockQuestions = [
    {
        id: 1,
        studentId: 1,
        studentName: 'John Doe',
        courseId: 1,
        courseName: 'Introduction to Web Development',
        question: 'How do I center a div in CSS?',
        date: '2026-01-25',
        status: 'pending',
        answer: null
    },
    {
        id: 2,
        studentId: 1,
        studentName: 'John Doe',
        courseId: 1,
        courseName: 'Introduction to Web Development',
        question: 'What is the difference between padding and margin?',
        date: '2026-01-20',
        status: 'answered',
        answer: 'Padding is the space inside an element, while margin is the space outside an element.'
    }
];

export const mockReports = [
    {
        id: 1,
        type: 'technical',
        userId: 1,
        userName: 'John Doe',
        subject: 'Video not loading in Lesson 3',
        description: 'The video in lesson 3 keeps buffering and won\'t play.',
        date: '2026-01-26',
        status: 'pending'
    },
    {
        id: 2,
        type: 'content',
        userId: 1,
        userName: 'John Doe',
        subject: 'Video buffering',
        description: 'The video in lesson 5 keeps buffering.',
        date: '2026-01-24',
        status: 'resolved'
    }
];

export const mockSystemStats = {
    totalUsers: 5240,
    totalCourses: 156,
    totalEnrollments: 12480,
    activeUsers: 3890,
    revenue: 124560,
    completionRate: 68
};

// Helper functions for authentication (mock)
export const authenticateUser = (email, password, role) => {
    const users = mockUsers[role + 's'] || [];
    return users.find(u => u.email === email && u.password === password);
};

export const getCourseById = (id) => {
    return mockCourses.find(c => c.id === parseInt(id));
};

export const getEnrolledCourses = (studentId) => {
    const student = mockUsers.students.find(s => s.id === studentId);
    if (!student) return [];
    return mockCourses.filter(c => student.enrolledCourses.includes(c.id));
};

export const getInstructorCourses = (instructorId) => {
    return mockCourses.filter(c => c.instructorId === instructorId);
};

export const getStudentProgress = (studentId, courseId) => {
    const student = mockUsers.students.find(s => s.id === studentId);
    const course = getCourseById(courseId);

    if (!student || !course) return { completed: 0, total: 0, percentage: 0 };

    const completedLessons = course.lessons.filter(l =>
        student.completedLessons.includes(l.id)
    ).length;

    const totalLessons = course.lessons.length;
    const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    return {
        completed: completedLessons,
        total: totalLessons,
        percentage: Math.round(percentage)
    };
};

export const getQuizResults = (studentId, quizId) => {
    const student = mockUsers.students.find(s => s.id === studentId);
    return student?.quizScores.find(q => q.quizId === quizId);
};