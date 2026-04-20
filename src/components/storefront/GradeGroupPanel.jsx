import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getPricingForGrade, formatCurrency } from '../../config/pricing'
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
 * GradeGroupPanel — two-column pathway chooser.
 *
 * Left:  Non-Academic Ontario Record (Academic Preparation, non-credit)
 * Right: Upgrade to Ontario Record (adds $350 delta; $400/course total) + direct
 *        Academic Ontario Record self-paced + Live Teacher callouts.
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

    const subjects = representativePricing.subjects || [
        'Mathematics', 'Language', 'The Arts',
        'Science & Technology', 'Health & Physical Education', 'Social Studies'
    ]

    // New pricing model
    const nonAcademic = representativePricing.nonAcademicOntarioRecord
    const upgrade = representativePricing.upgradeToOntarioRecord
    const selfPacedOntario = representativePricing.academicOntarioRecord?.selfPaced
    const liveTeacher = representativePricing.academicOntarioRecord?.liveTeacher

    const nonAcademicPerCourse = nonAcademic?.perCourse ?? 50
    const nonAcademicBundle = nonAcademic?.bundle6 ?? 300
    const upgradeTotalPerCourse = upgrade?.totalPerCourse ?? 400
    const upgradeBundle = upgrade?.bundle6 ?? 1800
    const upgradeAddOn = upgrade?.addOnPerCourse ?? 350
    const singleCreditStandalone = selfPacedOntario?.singleCreditStandalone
    const liveTeacherAnnual = liveTeacher?.annual ?? 4500

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
                {/* LEFT: Non-Academic Ontario Record */}
                <div className="grade-group-panel__col grade-group-panel__col--left">
                    <div className="grade-group-panel__col-header">
                        <span className="grade-group-panel__dot" style={{ background: '#2F80ED' }}></span>
                        <h3>{t('storefronts.gradeGroupPanel.leftHeading', 'Non-Academic Ontario Record (Academic Preparation)')}</h3>
                    </div>

                    <p className="grade-group-panel__description">
                        {t('storefronts.gradeGroupPanel.leftDescription')}
                    </p>

                    {isHighSchool ? (
                        <div className="grade-group-panel__hs-summary">
                            <p>
                                Grades 9–12 deliver self-paced courses via the LMS Platform with no Ontario student record.
                                Each course carries the same flat per-course rate.
                            </p>
                            <p>
                                View the full per-grade course codes (ENG1D, MTH1W, SNC1W, …) on any
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
                        {t('storefronts.pricingV2.promoBanner', {
                            defaultValue: 'Start from just {{price}} per course — or {{bundle}} for a full 6-course year.',
                            price: formatCurrency(nonAcademicPerCourse),
                            bundle: formatCurrency(nonAcademicBundle),
                        })}
                    </div>

                    <div className="grade-group-panel__price-card">
                        <div className="price-row">
                            <span>{t('gradePage.pricePerCourse', 'Price per Course')}</span>
                            <strong>{formatCurrency(nonAcademicPerCourse)}</strong>
                        </div>
                        <div className="price-row">
                            <span>{t('gradePage.fullYear6Subjects', 'Full Year (6 subjects)')}</span>
                            <strong>{formatCurrency(nonAcademicBundle)}</strong>
                        </div>
                        <div className="price-row price-row--muted">
                            <span>{t('gradePage.registrationFeeLabel', 'Registration Fee:')}</span>
                            <span>{formatCurrency(representativePricing.registration)}</span>
                        </div>
                        <div className="price-row price-row--muted">
                            <span>{t('gradePage.entranceTestFeeLabel', 'Entrance Test Fee:')}</span>
                            <span>{representativePricing.entranceTest === 0 ? 'Waived' : formatCurrency(representativePricing.entranceTest)}</span>
                        </div>
                    </div>

                    <button
                        className="btn btn-primary btn-lg btn-block"
                        onClick={() => navigate(`/academic-prep/grade/${firstGrade}`)}
                    >
                        {t('storefronts.gradeGroupPanel.leftCta', 'Enroll in Non-Academic Program')}
                    </button>
                </div>

                {/* RIGHT: Upgrade / Direct Academic Ontario Record */}
                <div className="grade-group-panel__col grade-group-panel__col--right">
                    <span className="grade-group-panel__badge">{t('nav.programDropdown.rightBadge', 'Most Popular')}</span>
                    <div className="grade-group-panel__col-header">
                        <span className="grade-group-panel__dot" style={{ background: '#D4AF37' }}></span>
                        <h3>{t('storefronts.gradeGroupPanel.rightHeading', 'Academic Ontario Record (credit-bearing)')}</h3>
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
                            <span>{t('gradePage.upgradePerCourse', 'Upgrade — per course (adds {{addOn}})', { addOn: formatCurrency(upgradeAddOn) })}</span>
                            <strong>{formatCurrency(upgradeTotalPerCourse)}</strong>
                        </div>
                        <div className="price-row">
                            <span>{t('gradePage.upgradeFullYear', 'Upgrade — full year (6 courses)')}</span>
                            <strong>{formatCurrency(upgradeBundle)}</strong>
                        </div>
                        {isHighSchool && singleCreditStandalone && (
                            <div className="price-row price-row--muted">
                                <span>{t('gradePage.singleCreditStandalone', 'Single credit (standalone, self-paced)')}</span>
                                <span>{formatCurrency(singleCreditStandalone)}</span>
                            </div>
                        )}
                        <div className="price-row price-row--highlight">
                            <span>{t('gradePage.liveTeacherAnnual', 'Live Teacher — per year (6 courses)')}</span>
                            <strong>{formatCurrency(liveTeacherAnnual)}</strong>
                        </div>
                    </div>

                    <p className="grade-group-panel__upgrade-note">
                        {t('storefronts.gradeGroupPanel.upgradeNote')}
                    </p>

                    <button
                        className="btn btn-accent btn-lg btn-block"
                        onClick={() => navigate(`/official-ontario/grade/${firstGrade}`)}
                    >
                        {t('storefronts.gradeGroupPanel.rightCta', 'Upgrade to Ontario Record')}
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
