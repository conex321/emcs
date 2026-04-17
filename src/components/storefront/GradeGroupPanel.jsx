import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPricingForGrade } from '../../config/pricing'
import ScheduleStrip from './ScheduleStrip'
import './GradeGroupPanel.css'

const GROUP_GRADES = {
    elementary: ['1', '2', '3', '4', '5'],
    middle: ['6', '7', '8'],
    high: ['9', '10', '11', '12'],
}

const GROUP_LABELS = {
    elementary: { key: 'storefronts.gradeGroup.elementary.title', fallback: 'Elementary (Grades 1 to 5)' },
    middle: { key: 'storefronts.gradeGroup.middle.title', fallback: 'Middle School (Grades 6 to 8)' },
    high: { key: 'storefronts.gradeGroup.high.title', fallback: 'High School (Grades 9 to 12)' },
}

/**
 * GradeGroupPanel — v2 shared two-column layout.
 *
 * Renders the "Academic Preparation Program (Non-Ontario student record)"
 * alongside "UPGRADE to Official Ontario Program (Ontario student record)"
 * with subject table, pricing, fees, and primary CTAs.
 *
 * Used by:
 * - /academic-prep/group/:groupSlug and /official-ontario/group/:groupSlug
 * - Embedded in /programs/middle-school and /programs/high-school
 * - Embedded in /academic-prep and /official-ontario landing pages
 *
 * Props:
 * - groupSlug: 'elementary' | 'middle' | 'high'
 * - context: 'academic-prep' | 'official-ontario' | 'both' (default: 'both')
 */
function GradeGroupPanel({ groupSlug = 'elementary', context = 'both' }) {
    const { t } = useTranslation()
    const navigate = useNavigate()

    const grades = GROUP_GRADES[groupSlug] || GROUP_GRADES.elementary
    const firstGrade = grades[0]
    const representativePricing = getPricingForGrade(firstGrade)
    const isHighSchool = groupSlug === 'high'

    if (!representativePricing) return null

    const groupLabel = t(GROUP_LABELS[groupSlug].key, GROUP_LABELS[groupSlug].fallback)

    // K–8 subject list (unused for HS where we switch to a course-count narrative)
    const subjects = representativePricing.subjects || [
        'Mathematics', 'Language', 'The Arts',
        'Science & Technology', 'Health & Physical Education', 'Social Studies'
    ]

    const perCourseList = representativePricing.academicPrep?.listPrice || 150
    const perCourseSale = representativePricing.academicPrep?.salePrice || 75
    const fullYear = representativePricing.academicPrep?.fullYear || 325
    const upgradePerCourse = representativePricing.officialOntario?.perCourse || 250
    const upgradeFullYear = representativePricing.officialOntario?.fullYear || 600
    // HS-specific values
    const hsCreditCount = representativePricing.timetable?.officialOntario?.totalCredits
    const hsDiscountTuition = representativePricing.timetable?.officialOntario?.discountTuition

    return (
        <div className="grade-group-panel">
            <div className="grade-group-panel__header">
                <h2 className="grade-group-panel__title">{groupLabel}</h2>
                <p className="grade-group-panel__taglines">
                    {t('storefronts.learnFirst', 'Learn First.')}{' '}
                    {t('storefronts.decideLater', 'Decide Later.')}{' '}
                    {t('storefronts.succeedSafely', 'Succeed Safely.')}
                </p>
            </div>

            <div className="grade-group-panel__columns">
                {/* LEFT: Academic Preparation Program */}
                <div className="grade-group-panel__col grade-group-panel__col--left">
                    <div className="grade-group-panel__col-header">
                        <span className="grade-group-panel__dot" style={{ background: '#2F80ED' }}></span>
                        <h3>{t('storefronts.gradeGroupPanel.leftHeading', 'Academic Preparation Program (Non-Ontario student record)')}</h3>
                    </div>

                    <p className="grade-group-panel__description">
                        {t('storefronts.gradeGroupPanel.leftDescription')}
                    </p>

                    {isHighSchool ? (
                        <div className="grade-group-panel__hs-summary">
                            <p>
                                Grades 9–10 deliver the <strong>8-credit one-year program</strong>;
                                Grades 11–12 deliver the <strong>7-credit one-year program</strong>.
                                Each course is self-paced via the LMS Platform with no Ontario student record.
                            </p>
                            <p>
                                View the full per-grade course codes (ENG1D, MTH1W, SNC1W, …) and 50% sale pricing on any
                                Grade 9–12 detail page below.
                            </p>
                        </div>
                    ) : (
                        <table className="grade-group-panel__subjects-table">
                            <thead>
                                <tr>
                                    <th>{t('storefronts.gradeGroupPanel.subjectHeader', 'Subject')}</th>
                                    <th>{t('storefronts.gradeGroupPanel.languageHeader', 'Language')}</th>
                                    <th>{t('storefronts.gradeGroupPanel.deliveryHeader', 'Delivery Method')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.map(subject => (
                                    <tr key={subject}>
                                        <td>{subject}</td>
                                        <td>{t('storefronts.gradeGroupPanel.english', 'English')}</td>
                                        <td>{t('storefronts.gradeGroupPanel.selfLearning', 'Self-Learning via LMS Platform')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    <div className="grade-group-panel__included">
                        <strong>{t('storefronts.gradeGroupPanel.leftWhatsIncludedTitle', "What's Included")}</strong>
                        <ul>
                            <li>{t('storefronts.gradeGroupPanel.leftWhatsIncluded.0', 'All learning materials provided')}</li>
                            <li>{t('storefronts.gradeGroupPanel.leftWhatsIncluded.1', 'Student and parent login credentials')}</li>
                            <li>{t('storefronts.gradeGroupPanel.leftWhatsIncluded.2', '24/7 access to course content')}</li>
                            <li>{t('storefronts.gradeGroupPanel.leftWhatsIncluded.3', 'Learn at your own pace')}</li>
                        </ul>
                    </div>

                    <div className="grade-group-panel__promo">
                        {t('storefronts.pricingV2.promoBanner', 'Enroll now and receive a 50% discount — only $325 for a 1-year program')}
                    </div>

                    <div className="grade-group-panel__price-card">
                        <div className="price-row">
                            <span>{t('gradePage.pricePerCourse', 'Price per Course')}</span>
                            <span>
                                <span className="list-price">${perCourseList}</span>{' '}
                                <strong className="sale-price">${perCourseSale}</strong>{' '}
                                <span className="discount-badge">{t('gradePage.fiftyOff', '50% OFF')}</span>
                            </span>
                        </div>
                        {!isHighSchool && (
                            <div className="price-row">
                                <span>{t('gradePage.fullYear6Subjects', 'Full Year (6 subjects)')}</span>
                                <strong>${fullYear}</strong>
                            </div>
                        )}
                        {isHighSchool && (
                            <div className="price-row">
                                <span>Full Program Bundle</span>
                                <strong>Contact admissions</strong>
                            </div>
                        )}
                        <div className="price-row price-row--muted">
                            <span>{t('gradePage.registrationFeeLabel', 'Registration Fee:')}</span>
                            <span>${representativePricing.registration}</span>
                        </div>
                        <div className="price-row price-row--muted">
                            <span>{t('gradePage.entranceTestFeeLabel', 'Entrance Test Fee:')}</span>
                            <span>{representativePricing.entranceTest === 0 ? 'Waived' : `$${representativePricing.entranceTest}`}</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary btn-lg btn-block"
                        onClick={() => navigate(`/academic-prep/grade/${firstGrade}`)}
                    >
                        {t('storefronts.gradeGroupPanel.leftCta', 'Enroll in Academic Preparation')}
                    </button>
                </div>

                {/* RIGHT: Upgrade to Official Ontario */}
                <div className="grade-group-panel__col grade-group-panel__col--right">
                    <span className="grade-group-panel__badge">{t('nav.programDropdown.rightBadge', 'Most Popular')}</span>
                    <div className="grade-group-panel__col-header">
                        <span className="grade-group-panel__dot" style={{ background: '#D4AF37' }}></span>
                        <h3>{t('storefronts.gradeGroupPanel.rightHeading', 'UPGRADE to Official Ontario Program (Ontario student record)')}</h3>
                    </div>

                    <p className="grade-group-panel__description">
                        {t('storefronts.gradeGroupPanel.rightDescription')}
                    </p>

                    <div className="grade-group-panel__feature-pills">
                        <span className="pill">{t('storefronts.gradeGroupPanel.rightFeatures.0', 'Ontario student record')}</span>
                        <span className="pill">{t('storefronts.gradeGroupPanel.rightFeatures.1', 'Accredited pathway')}</span>
                        <span className="pill">{t('storefronts.gradeGroupPanel.rightFeatures.2', 'University-aligned')}</span>
                        <span className="pill">{t('storefronts.gradeGroupPanel.rightFeatures.3', 'OSSD pathway')}</span>
                    </div>

                    <div className="grade-group-panel__price-card grade-group-panel__price-card--featured">
                        <div className="price-row">
                            <span>{t('gradePage.pricePerCourse', 'Price per Course')}</span>
                            <strong>${upgradePerCourse}</strong>
                        </div>
                        {!isHighSchool && (
                            <div className="price-row">
                                <span>{t('gradePage.fullYear6Subjects', 'Full Year (6 subjects)')}</span>
                                <strong>${upgradeFullYear}</strong>
                            </div>
                        )}
                        {isHighSchool && (
                            <>
                                <div className="price-row">
                                    <span>Full Year ({hsCreditCount || '8'}-credit program)</span>
                                    <strong>From ${(hsDiscountTuition || 3800).toLocaleString()}</strong>
                                </div>
                                <div className="price-row price-row--muted">
                                    <span>Grade 11 &amp; 12 (7-credit)</span>
                                    <span>From $3,800</span>
                                </div>
                            </>
                        )}
                    </div>

                    <p className="grade-group-panel__upgrade-note">
                        {t('storefronts.gradeGroupPanel.upgradeNote')}
                    </p>

                    <button
                        className="btn btn-accent btn-lg btn-block"
                        onClick={() => navigate(`/official-ontario/grade/${firstGrade}`)}
                    >
                        {t('storefronts.gradeGroupPanel.rightCta', 'Upgrade to Official Ontario Program')}
                    </button>
                </div>
            </div>

            <div className="grade-group-panel__footer">
                <p className="grade-group-panel__tagline-strip">
                    {t('storefronts.taglineStack', 'Flexible Learning Pathways. Learn First. Decide Later. Succeed Safely.')}
                </p>
                <ScheduleStrip variant="compact" showContinuous={false} />
                <p className="grade-group-panel__hint">
                    {t('storefronts.programHint', 'Preparation today, recognition tomorrow.')}
                </p>
                <div className="grade-group-panel__grade-links">
                    {grades.map(g => (
                        <Link key={g} to={`/grade/${g}`} className="grade-link-pill">
                            Grade {g}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GradeGroupPanel
