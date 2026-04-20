import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useStorefront } from '../context/StorefrontContext'
import { courses as coursesEn } from '../data/courses'
import { formatCurrency, getPricingForGrade } from '../config/pricing'
import './StorefrontCourseDetail.css'

function StorefrontCourseDetail() {
    const { courseCode } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { addItem, items } = useCart()
    const { currentStorefront, colorScheme, isCredit } = useStorefront()

    const [activeTab, setActiveTab] = useState('overview')
    const [openUnit, setOpenUnit] = useState(0)

    // Get course data
    const course = useMemo(() => {
        // For credit courses, use existing data
        if (isCredit && coursesEn[courseCode]) {
            const existing = coursesEn[courseCode]
            const bandPricing = getPricingForGrade(existing.grade)
            const perCourse = bandPricing?.academicOntarioRecord?.selfPaced?.perCourse ?? 400
            return {
                ...existing,
                storefront: 'credit',
                product: {
                    pricing: {
                        listPrice: perCourse,
                        basePrice: perCourse,
                        currency: 'CAD',
                    }
                },
                delivery: {
                    method: 'live-online',
                    platform: 'Zoom',
                    schedule: {
                        hoursPerWeek: 6,
                        daysPerWeek: 3,
                        hoursPerSession: 2,
                    },
                    includes: ['live-sessions', 'video-lessons', 'homework', 'assignments', 'quizzes', 'tests', 'final-exam', 'report-card'],
                },
                creditStatus: {
                    isCredit: true,
                    creditValue: 1,
                    ossdEligible: true,
                },
            }
        }

        // Mock non-credit course
        if (!isCredit && courseCode) {
            const parts = courseCode.split('-')
            const grade = parts[1]?.replace('G', '') || '1'
            const subject = parts[2] || 'MATH'
            const subjectName = subject === 'MATH' ? 'Math' : subject === 'SCI' ? 'Science' : 'English'

            return {
                code: courseCode,
                title: `Grade ${grade} ${subjectName} Foundations`,
                grade: grade,
                subject: subjectName,
                storefront: 'non-credit',
                description: `Build strong ${subjectName.toLowerCase()} foundations with our comprehensive Grade ${grade} program. Engaging video lessons, interactive practice activities, and homework exercises aligned to the Ontario curriculum help students master key concepts at their own pace.`,
                curriculumFocus: [
                    'Core curriculum concepts',
                    'Problem-solving strategies',
                    'Critical thinking skills',
                    'Real-world applications',
                ],
                units: [
                    { title: 'Unit 1: Foundations', hours: 15, description: 'Building core understanding' },
                    { title: 'Unit 2: Core Concepts', hours: 20, description: 'Deep dive into key topics' },
                    { title: 'Unit 3: Practice & Application', hours: 15, description: 'Hands-on practice' },
                    { title: 'Unit 4: Review & Mastery', hours: 10, description: 'Reinforcement and mastery' },
                ],
                product: {
                    pricing: {
                        listPrice: getPricingForGrade(grade)?.nonAcademicOntarioRecord?.perCourse ?? 50,
                        basePrice: getPricingForGrade(grade)?.nonAcademicOntarioRecord?.perCourse ?? 50,
                        currency: 'CAD',
                    }
                },
                delivery: {
                    method: 'self-paced',
                    platform: 'LMS',
                    includes: ['video-lessons', 'practice-activities', 'homework'],
                },
                creditStatus: {
                    isCredit: false,
                    creditValue: 0,
                    ossdEligible: false,
                    disclaimer: 'This is a non-credit course. No tests, no assessments, no report card, no OSSD credit.',
                },
                faqs: [
                    { question: 'Is this a credit course?', answer: 'No, this is a non-credit course for supplementary learning. It does not include assessments, report cards, or OSSD credit.' },
                    { question: 'How long do I have access?', answer: 'You have 12 months access to complete the course at your own pace.' },
                    { question: 'Can I upgrade to credit?', answer: 'Yes, you can upgrade to a credit course and receive a discount based on your non-credit purchase.' },
                ],
            }
        }

        return null
    }, [courseCode, isCredit])

    if (!course) {
        return (
            <div className="course-not-found">
                <div className="container">
                    <h1>{t('storefront.courseDetail.notFound', 'Course Not Found')}</h1>
                    <p>{t('storefront.courseDetail.notFoundDesc', "The course you're looking for doesn't exist.")}</p>
                    <Link to={`/${currentStorefront}`} className="btn btn-primary">
                        {t('storefront.courseDetail.browseCourses', 'Browse Courses')}
                    </Link>
                </div>
            </div>
        )
    }

    const isInCart = items.some(item => item.code === course.code)

    const handleAddToCart = () => {
        const item = {
            id: course.code,
            code: course.code,
            title: course.title,
            grade: course.grade,
            subject: course.subject,
            storefront: currentStorefront,
            price: course.product?.pricing?.basePrice || course.product?.pricing?.listPrice || 0,
            listPrice: course.product?.pricing?.listPrice || 0,
            product: course.product,
        }
        addItem(item, Object.values(coursesEn))
    }

    const tabs = [
        { id: 'overview', label: t('coursePage.sections.overview', 'Overview') },
        { id: 'curriculum', label: t('coursePage.sections.curriculum', 'Curriculum') },
        { id: 'faqs', label: t('coursePage.sections.faqs', 'FAQs') },
    ]

    const gradeLabel = course.grade === 'K' ? t('storefront.courseDetail.kindergarten', 'Kindergarten') : t('nav.gradePrefix', 'Grade') + ' ' + course.grade

    return (
        <div className="course-detail-page" style={{ '--storefront-color': colorScheme.primary }}>
            {/* Hero */}
            <section className="course-hero">
                <div className="container">
                    <nav className="breadcrumb">
                        <Link to={`/${currentStorefront}`}>
                            {isCredit ? t('storefront.courseDetail.creditBreadcrumb', 'Credit') : t('storefront.courseDetail.nonCreditBreadcrumb', 'Non-credit')}
                        </Link>
                        <span>/</span>
                        <Link to={`/${currentStorefront}/grade/${course.grade}`}>
                            {gradeLabel}
                        </Link>
                        <span>/</span>
                        <span>{course.title}</span>
                    </nav>

                    <div className="hero-content">
                        <div className="hero-main">
                            <div className="hero-badges">
                                <span className={`storefront-badge ${isCredit ? 'credit' : 'non-credit'}`}>
                                    {isCredit ? t('storefront.courseDetail.ontarioCreditBadge', 'Ontario Credit') : t('storefront.courseDetail.nonCreditBadge', 'Non-credit')}
                                </span>
                                {course.type && (
                                    <span className="course-type-badge">{course.type}</span>
                                )}
                            </div>

                            <h1>{course.title}</h1>
                            <p className="course-code-display">{course.code} • {gradeLabel}</p>

                            {isCredit ? (
                                <p className="credit-assurance">
                                    {t('storefront.courseDetail.creditAssurance', 'This course awards 1.0 Ontario high school credit upon successful completion. Transcripts and report cards provided.')}
                                </p>
                            ) : (
                                <div className="non-credit-disclaimer">
                                    <span className="disclaimer-icon">ℹ️</span>
                                    <p>{course.creditStatus?.disclaimer}</p>
                                </div>
                            )}

                            <div className="quick-facts">
                                {isCredit && (
                                    <>
                                        <div className="fact">
                                            <span className="fact-icon">📅</span>
                                            <span className="fact-label">{t('storefront.courseDetail.factSchedule', 'Schedule')}</span>
                                            <span className="fact-value">{course.delivery?.schedule?.hoursPerWeek || 6} {t('storefront.courseDetail.hrsPerWeek', 'hrs/week')}</span>
                                        </div>
                                        <div className="fact">
                                            <span className="fact-icon">📹</span>
                                            <span className="fact-label">{t('storefront.courseDetail.factDelivery', 'Delivery')}</span>
                                            <span className="fact-value">{t('storefront.courseDetail.liveOnlineZoom', 'Live online (Zoom)')}</span>
                                        </div>
                                        <div className="fact">
                                            <span className="fact-icon">🎓</span>
                                            <span className="fact-label">{t('storefront.courseDetail.factCredit', 'Credit')}</span>
                                            <span className="fact-value">{t('storefront.courseDetail.oneOntarioCredit', '1.0 Ontario Credit')}</span>
                                        </div>
                                    </>
                                )}
                                {!isCredit && (
                                    <>
                                        <div className="fact">
                                            <span className="fact-icon">🎬</span>
                                            <span className="fact-label">{t('storefront.courseDetail.factFormat', 'Format')}</span>
                                            <span className="fact-value">{t('storefront.courseDetail.videoPlusPractice', 'Video + Practice')}</span>
                                        </div>
                                        <div className="fact">
                                            <span className="fact-icon">⏰</span>
                                            <span className="fact-label">{t('storefront.courseDetail.factPace', 'Pace')}</span>
                                            <span className="fact-value">{t('storefront.courseDetail.selfPaced', 'Self-paced')}</span>
                                        </div>
                                        <div className="fact">
                                            <span className="fact-icon">📆</span>
                                            <span className="fact-label">{t('storefront.courseDetail.factAccess', 'Access')}</span>
                                            <span className="fact-value">{t('storefront.courseDetail.twelveMonths', '12 months')}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Pricing Sidebar */}
                        <div className="pricing-card card">
                            <div className="pricing-header">
                                {!isCredit && course.product?.pricing?.listPrice !== course.product?.pricing?.basePrice && (
                                    <span className="list-price">
                                        {formatCurrency(course.product?.pricing?.listPrice)}
                                    </span>
                                )}
                                <span className="current-price">
                                    {formatCurrency(course.product?.pricing?.basePrice || course.product?.pricing?.listPrice)}
                                </span>
                                <span className="price-currency">CAD</span>
                            </div>

                            {isCredit && (
                                <div className="bonus-banner">
                                    <span className="bonus-icon">🎁</span>
                                    <span>{t('coursePage.bonusText', 'FREE: Practice course included')}</span>
                                </div>
                            )}

                            <div className="included-list">
                                <h4>{t('storefront.courseDetail.whatsIncluded', "What's Included:")}</h4>
                                <ul>
                                    {course.delivery?.includes?.map((item, index) => (
                                        <li key={index}>
                                            <span className="check">✓</span>
                                            {item.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {course.prerequisite && (
                                <div className="prereq-info">
                                    <strong>{t('storefront.courseDetail.prerequisite', 'Prerequisite:')}</strong> {course.prerequisite}
                                </div>
                            )}

                            <div className="cta-buttons">
                                {isInCart ? (
                                    <Link to="/cart" className="btn btn-accent btn-lg btn-block">
                                        {t('storefront.courseDetail.viewCart', 'View Cart')}
                                    </Link>
                                ) : (
                                    <button
                                        className="btn btn-accent btn-lg btn-block"
                                        onClick={handleAddToCart}
                                    >
                                        {t('storefront.courseDetail.addToCart', 'Add to Cart')}
                                    </button>
                                )}
                                <Link to="/contact" className="btn btn-outline btn-block">
                                    {t('storefront.courseDetail.haveQuestions', 'Have Questions?')}
                                </Link>
                            </div>

                            {!isCredit && (
                                <div className="upgrade-link">
                                    <Link to={`/credit/grade/${course.grade}`}>
                                        {t('storefront.courseDetail.upgradeToCreditCourse', 'Upgrade to Credit Course →')}
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs Navigation */}
            <div className="tabs-nav">
                <div className="container">
                    <div className="tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content */}
            <section className="tab-content section">
                <div className="container">
                    {activeTab === 'overview' && (
                        <div className="overview-content">
                            <div className="main-content">
                                <h2>{t('storefront.courseDetail.courseOverview', 'Course Overview')}</h2>
                                <p className="description">{course.description}</p>

                                {course.curriculumFocus && (
                                    <div className="learning-outcomes">
                                        <h3>{t('storefront.courseDetail.whatYoullLearn', "What You'll Learn")}</h3>
                                        <ul className="outcomes-list">
                                            {course.curriculumFocus.map((item, index) => (
                                                <li key={index}>
                                                    <span className="check">✓</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {course.teachingStrategies && (
                                    <div className="teaching-strategies">
                                        <h3>{t('storefront.courseDetail.teachingApproach', 'Teaching Approach')}</h3>
                                        <p>{course.teachingStrategies.substring(0, 500)}...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'curriculum' && (
                        <div className="curriculum-content">
                            <h2>{t('storefront.courseDetail.courseCurriculum', 'Course Curriculum')}</h2>
                            <div className="units-accordion">
                                {course.units?.map((unit, index) => (
                                    <div key={index} className={`unit-item ${openUnit === index ? 'open' : ''}`}>
                                        <button
                                            className="unit-header"
                                            onClick={() => setOpenUnit(openUnit === index ? -1 : index)}
                                        >
                                            <div className="unit-info">
                                                <span className="unit-number">{t('storefront.courseDetail.unit', 'Unit')} {index + 1}</span>
                                                <span className="unit-title">{unit.title}</span>
                                            </div>
                                            <div className="unit-meta">
                                                {unit.hours && <span className="unit-hours">{unit.hours} {t('storefront.courseDetail.hours', 'hours')}</span>}
                                                <span className={`unit-arrow ${openUnit === index ? 'open' : ''}`}>
                                                    ▼
                                                </span>
                                            </div>
                                        </button>
                                        {openUnit === index && (
                                            <div className="unit-content">
                                                <p>{unit.description}</p>
                                                {unit.topics && (
                                                    <ul className="topic-list">
                                                        {unit.topics.map((topic, i) => (
                                                            <li key={i}>{topic}</li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'faqs' && (
                        <div className="faqs-content">
                            <h2>{t('storefront.courseDetail.faqTitle', 'Frequently Asked Questions')}</h2>
                            <div className="faqs-list">
                                {course.faqs?.map((faq, index) => (
                                    <div key={index} className="faq-item card">
                                        <h4>{faq.question}</h4>
                                        <p>{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Related Courses CTA */}
            <section className="related-cta section bg-light">
                <div className="container">
                    <div className="cta-card card">
                        <h3>{t('storefront.courseDetail.exploreMore', 'Explore More {{gradeLabel}} Courses', { gradeLabel })}</h3>
                        <p>{t('storefront.courseDetail.viewAllDesc', 'View all available {{type}} courses for this grade.', { type: isCredit ? t('storefront.courseDetail.creditType', 'credit') : t('storefront.courseDetail.nonCreditType', 'non-credit') })}</p>
                        <Link to={`/${currentStorefront}/grade/${course.grade}`} className="btn btn-primary">
                            {t('storefront.courseDetail.viewAll', 'View All {{gradeLabel}} Courses', { gradeLabel })}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default StorefrontCourseDetail
