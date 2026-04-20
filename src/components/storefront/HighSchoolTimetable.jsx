import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/**
 * HighSchoolTimetable
 *
 * Renders the dual-column Grades 9-12 timetable layout with:
 * - Academic Preparation Program timetable (left)
 * - Official Ontario Program timetable (right, featured)
 *
 * Reused by:
 * - src/pages/GradePage.jsx (inside its own hero)
 * - src/pages/HighSchoolPathways.jsx (inside tabs)
 *
 * Props:
 * - grade: string grade number (e.g. '9')
 * - pricing: getPricingForGrade(grade) result — must include timetable, schedule, registration, entranceTest
 * - showIntro: whether to render the "We offer programs..." intro line (default: false)
 * - showLinks: whether to render "single course pricing" link (default: true)
 */
function HighSchoolTimetable({ grade, pricing, showIntro = false, showLinks = true }) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { academicPrep, officialOntario } = pricing.timetable

    return (
        <section className="hs-timetable-section">
            <div className="container">
                {showIntro && (
                    <p className="hs-intro">
                        {t('gradePage.hsIntro', 'We offer programs based on the Ontario Curriculum for students in Grades 9–12, with two flexible learning pathways:')}
                    </p>
                )}

                <div className="two-column-comparison">
                    {/* LEFT: Academic Preparation */}
                    <div className="program-column academic-prep">
                        <div className="program-header">
                            <div className="program-badge">
                                <span className="badge-dot" style={{ background: '#2F80ED' }}></span>
                                {t('gradePage.academicPrepTitle', 'Academic Preparation Program (Non-Credit)')}
                            </div>
                            <h2>{t('gradePage.timetableTitle', 'Grade {{grade}} Academic Year Timetable & Tuition Fee', { grade })}</h2>
                        </div>

                        <div className="timetable-wrapper">
                            <table className="timetable">
                                <thead>
                                    <tr>
                                        <th>{t('gradePage.thCourseCode', 'Course Code')}</th>
                                        <th>{t('gradePage.thCourseName', 'Course Name')}</th>
                                        <th>{t('gradePage.thType', 'Type')}</th>
                                        <th>{t('gradePage.thCredit', 'Credit')}</th>
                                        <th>{t('gradePage.thPriceCad', 'Price (CAD)')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {academicPrep.courses.map(course => (
                                        <tr key={course.code}>
                                            <td className="course-code">{course.code}</td>
                                            <td>{course.name}</td>
                                            <td>{course.type}</td>
                                            <td className="text-center">{course.credit}</td>
                                            <td>${course.listPrice}</td>
                                        </tr>
                                    ))}
                                    <tr className="total-row">
                                        <td><strong>{t(`storefronts.gradeTotals.grade${grade}`, t('gradePage.gradeTotal', 'Grade {{grade}} Total', { grade }))}</strong></td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-center"><strong>{academicPrep.totalCredits}</strong></td>
                                        <td><strong>${academicPrep.totalListPrice}</strong></td>
                                    </tr>
                                    <tr className="total-row total-row--bundle">
                                        <td colSpan="4"><strong>{t('gradePage.bundle6Label', '6-Course Bundle (Non-Academic)')}</strong></td>
                                        <td><strong>${academicPrep.bundle6Price ?? 300}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {pricing.frenchNote && (
                            <p className="french-note">{t(`storefronts.frenchExemption.grade${grade}`, pricing.frenchNote)}</p>
                        )}

                        <div className="fees-info">
                            <p><strong>{t('gradePage.registrationFeeLabel', 'Registration Fee:')}</strong> ${pricing.registration} {t('gradePage.nonRefundable', '(non-refundable)')}</p>
                            <p><strong>{t('gradePage.entranceTestFeeLabel', 'Entrance Test Fee:')}</strong> ${pricing.entranceTest} {t('gradePage.nonRefundable', '(non-refundable)')}</p>
                        </div>

                        {showLinks && (
                            <Link
                                to={`/academic-prep/grade/${grade}/courses`}
                                className="link-single-course"
                            >
                                {t('gradePage.singleCoursePricingLink', 'For single course pricing, click here →')}
                            </Link>
                        )}

                        <button
                            className="btn btn-primary btn-lg btn-block"
                            onClick={() => navigate(`/register?program=academic-prep&grade=${grade}`)}
                        >
                            {t('gradePage.enrollNow', 'Enroll Now')}
                        </button>

                        {/* Upgrade affordance (v2) */}
                        <button
                            className="btn btn-outline btn-block"
                            onClick={() => navigate(`/official-ontario/grade/${grade}`)}
                            style={{ marginTop: '0.5rem' }}
                        >
                            {t('storefronts.upgradeAffordance.cta', 'Upgrade to Credit')} → {t('gradePage.upgradeToOfficial', 'Official Ontario Program')}
                        </button>
                    </div>

                    {/* RIGHT: Official Ontario */}
                    <div className="program-column official-ontario featured">
                        <span className="featured-badge">{t('gradePage.mostPopular', 'Most Popular')}</span>
                        <div className="program-header">
                            <div className="program-badge">
                                <span className="badge-dot" style={{ background: '#D4AF37' }}></span>
                                {t('gradePage.officialHsProgram', 'Ontario Official High School Program')}
                            </div>
                            <h3 className="program-sub-badge">{t('gradePage.studyWithCanadianTeachers', 'Study with Canadian Teachers')}</h3>
                            <h2>{t('gradePage.timetableTitle', 'Grade {{grade}} Academic Year Timetable & Tuition Fee', { grade })}</h2>
                        </div>

                        <div className="timetable-wrapper">
                            <table className="timetable">
                                <thead>
                                    <tr>
                                        <th>{t('gradePage.thCourseName', 'Course Name')}</th>
                                        <th>{t('gradePage.thCourseCode', 'Course Code')}</th>
                                        <th>{t('gradePage.thTypeOfCredit', 'Type of Credit')}</th>
                                        <th>{t('gradePage.thCredit', 'Credit')}</th>
                                        <th>{t('gradePage.thPricePerCourseCad', 'Price per Course (CAD)')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {officialOntario.courses.map(course => (
                                        <tr key={course.code}>
                                            <td>{course.name}</td>
                                            <td className="course-code">{course.code}</td>
                                            <td>{course.type}</td>
                                            <td className="text-center">{course.credit}</td>
                                            <td>{course.price}</td>
                                        </tr>
                                    ))}
                                    <tr className="total-row">
                                        <td><strong>{t(`storefronts.gradeTotals.grade${grade}`, t('gradePage.gradeTotal', 'Grade {{grade}} Total', { grade }))}</strong></td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-center"><strong>{officialOntario.totalCredits}</strong></td>
                                        <td><strong>{officialOntario.totalPrice}</strong></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="discount-tuition-box">
                            <p className="discount-tuition-label">
                                {t('gradePage.bundleTuition', '6-Course Bundle Tuition:')}
                            </p>
                            <p className="discount-tuition-price">${officialOntario.discountTuition.toLocaleString()} / {t('gradePage.year', 'year')}</p>
                            <p className="discount-tuition-schedule">{officialOntario.schedule}</p>
                        </div>

                        <div className="discount-tuition-box discount-tuition-box--live">
                            <p className="discount-tuition-label">
                                {t('gradePage.liveTeacherAnnual', 'Live Teacher — per year (6 courses)')}
                            </p>
                            <p className="discount-tuition-price">${(officialOntario.liveTeacherAnnual ?? 4500).toLocaleString()} / {t('gradePage.year', 'year')}</p>
                        </div>

                        {officialOntario.singleCreditStandalone && (
                            <p className="discount-note">
                                <strong>{t('gradePage.singleCreditStandalone', 'Single credit (standalone, self-paced)')}:</strong> ${officialOntario.singleCreditStandalone}
                            </p>
                        )}

                        {officialOntario.discountNote && (
                            <p className="discount-note">{officialOntario.discountNote}</p>
                        )}

                        {pricing.frenchNote && (
                            <p className="french-note">{t(`storefronts.frenchExemption.grade${grade}`, pricing.frenchNote)}</p>
                        )}

                        {pricing.notes && pricing.notes.map((note, idx) => (
                            <p key={idx} className="grade-note"><strong>{t('gradePage.note', 'Note')}:</strong> {note}</p>
                        ))}

                        <div className="fees-info">
                            <p><strong>{t('gradePage.registrationFeeLabel', 'Registration Fee:')}</strong> ${pricing.registration} {t('gradePage.nonRefundable', '(non-refundable)')}</p>
                            <p><strong>{t('gradePage.entranceTestFeeLabel', 'Entrance Test Fee:')}</strong> ${pricing.entranceTest} {t('gradePage.nonRefundable', '(non-refundable)')}</p>
                        </div>

                        <button
                            className="btn btn-accent btn-lg btn-block"
                            onClick={() => navigate(`/register?program=official-ontario&grade=${grade}`)}
                        >
                            {t('gradePage.enrollNow', 'Enroll Now')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HighSchoolTimetable
