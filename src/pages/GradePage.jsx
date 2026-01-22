import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useStorefront } from '../context/StorefrontContext'
import { courses as coursesEn } from '../data/courses'
import { formatCurrency } from '../config/pricing'
import './GradePage.css'

function GradePage() {
    const { grade } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { addItem } = useCart()
    const { currentStorefront, availableGrades, subjects, colorScheme, isCredit } = useStorefront()

    const [activeSubject, setActiveSubject] = useState('all')

    // Get courses for this grade and storefront
    const gradeCourses = useMemo(() => {
        // For now, use existing course data for credit courses
        // Non-credit courses would come from a separate data source
        if (isCredit) {
            return Object.values(coursesEn).filter(course => course.grade === grade)
        }

        // Mock non-credit courses based on grade
        const nonCreditCourses = []
        // Elementary grades 1-5: $75/subject, High school grades 6-12: $150/subject
        const gradeNum = parseInt(grade, 10)
        const isElementary = gradeNum >= 1 && gradeNum <= 5
        const basePrice = isElementary ? 75 : 150
        const listPrice = isElementary ? 100 : 200

        subjects.forEach(subject => {
            nonCreditCourses.push({
                id: `nc-g${grade}-${subject.toLowerCase()}`,
                code: `NC-G${grade}-${subject.toUpperCase()}`,
                title: `Grade ${grade} ${subject} Foundations`,
                grade: grade,
                subject: subject,
                storefront: 'non-credit',
                overview: `Build strong ${subject.toLowerCase()} foundations with engaging video lessons and interactive practice activities aligned to the Ontario curriculum.`,
                product: {
                    pricing: {
                        listPrice: listPrice,
                        basePrice: basePrice,
                        currency: 'CAD',
                    }
                },
                delivery: {
                    method: 'self-paced',
                    includes: ['video-lessons', 'practice-activities', 'homework'],
                },
                creditStatus: {
                    isCredit: false,
                    disclaimer: 'This is a non-credit course. No tests, no assessments, no report card, no OSSD credit.',
                },
            })
        })
        return nonCreditCourses
    }, [grade, isCredit, subjects])

    // Filter by subject
    const filteredCourses = useMemo(() => {
        if (activeSubject === 'all') return gradeCourses
        return gradeCourses.filter(course => {
            const courseSubject = course.subject ||
                (course.code?.includes('ENG') ? 'English' :
                 course.code?.includes('M') ? 'Math' :
                 course.code?.includes('S') ? 'Science' : 'Other')
            return courseSubject === activeSubject
        })
    }, [gradeCourses, activeSubject])

    // Calculate bundle price
    const bundlePrice = useMemo(() => {
        const total = gradeCourses.reduce((sum, c) =>
            sum + (c.product?.pricing?.listPrice || 0), 0)
        const discount = isCredit ? 0.15 : 0.20
        return {
            original: total,
            discounted: total * (1 - discount),
            savings: total * discount,
            savingsPercent: Math.round(discount * 100),
        }
    }, [gradeCourses, isCredit])

    const handleAddToCart = (course) => {
        const item = {
            id: course.id || course.code,
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

    const gradeLabel = grade === 'K' ? t('storefront.grade.kindergarten') : `${t('storefront.grade.grade')} ${grade}`

    return (
        <div className="grade-page" style={{ '--storefront-color': colorScheme.primary }}>
            {/* Grade Navigation */}
            <div className="grade-nav-bar">
                <div className="container">
                    <div className="grade-tabs">
                        {availableGrades.map(g => (
                            <Link
                                key={g}
                                to={`/${currentStorefront}/grade/${g}`}
                                className={`grade-tab ${g === grade ? 'active' : ''}`}
                            >
                                {g === 'K' ? 'K' : g}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Hero */}
            <section className="grade-hero">
                <div className="container">
                    <div className="hero-content">
                        <nav className="breadcrumb">
                            <Link to={`/${currentStorefront}`}>
                                {isCredit ? t('storefront.credit.label') : t('storefront.nonCredit.label')}
                            </Link>
                            <span>/</span>
                            <span>{gradeLabel}</span>
                        </nav>
                        <h1>{gradeLabel} {isCredit ? t('storefront.grade.creditCourses') : t('storefront.grade.programs')}</h1>
                        <p className="hero-subtitle">
                            {isCredit
                                ? t('storefront.grade.earnCredits')
                                : t('storefront.grade.buildFoundations')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Subject Tabs */}
            <div className="subject-nav">
                <div className="container">
                    <div className="subject-tabs">
                        <button
                            className={`subject-tab ${activeSubject === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveSubject('all')}
                        >
                            {t('storefront.grade.allSubjects')}
                        </button>
                        {subjects.map(subject => (
                            <button
                                key={subject}
                                className={`subject-tab ${activeSubject === subject ? 'active' : ''}`}
                                onClick={() => setActiveSubject(subject)}
                            >
                                {subject}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grade-content section">
                <div className="container">
                    {/* Bundle Card */}
                    {gradeCourses.length > 1 && (
                        <div className="bundle-card card">
                            <div className="bundle-badge">{t('storefront.grade.completeProgramSave')} {bundlePrice.savingsPercent}%</div>
                            <div className="bundle-info">
                                <h3>{t('storefront.grade.completeProgram')} {gradeLabel} {t('storefront.grade.program')}</h3>
                                <p>
                                    {t('storefront.grade.includesAll')} {subjects.join(', ')} courses
                                    {!isCredit && ` • ${t('storefront.grade.selfPaced')}`}
                                </p>
                            </div>
                            <div className="bundle-pricing">
                                <span className="original-price">
                                    {formatCurrency(bundlePrice.original)}
                                </span>
                                <span className="bundle-price">
                                    {formatCurrency(bundlePrice.discounted)}
                                </span>
                            </div>
                            <button className="btn btn-accent">
                                {t('storefront.grade.addBundle')}
                            </button>
                        </div>
                    )}

                    {/* Courses Grid */}
                    <div className="courses-grid">
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map(course => (
                                <div key={course.code} className="course-card card">
                                    <div className="course-header">
                                        <span className={`storefront-badge ${isCredit ? 'credit' : 'non-credit'}`}>
                                            {isCredit ? t('storefront.credit.labelFull') : t('storefront.nonCredit.label')}
                                        </span>
                                        {course.type && (
                                            <span className="course-type">{course.type}</span>
                                        )}
                                    </div>

                                    <h3 className="course-title">{course.title}</h3>
                                    <p className="course-code">{course.code}</p>

                                    <div className="course-meta">
                                        {isCredit ? (
                                            <>
                                                <span className="meta-item">
                                                    <span className="meta-icon">📹</span>
                                                    {t('storefront.grade.liveOnline')}
                                                </span>
                                                <span className="meta-item">
                                                    <span className="meta-icon">⏰</span>
                                                    6 hrs/week
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="meta-item">
                                                    <span className="meta-icon">🎬</span>
                                                    {t('storefront.grade.videoLessons')}
                                                </span>
                                                <span className="meta-item">
                                                    <span className="meta-icon">✏️</span>
                                                    {t('storefront.grade.practiceActivities')}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {course.prerequisite && (
                                        <p className="course-prereq">
                                            <strong>{t('storefront.grade.prereq')}</strong> {course.prerequisite}
                                        </p>
                                    )}

                                    {!isCredit && (
                                        <p className="course-disclaimer">
                                            {t('storefront.grade.noCredit')}
                                        </p>
                                    )}

                                    <div className="course-pricing">
                                        {!isCredit && course.product?.pricing?.listPrice !== course.product?.pricing?.basePrice && (
                                            <span className="list-price">
                                                {formatCurrency(course.product?.pricing?.listPrice || 0)}
                                            </span>
                                        )}
                                        <span className="current-price">
                                            {formatCurrency(course.product?.pricing?.basePrice || course.product?.pricing?.listPrice || 3000)}
                                        </span>
                                    </div>

                                    <div className="course-actions">
                                        <Link
                                            to={`/${currentStorefront}/course/${course.code}`}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            {t('storefront.grade.viewDetails')}
                                        </Link>
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleAddToCart(course)}
                                        >
                                            {t('storefront.grade.addToCart')}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-courses">
                                <p>{t('storefront.grade.noCourses')}</p>
                            </div>
                        )}
                    </div>

                    {/* Cross-sell */}
                    <div className="cross-sell card">
                        {isCredit ? (
                            <>
                                <span className="cross-sell-icon">💡</span>
                                <div className="cross-sell-content">
                                    <h4>{t('storefront.grade.needPractice')}</h4>
                                    <p>{t('storefront.grade.needPracticeDesc')}</p>
                                </div>
                                <Link to={`/non-credit/grade/${grade}`} className="btn btn-outline">
                                    {t('storefront.grade.viewNonCredit')}
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="cross-sell-icon">🎓</span>
                                <div className="cross-sell-content">
                                    <h4>{t('storefront.grade.readyForCredit')}</h4>
                                    <p>{t('storefront.grade.readyForCreditDesc')}</p>
                                </div>
                                <Link to={`/credit/grade/${grade}`} className="btn btn-outline">
                                    {t('storefront.grade.viewCredit')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GradePage
