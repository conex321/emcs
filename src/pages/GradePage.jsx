import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { courses as coursesData } from '../data/courses'
import { getPricingForGrade } from '../config/pricing'
import SubjectCardGrid from '../components/SubjectCardGrid'
import HighSchoolTimetable from '../components/storefront/HighSchoolTimetable'
import ScheduleStrip from '../components/storefront/ScheduleStrip'
import './GradePage.css'

/**
 * GradePage - CRITICAL COMPONENT
 *
 * This page ALWAYS shows both programs side by side (Academic Prep and Official Ontario)
 * regardless of which program the user came from. This allows parents to easily compare
 * and potentially change their mind about which program to choose.
 *
 * Layout varies by grade range:
 * - Grades 1-8: Two-column pricing cards with subjects table
 * - Grades 9-12: Full course timetable tables with per-course pricing
 */
function GradePage() {
    const { grade } = useParams()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const gradeNum = parseInt(grade, 10)
    const isHS = gradeNum >= 9 && gradeNum <= 12
    const [viewMode, setViewMode] = useState('full-year')

    const pricing = getPricingForGrade(grade)

    if (!pricing) {
        return (
            <div className="grade-page-error">
                <div className="container">
                    <h1>{t('gradePage.invalidGrade', 'Invalid Grade')}</h1>
                    <p>{t('gradePage.invalidGradeDesc', "Sorry, we don't have pricing information for grade {{grade}}.", { grade })}</p>
                    <Link to="/" className="btn btn-primary">{t('gradePage.returnHome', 'Return Home')}</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="grade-page-dual">
            {/* Grade Hero */}
            <section className="grade-hero">
                <div className="container">
                    {isHS && (
                        <>
                            <h1>{t('gradePage.hsTitle', 'ONTARIO CURRICULUM PROGRAMS (Grades 9–12)')}</h1>
                            <p className="hero-subheading">{t('gradePage.hsSubheading', 'Flexible Learning Pathways')}</p>
                            <p className="hero-tagline">{t('gradePage.hsTagline', 'Learn First. Decide Later. Succeed Safely.')}</p>
                        </>
                    )}
                    {!isHS && (
                        <>
                            <h1>{t('gradePage.gradePrograms', 'Grade {{grade}} Programs', { grade })}</h1>
                            <p className="hero-subtitle">
                                {t('gradePage.heroSubtitle', 'Choose the program that fits your learning goals. Both options are aligned with the Ontario Curriculum.')}
                            </p>
                        </>
                    )}
                </div>
            </section>

            {/* View Toggle - only for Grades 1-8 */}
            {!isHS && (
                <section className="view-toggle-section">
                    <div className="container">
                        <div className="view-toggle">
                            <button
                                className={`toggle-btn ${viewMode === 'full-year' ? 'active' : ''}`}
                                onClick={() => setViewMode('full-year')}
                            >
                                {t('gradePage.fullYearPricing', 'Full Year Pricing')}
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'single-course' ? 'active' : ''}`}
                                onClick={() => setViewMode('single-course')}
                            >
                                {t('gradePage.singleCoursePricing', 'Single Course Pricing')}
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Content based on grade range and view mode */}
            {isHS ? (
                <>
                    <HighSchoolTimetable grade={grade} pricing={pricing} showIntro={true} />
                    {/* Preserved comparison table from V1 */}
                    <section className="comparison-table-section">
                        <div className="container">
                            <ProgramComparisonTable t={t} />
                        </div>
                    </section>
                </>
            ) : viewMode === 'full-year' ? (
                <TwoColumnComparison grade={grade} pricing={pricing} t={t} navigate={navigate} />
            ) : (
                <SingleCourseListing grade={grade} pricing={pricing} t={t} navigate={navigate} />
            )}

            {/* Grade 8 transition callout (V2) */}
            {gradeNum === 8 && (
                <section className="grade8-transition-section">
                    <div className="container">
                        <div className="grade8-transition-callout">
                            <strong>Grade 8 Transition:</strong>{' '}
                            {t('storefronts.grade8Transition')}
                            <div className="grade8-cta-row">
                                <Link to="/official-ontario/grade/9" className="btn btn-accent">
                                    Enroll in Grade 9 Official Ontario →
                                </Link>
                                <Link to="/academic-prep/grade/9" className="btn btn-outline">
                                    Continue in Academic Prep →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* V2: Schedule strip visible on every grade page */}
            <section className="grade-schedule-section">
                <div className="container">
                    <ScheduleStrip />
                </div>
            </section>
        </div>
    )
}

/**
 * TwoColumnComparison Component (Grades 1-8)
 * Shows both programs side by side with full-year pricing, subjects table, and promo banner
 */
function TwoColumnComparison({ grade, pricing, t, navigate }) {
    return (
        <section className="two-column-comparison-section">
            <div className="container">
                <div className="two-column-comparison">
                    {/* LEFT COLUMN: Academic Preparation Program */}
                    <div className="program-column academic-prep">
                        <div className="program-header">
                            <div className="program-badge">
                                <span className="badge-dot" style={{ background: '#2F80ED' }}></span>
                                {t('programs.academicPrep.name', 'Academic Preparation Program')}
                            </div>
                            <h2>{t('gradePage.academicPrepTitle', 'Academic Preparation Program (Non-Credit)')}</h2>
                            <p className="program-tagline">{t('gradePage.schedule', 'Schedule')}: {pricing.schedule.start} – {pricing.schedule.end}</p>
                        </div>

                        {/* Subjects Table */}
                        <div className="subjects-table-wrapper">
                            <table className="subjects-table">
                                <thead>
                                    <tr>
                                        <th>{t('gradePage.thSubject', 'Subject')}</th>
                                        <th>{t('gradePage.thLanguage', 'Language')}</th>
                                        <th>{t('gradePage.thDeliveryMethod', 'Delivery Method')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricing.subjects.map(subject => (
                                        <tr key={subject}>
                                            <td>{subject}</td>
                                            <td>{t('gradePage.english', 'English')}</td>
                                            <td>{t('gradePage.selfLearningLms', 'Self-Learning via LMS Platform')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="whats-included-note">
                            <strong>{t('gradePage.whatsIncludedLabel', "What's Included:")}</strong> {t('gradePage.whatsIncludedNote', 'All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace')}
                        </div>

                        {/* Promo Banner */}
                        <div className="promo-banner">
                            {t('gradePage.promoBanner', 'Start from just ${{price}} per course — ${{bundle}} for a full 6-course year.', { price: pricing.academicPrep.salePrice, bundle: pricing.academicPrep.fullYear })}
                        </div>

                        <div className="pricing-card">
                            {/* Pricing Table */}
                            <table className="pricing-detail-table">
                                <tbody>
                                    <tr>
                                        <td><strong>{t('gradePage.registrationFee', 'Registration Fee')}</strong></td>
                                        <td>${pricing.registration}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('gradePage.entranceTestFee', 'Entrance Test Fee')}</strong></td>
                                        <td>${pricing.entranceTest === 0 ? '0' : pricing.entranceTest}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('gradePage.pricePerCourse', 'Price per Course')}</strong></td>
                                        <td>
                                            <strong className="sale-price">${pricing.academicPrep.salePrice}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('gradePage.fullYear6Subjects', 'Full Year (6 subjects)')}</strong></td>
                                        <td>
                                            <strong className="sale-price">${pricing.academicPrep.fullYear}</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <Link
                                to={`/academic-prep/grade/${grade}/courses`}
                                className="link-single-course"
                            >
                                {t('gradePage.singleCoursePricingLink', 'For single course pricing, click here →')}
                            </Link>

                            <button
                                className="btn btn-primary btn-lg btn-block"
                                onClick={() => navigate(`/register?program=academic-prep&grade=${grade}`)}
                            >
                                {t('gradePage.enrollNow', 'Enroll Now')}
                            </button>

                            {/* V2 upgrade affordance */}
                            <button
                                className="btn btn-outline btn-block"
                                onClick={() => navigate(`/official-ontario/grade/${grade}`)}
                                style={{ marginTop: '0.5rem' }}
                            >
                                ⬆ {t('storefronts.upgradeAffordance.cta', 'Upgrade to Credit')} — {t('gradePage.upgradeToOfficial', 'Official Ontario Program')}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Official Ontario Program */}
                    <div className="program-column official-ontario featured">
                        <span className="featured-badge">{t('gradePage.mostPopular', 'Most Popular')}</span>
                        <div className="program-header">
                            <div className="program-badge">
                                <span className="badge-dot" style={{ background: '#D4AF37' }}></span>
                                {t('gradePage.upgradeToOfficial', 'Upgrade to Official Ontario Program')}
                            </div>
                            <h2>{t('programs.officialOntario.name', 'Official Ontario Program')}</h2>
                            <p className="program-subtitle">{t('gradePage.ontarioStudentRecord', '(Ontario student record)')}</p>
                        </div>

                        <div className="pricing-card">
                            {/* Pricing Table */}
                            <table className="pricing-detail-table">
                                <tbody>
                                    <tr>
                                        <td><strong>{t('gradePage.registrationFee', 'Registration Fee')}</strong></td>
                                        <td>${pricing.registration}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('gradePage.entranceTestFee', 'Entrance Test Fee')}</strong></td>
                                        <td>${pricing.entranceTest === 0 ? '0' : pricing.entranceTest}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('gradePage.pricePerCourse', 'Price per Course')}</strong></td>
                                        <td><strong>${pricing.officialOntario.perCourse}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('gradePage.fullYear6Subjects', 'Full Year (6 subjects)')}</strong></td>
                                        <td><strong>${pricing.officialOntario.fullYear}</strong></td>
                                    </tr>
                                </tbody>
                            </table>

                            <Link
                                to={`/official-ontario/grade/${grade}/courses`}
                                className="link-single-course"
                            >
                                {t('gradePage.singleCoursePricingLink', 'For single course pricing, click here →')}
                            </Link>

                            <button
                                className="btn btn-accent btn-lg btn-block"
                                onClick={() => navigate(`/register?program=official-ontario&grade=${grade}`)}
                            >
                                {t('gradePage.enrollNow', 'Enroll Now')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Schedule Information */}
                <div className="schedule-info">
                    <h3>{t('gradePage.programSchedule', 'Program Schedule')}</h3>
                    <p>
                        <strong>{pricing.schedule.start}</strong> {t('gradePage.to', 'to')} <strong>{pricing.schedule.end}</strong>
                    </p>
                </div>
            </div>
        </section>
    )
}

/**
 * ProgramComparisonTable - Reusable 7-row comparison
 * Used on Grade 9-12 pages (same table as on the landing page)
 */
function ProgramComparisonTable({ t }) {
    const rows = [
        { label: t('gradePage.comparePurpose', 'Purpose'), academic: t('gradePage.comparePurposeAcademic', 'Preparation for entry into the Official Ontario Program'), official: t('gradePage.comparePurposeOfficial', 'Official Ontario high school program') },
        { label: t('gradePage.compareProgramType', 'Program Type'), academic: t('gradePage.compareProgramTypeAcademic', 'Preparation for credit'), official: t('gradePage.compareProgramTypeOfficial', 'Credit-based secondary program') },
        { label: t('gradePage.compareCurriculum', 'Curriculum'), academic: t('gradePage.compareCurriculumAcademic', 'Ontario-aligned'), official: t('gradePage.compareCurriculumOfficial', 'Official Ontario Curriculum') },
        { label: t('gradePage.compareAcademicFocus', 'Academic Focus'), academic: t('gradePage.compareAcademicFocusAcademic', 'Math, English, Science, and Social Studies'), official: t('gradePage.compareAcademicFocusOfficial', 'Math, English, Science, and Social Studies') },
        { label: t('gradePage.compareAssessment', 'Assessment'), academic: t('gradePage.compareAssessmentAcademic', 'Skill-based feedback'), official: t('gradePage.compareAssessmentOfficial', 'Graded courses with records and credits') },
        { label: t('gradePage.compareProgression', 'Progression'), academic: t('gradePage.compareProgressionAcademic', 'Pathway to the Official Ontario Program'), official: t('gradePage.compareProgressionOfficial', 'OSSD completion') },
        { label: t('gradePage.compareOutcome', 'Outcome'), academic: t('gradePage.compareOutcomeAcademic', 'Academic readiness'), official: t('gradePage.compareOutcomeOfficial', 'OSSD & university preparation') },
    ]

    return (
        <div className="program-comparison-table">
            <h3 className="comparison-title">{t('gradePage.comparePrograms', 'Compare Programs')}</h3>
            <div className="comparison-table-wrapper">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>{t('gradePage.compareThAcademic', 'Academic Preparation Program')}<br /><span className="th-subtitle">{t('gradePage.compareThAcademicSub', '(Non-Ontario student record)')}</span></th>
                            <th>{t('gradePage.compareThOfficial', 'Official Ontario Program')}<br /><span className="th-subtitle">{t('gradePage.compareThOfficialSub', '(Ontario student record)')}</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => (
                            <tr key={row.label}>
                                <td><strong>{row.label}</strong></td>
                                <td>{row.academic}</td>
                                <td>{row.official}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

/**
 * SingleCourseListing Component (Grades 1-8)
 * Shows courses organized by subject using SubjectCardGrid
 */
function SingleCourseListing({ grade, pricing, t }) {
    const gradeCourses = useMemo(() => {
        return Object.values(coursesData).filter(course => course.grade === String(grade))
    }, [grade])

    return (
        <section className="single-course-listing-section">
            <div className="container">
                <h2>{t('gradePage.individualCourses', 'Individual Courses – Grade {{grade}}', { grade })}</h2>
                <p className="section-subtitle">{t('gradePage.chooseSpecificSubjects', 'Choose specific subjects that fit your needs')}</p>

                <div className="program-courses-section">
                    <h3>{t('gradePage.academicPrepSelfPaced', 'Academic Preparation Program – Self-Paced Learning')}</h3>
                    <p className="program-description">
                        {t('gradePage.academicPrepSingleDesc', 'Video lessons and interactive activities · ${{price}} per subject', { price: pricing.academicPrep.salePrice })}
                    </p>
                    <SubjectCardGrid
                        grade={grade}
                        courses={gradeCourses}
                        program="academic-prep"
                    />
                </div>

                <div className="program-courses-section">
                    <h3>{t('gradePage.officialOntarioLive', 'Official Ontario Program – Live Classes')}</h3>
                    <p className="program-description">
                        {t('gradePage.officialOntarioSingleDesc', 'Live instruction with Ontario Certified Teachers · ${{price}} per subject', { price: pricing.officialOntario.perCourse })}
                    </p>
                    <SubjectCardGrid
                        grade={grade}
                        courses={gradeCourses}
                        program="official-ontario"
                    />
                </div>
            </div>
        </section>
    )
}

export default GradePage
