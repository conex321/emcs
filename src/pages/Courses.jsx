import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { courses as coursesEn } from '../data/courses'
import { courses_vi } from '../data/courses-vi'
import './Courses.css'

function Courses() {
    const { t, i18n } = useTranslation()
    const [activeGrade, setActiveGrade] = useState('12')
    const grades = ['12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1']

    // Group courses by grade dynamically from the data
    const coursesByGrade = useMemo(() => {
        const coursesData = i18n.language === 'vi' ? courses_vi : coursesEn
        const grouped = {
            '12': [],
            '11': [],
            '10': [],
            '9': [],
            '8': [],
            '7': [],
            '6': [],
            '5': [],
            '4': [],
            '3': [],
            '2': [],
            '1': []
        }

        Object.values(coursesData).forEach(course => {
            if (grouped[course.grade]) {
                grouped[course.grade].push(course)
            }
        })

        return grouped
    }, [i18n.language]) // Re-run when language changes

    return (
        <div className="courses-page">
            {/* Hero */}
            <section className="courses-hero">
                <div className="container">
                    <h1>{t('courses.title')}</h1>
                    <p>{t('courses.subtitle')}</p>
                </div>
            </section>

            {/* Programs Overview */}
            <section className="programs-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Academic Programs</h2>
                    </div>
                    <div className="programs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                        <div className="program-card card">
                            <h3>OSSD Program</h3>
                            <p>Ontario Secondary School Diploma credits for Grades 9-12.</p>
                        </div>
                        <div className="program-card card">
                            <h3>IB Diploma Programme</h3>
                            <p>International Baccalaureate World School authorized program.</p>
                        </div>
                        <div className="program-card card">
                            <h3>AP (Advanced Placement)</h3>
                            <p>College-level courses to prepare for university success.</p>
                        </div>
                        <div className="program-card card">
                            <h3>EMC English</h3>
                            <p>ESL and IELTS preparation courses for international students.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grade Tabs */}
            <section className="courses-content section">
                <div className="container">
                    <div className="grade-tabs">
                        {grades.map(grade => (
                            <button
                                key={grade}
                                className={`grade-tab ${activeGrade === grade ? 'active' : ''}`}
                                onClick={() => setActiveGrade(grade)}
                            >
                                {t(`courses.grade${grade}`)}
                            </button>
                        ))}
                    </div>

                    <div className="courses-grid">
                        {coursesByGrade[activeGrade].length > 0 ? (
                            coursesByGrade[activeGrade].map((course, index) => (
                                <Link to={`/courses/${course.code}`} key={course.code} className="course-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className="course-header">
                                        <span className="course-code">{course.code}</span>
                                        <span className={`course-type type-${course.type ? course.type.toLowerCase().split('/')[0].replace(/\s+/g, '-') : 'academic'}`}>
                                            {course.type}
                                        </span>
                                    </div>
                                    <h3 className="course-name">{course.title}</h3>
                                    <div className="course-meta">
                                        <span className="course-prereq">
                                            <strong>{t('courses.prereq')}:</strong> {course.prerequisite || 'None'}
                                        </span>
                                    </div>
                                    <div className="course-actions">
                                        <button className="btn btn-secondary btn-sm">{t('courses.viewOutline')}</button>
                                        <button className="btn btn-primary btn-sm">{t('courses.addToCart')}</button>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="no-courses">
                                <p>No courses currently listed for Grade {activeGrade}. Please check back soon.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Courses
