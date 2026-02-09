import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { courses as coursesData } from '../data/courses'
import { getPricingForGrade } from '../config/pricing'
import SubjectCardGrid from '../components/SubjectCardGrid'
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
    const gradeNum = parseInt(grade, 10)
    const isHS = gradeNum >= 9 && gradeNum <= 12
    const [viewMode, setViewMode] = useState('full-year')

    const pricing = getPricingForGrade(grade)

    if (!pricing) {
        return (
            <div className="grade-page-error">
                <div className="container">
                    <h1>Invalid Grade</h1>
                    <p>Sorry, we don't have pricing information for grade {grade}.</p>
                    <Link to="/" className="btn btn-primary">Return Home</Link>
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
                            <h1>ONTARIO CURRICULUM PROGRAMS (Grades 9–12)</h1>
                            <p className="hero-subheading">Flexible Learning Pathways</p>
                            <p className="hero-tagline">Learn First. Decide Later. Succeed Safely.</p>
                        </>
                    )}
                    {!isHS && (
                        <>
                            <h1>Grade {grade} Programs</h1>
                            <p className="hero-subtitle">
                                Choose the program that fits your learning goals. Both options are aligned with the Ontario Curriculum.
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
                                Full Year Pricing
                            </button>
                            <button
                                className={`toggle-btn ${viewMode === 'single-course' ? 'active' : ''}`}
                                onClick={() => setViewMode('single-course')}
                            >
                                Single Course Pricing
                            </button>
                        </div>
                    </div>
                </section>
            )}

            {/* Content based on grade range and view mode */}
            {isHS ? (
                <HighSchoolTimetableLayout grade={grade} pricing={pricing} />
            ) : viewMode === 'full-year' ? (
                <TwoColumnComparison grade={grade} pricing={pricing} />
            ) : (
                <SingleCourseListing grade={grade} pricing={pricing} />
            )}
        </div>
    )
}

/**
 * TwoColumnComparison Component (Grades 1-8)
 * Shows both programs side by side with full-year pricing, subjects table, and promo banner
 */
function TwoColumnComparison({ grade, pricing }) {
    return (
        <section className="two-column-comparison-section">
            <div className="container">
                <div className="two-column-comparison">
                    {/* LEFT COLUMN: Academic Preparation Program */}
                    <div className="program-column academic-prep">
                        <div className="program-header">
                            <div className="program-badge">
                                <span className="badge-dot" style={{ background: '#2F80ED' }}></span>
                                Academic Preparation Program
                            </div>
                            <h2>Academic Preparation Program (Non-Credit)</h2>
                            <p className="program-tagline">Schedule: {pricing.schedule.start} – {pricing.schedule.end}</p>
                        </div>

                        {/* Subjects Table */}
                        <div className="subjects-table-wrapper">
                            <table className="subjects-table">
                                <thead>
                                    <tr>
                                        <th>Subject</th>
                                        <th>Language</th>
                                        <th>Delivery Method</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pricing.subjects.map(subject => (
                                        <tr key={subject}>
                                            <td>{subject}</td>
                                            <td>English</td>
                                            <td>Self-Learning via LMS Platform</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="whats-included-note">
                            <strong>What's Included:</strong> All learning materials provided · Student and parent login credentials · 24/7 access to course content · Learn at your own pace
                        </div>

                        {/* Promo Banner */}
                        <div className="promo-banner">
                            Enroll now and receive a 50% discount — only ${pricing.academicPrep.fullYear} for a 1-year program
                        </div>

                        <div className="pricing-card">
                            {/* Pricing Table */}
                            <table className="pricing-detail-table">
                                <tbody>
                                    <tr>
                                        <td><strong>Registration Fee</strong></td>
                                        <td>${pricing.registration}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Entrance Test Fee</strong></td>
                                        <td>${pricing.entranceTest === 0 ? '0' : pricing.entranceTest}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Price per Course</strong></td>
                                        <td>
                                            <span className="list-price">${pricing.academicPrep.listPrice}</span>{' '}
                                            <strong className="sale-price">${pricing.academicPrep.salePrice}</strong>{' '}
                                            <span className="discount-badge">50% OFF</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Full Year (6 subjects)</strong></td>
                                        <td>
                                            <span className="list-price">${pricing.academicPrep.listPrice * 6 + pricing.registration}</span>{' '}
                                            <strong className="sale-price">${pricing.academicPrep.fullYear}</strong>{' '}
                                            <span className="discount-badge">50% OFF</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <Link
                                to={`/academic-prep/grade/${grade}/courses`}
                                className="link-single-course"
                            >
                                For single course pricing, click here →
                            </Link>

                            <button className="btn btn-primary btn-lg btn-block">
                                Enroll Now
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Official Ontario Program */}
                    <div className="program-column official-ontario featured">
                        <span className="featured-badge">Most Popular</span>
                        <div className="program-header">
                            <div className="program-badge">
                                <span className="badge-dot" style={{ background: '#D4AF37' }}></span>
                                Upgrade to Official Ontario Program
                            </div>
                            <h2>Official Ontario Program</h2>
                            <p className="program-subtitle">(Ontario student record)</p>
                        </div>

                        <div className="pricing-card">
                            {/* Pricing Table */}
                            <table className="pricing-detail-table">
                                <tbody>
                                    <tr>
                                        <td><strong>Registration Fee</strong></td>
                                        <td>${pricing.registration}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Entrance Test Fee</strong></td>
                                        <td>${pricing.entranceTest === 0 ? '0' : pricing.entranceTest}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Price per Course</strong></td>
                                        <td><strong>${pricing.officialOntario.perCourse}</strong></td>
                                    </tr>
                                    <tr>
                                        <td><strong>Full Year (6 subjects)</strong></td>
                                        <td><strong>${pricing.officialOntario.fullYear}</strong></td>
                                    </tr>
                                </tbody>
                            </table>

                            <Link
                                to={`/official-ontario/grade/${grade}/courses`}
                                className="link-single-course"
                            >
                                For single course pricing, click here →
                            </Link>

                            <button className="btn btn-accent btn-lg btn-block">
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Schedule Information */}
                <div className="schedule-info">
                    <h3>Program Schedule</h3>
                    <p>
                        <strong>{pricing.schedule.start}</strong> to <strong>{pricing.schedule.end}</strong>
                    </p>
                </div>
            </div>
        </section>
    )
}

/**
 * HighSchoolTimetableLayout Component (Grades 9-12)
 * Shows full course timetables with per-course pricing for both programs
 */
function HighSchoolTimetableLayout({ grade, pricing }) {
    const { academicPrep, officialOntario } = pricing.timetable

    return (
        <>
            <section className="hs-timetable-section">
                <div className="container">
                    <p className="hs-intro">
                        We offer programs based on the Ontario Curriculum for students in Grades 9–12, with two flexible learning pathways:
                    </p>

                    <div className="two-column-comparison">
                        {/* LEFT COLUMN: Academic Preparation */}
                        <div className="program-column academic-prep">
                            <div className="program-header">
                                <div className="program-badge">
                                    <span className="badge-dot" style={{ background: '#2F80ED' }}></span>
                                    Academic Preparation Program (Non-Credit)
                                </div>
                                <h2>Grade {grade} Academic Year Timetable &amp; Tuition Fee</h2>
                            </div>

                            <div className="timetable-wrapper">
                                <table className="timetable">
                                    <thead>
                                        <tr>
                                            <th>Course Code</th>
                                            <th>Course Name</th>
                                            <th>Type</th>
                                            <th>Credit</th>
                                            <th>Price (CAD)</th>
                                            <th>50% Discount (CAD)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {academicPrep.courses.map(course => (
                                            <tr key={course.code}>
                                                <td className="course-code">{course.code}</td>
                                                <td>{course.name}</td>
                                                <td>{course.type}</td>
                                                <td className="text-center">{course.credit}</td>
                                                <td className="list-price">{course.listPrice}</td>
                                                <td className="sale-price">{course.salePrice}</td>
                                            </tr>
                                        ))}
                                        <tr className="total-row">
                                            <td><strong>Grade {grade} Total</strong></td>
                                            <td></td>
                                            <td></td>
                                            <td className="text-center"><strong>{academicPrep.totalCredits}</strong></td>
                                            <td className="list-price"><strong>{academicPrep.totalListPrice}</strong></td>
                                            <td className="sale-price"><strong>{academicPrep.totalSalePrice}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {pricing.frenchNote && (
                                <p className="french-note">{pricing.frenchNote}</p>
                            )}

                            <div className="fees-info">
                                <p><strong>Registration Fee:</strong> ${pricing.registration} (non-refundable)</p>
                                <p><strong>Entrance Test Fee:</strong> ${pricing.entranceTest} (non-refundable)</p>
                            </div>

                            <Link
                                to={`/academic-prep/grade/${grade}/courses`}
                                className="link-single-course"
                            >
                                For single course pricing, click here →
                            </Link>

                            <button className="btn btn-primary btn-lg btn-block">
                                Enroll Now
                            </button>
                        </div>

                        {/* RIGHT COLUMN: Official Ontario */}
                        <div className="program-column official-ontario featured">
                            <span className="featured-badge">Most Popular</span>
                            <div className="program-header">
                                <div className="program-badge">
                                    <span className="badge-dot" style={{ background: '#D4AF37' }}></span>
                                    Ontario Official High School Program
                                </div>
                                <h3 className="program-sub-badge">Study with Canadian Teachers</h3>
                                <h2>Grade {grade} Academic Year Timetable &amp; Tuition Fee</h2>
                            </div>

                            <div className="timetable-wrapper">
                                <table className="timetable">
                                    <thead>
                                        <tr>
                                            <th>Course Name</th>
                                            <th>Course Code</th>
                                            <th>Type of Credit</th>
                                            <th>Credit</th>
                                            <th>Price per Course (CAD)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {officialOntario.courses.map((course, idx) => (
                                            <tr key={course.code}>
                                                <td>{course.name}</td>
                                                <td className="course-code">{course.code}</td>
                                                <td>{course.type}</td>
                                                <td className="text-center">{course.credit}</td>
                                                <td>{course.price}</td>
                                            </tr>
                                        ))}
                                        <tr className="total-row">
                                            <td><strong>Grade {grade} Total</strong></td>
                                            <td></td>
                                            <td></td>
                                            <td className="text-center"><strong>{officialOntario.totalCredits}</strong></td>
                                            <td><strong>{officialOntario.totalPrice}</strong></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="discount-tuition-box">
                                <p className="discount-tuition-label">Discounted Tuition ({officialOntario.totalCredits} credits):</p>
                                <p className="discount-tuition-price">${officialOntario.discountTuition.toLocaleString()} / year</p>
                                <p className="discount-tuition-schedule">{officialOntario.schedule}</p>
                            </div>

                            {officialOntario.discountNote && (
                                <p className="discount-note">{officialOntario.discountNote}</p>
                            )}

                            {pricing.frenchNote && (
                                <p className="french-note">{pricing.frenchNote}</p>
                            )}

                            {pricing.notes && pricing.notes.map((note, idx) => (
                                <p key={idx} className="grade-note"><strong>Note:</strong> {note}</p>
                            ))}

                            <div className="fees-info">
                                <p><strong>Registration Fee:</strong> ${pricing.registration} (non-refundable)</p>
                                <p><strong>Entrance Test Fee:</strong> ${pricing.entranceTest} (non-refundable)</p>
                            </div>

                            <button className="btn btn-accent btn-lg btn-block">
                                Enroll Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Program Comparison Table (for Grades 9-12) */}
            <section className="comparison-table-section">
                <div className="container">
                    <ProgramComparisonTable />
                </div>
            </section>
        </>
    )
}

/**
 * ProgramComparisonTable - Reusable 7-row comparison
 * Used on Grade 9-12 pages (same table as on the landing page)
 */
function ProgramComparisonTable() {
    const rows = [
        { label: 'Purpose', academic: 'Preparation for entry into the Official Ontario Program', official: 'Official Ontario high school program' },
        { label: 'Program Type', academic: 'Preparation for credit', official: 'Credit-based secondary program' },
        { label: 'Curriculum', academic: 'Ontario-aligned', official: 'Official Ontario Curriculum' },
        { label: 'Academic Focus', academic: 'Math, English, Science, and Social Studies', official: 'Math, English, Science, and Social Studies' },
        { label: 'Assessment', academic: 'Skill-based feedback', official: 'Graded courses with records and credits' },
        { label: 'Progression', academic: 'Pathway to the Official Ontario Program', official: 'OSSD completion' },
        { label: 'Outcome', academic: 'Academic readiness', official: 'OSSD & university preparation' },
    ]

    return (
        <div className="program-comparison-table">
            <h3 className="comparison-title">Compare Programs</h3>
            <div className="comparison-table-wrapper">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Academic Preparation Program<br /><span className="th-subtitle">(Non-Ontario student record)</span></th>
                            <th>Official Ontario Program<br /><span className="th-subtitle">(Ontario student record)</span></th>
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
function SingleCourseListing({ grade, pricing }) {
    const gradeCourses = useMemo(() => {
        return Object.values(coursesData).filter(course => course.grade === String(grade))
    }, [grade])

    return (
        <section className="single-course-listing-section">
            <div className="container">
                <h2>Individual Courses – Grade {grade}</h2>
                <p className="section-subtitle">Choose specific subjects that fit your needs</p>

                <div className="program-courses-section">
                    <h3>Academic Preparation Program – Self-Paced Learning</h3>
                    <p className="program-description">
                        Video lessons and interactive activities · ${pricing.academicPrep.salePrice} per subject (50% off regular price)
                    </p>
                    <SubjectCardGrid
                        grade={grade}
                        courses={gradeCourses}
                        program="academic-prep"
                    />
                </div>

                <div className="program-courses-section">
                    <h3>Official Ontario Program – Live Classes</h3>
                    <p className="program-description">
                        Live instruction with Ontario Certified Teachers · ${pricing.officialOntario.perCourse} per subject
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
