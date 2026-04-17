import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courses as coursesEn } from '../data/courses'
import { courses_vi } from '../data/courses-vi'
import './CourseDetail.css'

function CourseDetail() {
    const { courseCode } = useParams()
    const { t, i18n } = useTranslation()
    const navigate = useNavigate()

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
        { id: 'description', label: t('courseDetail.sectionDescription', 'Course Description') },
        { id: 'outline', label: t('courseDetail.sectionOutline', 'Course Outline') },
        { id: 'strategies', label: t('courseDetail.sectionStrategies', 'Teaching Strategies') },
        { id: 'evaluation', label: t('courseDetail.sectionEvaluation', 'Assessment & Evaluation') },
        { id: 'accommodations', label: t('courseDetail.sectionAccommodations', 'Accommodations') },
        { id: 'resources', label: t('courseDetail.sectionResources', 'Resources') },
        { id: 'faq', label: t('courseDetail.sectionFaqs', 'FAQs') }
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
                        <p className="course-grade">{t('courseDetail.gradeAndDest', 'Grade {{grade}} \u2022 {{destination}} Preparation', { grade: course.grade, destination: course.destination })}</p>
                        <div className="course-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate(`/register?course=${course.code}`)}
                            >
                                {t('courseDetail.registerNow', 'Register Now')}
                            </button>
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
                                <h3>{t('courseDetail.quickNav', 'Quick Navigation')}</h3>
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
                                <h3>{t('courseDetail.quickFacts', 'Quick Facts')}</h3>
                                <ul className="quick-facts">
                                    <li>
                                        <strong>{t('courseDetail.prerequisite', 'Prerequisite:')}</strong>
                                        <span>{course.prerequisite}</span>
                                    </li>
                                    <li>
                                        <strong>{t('courseDetail.creditValue', 'Credit Value:')}</strong>
                                        <span>{t('courseDetail.creditValueAmount', '1.0 Credit')}</span>
                                    </li>
                                    <li>
                                        <strong>{t('courseDetail.hours', 'Hours:')}</strong>
                                        <span>{t('courseDetail.hoursAmount', '110 Hours')}</span>
                                    </li>
                                    <li>
                                        <strong>{t('courseDetail.mode', 'Mode:')}</strong>
                                        <span>{t('courseDetail.modeValue', 'Online, Self-Paced')}</span>
                                    </li>
                                </ul>
                            </div>
                        </aside>

                        {/* Main Content Column */}
                        <div className="course-main">

                            {/* Description */}
                            <div id="description" className="course-section">
                                <h2>{t('courseDetail.descriptionHeading', 'Course Description For {{code}} {{title}}', { code: course.code, title: course.title })}</h2>
                                <div className="section-content">
                                    {course.description.split('\n').map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}

                                    {course.curriculumFocus && (
                                        <div className="curriculum-focus">
                                            <h3>{t('courseDetail.keyFocusAreas', 'Key Focus Areas:')}</h3>
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
                                <h2>{t('courseDetail.outlineHeading', '{{code}} Online Course Outline and Timeline', { code: course.code })}</h2>
                                <div className="section-content">
                                    <p className="mb-4">{t('courseDetail.outlineIntro', 'The table below shows the suggested sequence of course unit delivery, along with the estimated number of hours needed to complete the unit.')}</p>
                                    <div className="outline-table-wrapper">
                                        <table className="outline-table">
                                            <thead>
                                                <tr>
                                                    <th>{t('courseDetail.unitTitle', 'Unit Title')}</th>
                                                    <th className="text-center">{t('courseDetail.hoursColumn', 'Hours')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {course.units.map((unit, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <strong>{t('courseDetail.unitLabel', 'Unit {{num}}:', { num: index + 1 })}</strong> {unit.title}
                                                            {unit.description && <div className="unit-desc">{unit.description}</div>}
                                                        </td>
                                                        <td className="text-center">{unit.hours}</td>
                                                    </tr>
                                                ))}
                                                <tr className="total-row">
                                                    <td><strong>{t('courseDetail.total', 'Total')}</strong></td>
                                                    <td className="text-center"><strong>110</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Strategies */}
                            <div id="strategies" className="course-section">
                                <h2>{t('courseDetail.strategiesHeading', 'Online Teaching and Learning Strategies')}</h2>
                                <div className="section-content">
                                    {course.teachingStrategies ? (
                                        course.teachingStrategies.split('\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))
                                    ) : (
                                        <p>{t('courseDetail.strategiesPlaceholder', 'Information on teaching and learning strategies will be available soon.')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Evaluation */}
                            <div id="evaluation" className="course-section">
                                <h2>{t('courseDetail.evaluationHeading', 'Assessment & Evaluation')}</h2>
                                <div className="section-content">
                                    <div className="evaluation-grid">
                                        <div className="eval-chart-box">
                                            <h3>{t('courseDetail.achievementCategories', 'Achievement Categories')}</h3>
                                            <ul className="eval-list">
                                                <li>{t('courseDetail.categoryKnowledge', 'Knowledge and Understanding')}</li>
                                                <li>{t('courseDetail.categoryCritical', 'Critical Thinking')}</li>
                                                <li>{t('courseDetail.categoryCommunication', 'Communication')}</li>
                                                <li>{t('courseDetail.categoryApplication', 'Application')}</li>
                                            </ul>
                                        </div>
                                        <div className="eval-breakdown-box">
                                            <h3>{t('courseDetail.gradeBreakdown', 'Final Grade Breakdown')}</h3>
                                            <div className="breakdown-visual">
                                                <div className="breakdown-item term">
                                                    <span className="percent">{course.evaluation.termWork}%</span>
                                                    <span className="label">{t('courseDetail.termWork', 'Term Work')}</span>
                                                </div>
                                                <div className="breakdown-item final">
                                                    <span className="percent">{course.evaluation.finalExam}%</span>
                                                    <span className="label">{t('courseDetail.finalEval', 'Final Eval')}</span>
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
                                <h2>{t('courseDetail.accommodationsHeading', 'Special Accommodations for Students with an IEP')}</h2>
                                <div className="section-content">
                                    {course.accommodations ? (
                                        course.accommodations.split('\n').map((para, i) => (
                                            <p key={i}>{para}</p>
                                        ))
                                    ) : (
                                        <p>{t('courseDetail.accommodationsDefault', 'Standard accommodations are available.')}</p>
                                    )}
                                </div>
                            </div>

                            {/* Resources */}
                            <div id="resources" className="course-section">
                                <h2>{t('courseDetail.resourcesHeading', 'Resources')}</h2>
                                <div className="section-content">
                                    <ul className="resources-list">
                                        {course.resources.length > 0 ? (
                                            course.resources.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))
                                        ) : (
                                            <li>{t('courseDetail.noTextbooks', 'No specific textbooks required.')}</li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                            {/* FAQs */}
                            {course.faqs && course.faqs.length > 0 && (
                                <div id="faq" className="course-section">
                                    <h2>{t('courseDetail.faqHeading', '{{code}} Frequently Asked Questions', { code: course.code })}</h2>
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
