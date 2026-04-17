// Curated route list for the UI audit.
// Dynamic routes use one representative param. Portal routes are skipped (require auth).
// Source of truth: src/App.jsx

export const routes = [
    // Static public pages
    { path: '/',                            slug: 'home',                   label: 'Home' },
    { path: '/about',                       slug: 'about',                  label: 'About' },
    { path: '/courses',                     slug: 'courses',                label: 'Courses listing' },
    { path: '/admissions/international',    slug: 'international',          label: 'International students' },
    { path: '/ossd-requirements',           slug: 'ossd',                   label: 'OSSD requirements' },
    { path: '/student-support',             slug: 'student-support',        label: 'Student support' },
    { path: '/faq',                         slug: 'faq',                    label: 'FAQ' },
    { path: '/contact',                     slug: 'contact',                label: 'Contact' },
    { path: '/register',                    slug: 'register',               label: 'Register' },
    { path: '/tuition',                     slug: 'tuition',                label: 'Tuition' },
    { path: '/schedule',                    slug: 'schedule',               label: 'Academic calendar' },
    { path: '/compare',                     slug: 'compare',                label: 'Program compare' },
    { path: '/programs/elementary',         slug: 'elementary',             label: 'Primary foundation' },
    { path: '/programs/middle-school',      slug: 'middle-school',          label: 'Middle school' },
    { path: '/programs/high-school',        slug: 'high-school',            label: 'High school pathways' },

    // Dynamic (representative params)
    { path: '/courses/MHF4U',               slug: 'course-detail',          label: 'Course detail (MHF4U)' },
    { path: '/grade/9',                     slug: 'grade-9',                label: 'Grade 9 (both programs)' },

    // Storefront: academic-prep
    { path: '/academic-prep',               slug: 'academic-prep',          label: 'Academic prep landing' },
    { path: '/academic-prep/grade/9',       slug: 'academic-prep-grade-9',  label: 'Academic prep grade 9' },
    { path: '/academic-prep/course/MHF4U',  slug: 'academic-prep-course',   label: 'Academic prep course' },

    // Storefront: official-ontario
    { path: '/official-ontario',            slug: 'official-ontario',       label: 'Official Ontario landing' },
    { path: '/official-ontario/grade/11',   slug: 'official-ontario-g11',   label: 'Official Ontario grade 11' },
    { path: '/official-ontario/course/MHF4U', slug: 'official-ontario-course', label: 'Official Ontario course' },

    // E-commerce
    { path: '/cart',                        slug: 'cart-empty',             label: 'Cart (empty)' }
]

export const locales = [
    { code: 'en', label: 'English' },
    { code: 'vi', label: 'Vietnamese' }
]
