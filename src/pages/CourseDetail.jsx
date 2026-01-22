import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courses as coursesEn } from '../data/courses'
import { courses_vi } from '../data/courses-vi'
import './CourseDetail.css'

function CourseDetail() {
    const { courseCode } = useParams()
    const { t, i18n } = useTranslation()

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [courseCode])

    const coursesData = i18n.language === 'vi' ? courses_vi : coursesEn
    const course = coursesData[courseCode]

    if (!course) {
        return (
            <div className="course-not-found">
                <div className="container">
                    <h1>{t('courses.notFound', 'Course Not Found')}</h1>
                    <p>{t('courses.notFoundDesc', `The course code "${courseCode}" does not exist in our catalog.`)}</p>
                    <Link to="/courses" className="btn btn-primary">{t('courses.back', 'Back to Courses')}</Link>
                </div>
            </div>
        )
    }

    const sections = [
        { id: 'description', label: 'Course Description' },
        { id: 'outline', label: 'Course Outline' },
        { id: 'strategies', label: 'Teaching Strategies' },
        { id: 'evaluation', label: 'Assessment & Evaluation' },
        { id: 'accommodations', label: 'Accommodations' },
        { id: 'resources', label: 'Resources' },
        { id: 'faq', label: 'FAQs' }
    ]

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Adjust for sticky header/sidebar
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }

    return (
        <div className="course-detail-page">
            {/* Hero Section */}
            <section className="course-hero">
                <div className="container">
                    <div className="course-hero-content">
                        <span className="course-badge">{course.type}</span>
                        <h1>{course.title} <span className="text-highlight">({course.code})</span></h1>
                        <p className="course-grade">Grade {course.grade} • {course.destination} Preparation</p>
                        <div className="course-actions">
                            <button className="btn btn-primary">Register Now</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="course-content section">
                <div className="container">
                    <div className="course-layout">
                        {/* Sidebar / Navigation */}
                        <aside className="course-sidebar">
                            <div className="sidebar-card nav-card">
                                <h3>Quick Navigation</h3>
                                <ul className="course-nav">
                                    {sections.map(section => (
                                        <li key={section.id}>
                                            <button onClick={() => scrollToSection(section.id)}>
                                                {section.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="sidebar-card info-card">
                                <h3>Quick Facts</h3>
                                <ul className="quick-facts">
                                    <li>
                                        <strong>Prerequisite:</strong>
                                        <span>{course.prerequisite}</span>
                                    </li>
                                    <li>
                                        <strong>Credit Value:</strong>
                                        <span>1.0 Credit</span>
                                    </li>
                                    <li>
                                        <strong>Hours:</strong>
                                        <span>110 Hours</span>
                                    </li>
                                    <li>
                                        <strong>Mode:</strong>
                                        <span>Online, Self-Paced</span>
                                    </li>
                                </ul>
                            </div>
                        </aside>

                        {/* Main Content Column */}
                        <div className="course-main">

                            {/* Description */}
                            <div id="description" className="course-section">
                                <h2>Course Description For {course.code} {course.title}</h2>
                                <div className="section-content">
                                    {course.description.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}

                                    {course.curriculumFocus && (
                                        <div className="curriculum-focus">
                                            <h3>key Focus Areas:</h3>
                                            <ul className="learning-list">
                                                {course.curriculumFocus.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Outline */}
                            <div id="outline" className="course-section">
                                <h2>{course.code} Online Course Outline and Timeline</h2>
                                <div className="section-content">
                                    <p className="mb-4">The table below shows the suggested sequence of course unit delivery, along with the estimated number of hours needed to complete the unit.</p>
                                    <div className="outline-table-wrapper">
                                        <table className="outline-table">
                                            <thead>
                                                <tr>
                                                    <th>Unit Title</th>
                                                    <th className="text-center">Hours</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {course.units.map((unit, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <strong>Unit {index + 1}:</strong> {unit.title}
                                                            {unit.description && <div className="unit-desc">{unit.description}</div>}
                                                        </td>
                                                        <td className="text-center">{unit.hours}</td>
                                                    </tr>
                                                ))}
                                                <tr className="total-row">
                                                    <td><strong>Total</strong></td>
                                                    <td className="text-center"><strong>110</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Strategies */}
                            <div id="strategies" className="course-section">
                                <h2>Online Teaching and Learning Strategies</h2>
                                <div className="section-content">
                                    {course.teachingStrategies ? (
                                        course.teachingStrategies.split('\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))
                                    ) : (
                                        <p>Information on teaching and learning strategies will be available soon.</p>
                                    )}
                                </div>
                            </div>

                            {/* Evaluation */}
                            <div id="evaluation" className="course-section">
                                <h2>Assessment & Evaluation</h2>
                                <div className="section-content">
                                    <div className="evaluation-grid">
                                        <div className="eval-chart-box">
                                            <h3>Achievement Categories</h3>
                                            <ul className="eval-list">
                                                <li>Knowledge and Understanding</li>
                                                <li>Critical Thinking</li>
                                                <li>Communication</li>
                                                <li>Application</li>
                                            </ul>
                                        </div>
                                        <div className="eval-breakdown-box">
                                            <h3>Final Grade Breakdown</h3>
                                            <div className="breakdown-visual">
                                                <div className="breakdown-item term">
                                                    <span className="percent">{course.evaluation.termWork}%</span>
                                                    <span className="label">Term Work</span>
                                                </div>
                                                <div className="breakdown-item final">
                                                    <span className="percent">{course.evaluation.finalExam}%</span>
                                                    <span className="label">Final Eval</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {course.evaluation.description && (
                                        <div className="mt-4">
                                            {course.evaluation.description.split('\n').map((para, i) => (
                                                <p key={i}>{para}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Accommodations */}
                            <div id="accommodations" className="course-section">
                                <h2>Special Accommodations for Students with an IEP</h2>
                                <div className="section-content">
                                    {course.accommodations ? (
                                        course.accommodations.split('\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))
                                    ) : (
                                        <p>Standard accommodations are available.</p>
                                    )}
                                </div>
                            </div>

                            {/* Resources */}
                            <div id="resources" className="course-section">
                                <h2>Resources</h2>
                                <div className="section-content">
                                    <ul className="resources-list">
                                        {course.resources.length > 0 ? (
                                            course.resources.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))
                                        ) : (
                                            <li>No specific textbooks required.</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* FAQs */}
                            {course.faqs && course.faqs.length > 0 && (
                                <div id="faq" className="course-section">
                                    <h2>{course.code} Frequently Asked Questions</h2>
                                    <div className="section-content">
                                        <div className="faq-grid">
                                            {course.faqs.map((faq, index) => (
                                                <div key={index} className="faq-card">
                                                    <h3>{faq.question}</h3>
                                                    <p>{faq.answer}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CourseDetail
