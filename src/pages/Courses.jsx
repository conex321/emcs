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

            {/* V2: Program Comparison Overview */}
            <section className="programs-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('courses.academicPrograms', 'Academic Programs')}</h2>
                        <p className="section-subtitle">{t('home.taglineLearn', 'Learn First. Decide Later. Succeed Safely.')}</p>
                    </div>

                    {/* V2 Comparison Table */}
                    <div className="courses-v2-comparison-wrapper">
                        <table className="courses-v2-comparison">
                            <thead>
                                <tr>
                                    <th>Program</th>
                                    <th>Grades</th>
                                    <th>Format</th>
                                    <th>Student Record</th>
                                    <th>Credential</th>
                                    <th>Full-Year Price</th>
                                    <th>Per-Course Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Non-Academic Ontario Record (Elementary)</strong></td>
                                    <td>1 to 5</td>
                                    <td>100% Self-Paced via LMS</td>
                                    <td>Non-Ontario student record</td>
                                    <td>Certificate of Completion</td>
                                    <td>$300 CAD (6 courses)</td>
                                    <td>$50 CAD</td>
                                </tr>
                                <tr>
                                    <td><strong>Academic Ontario Record — Self-paced (Elementary)</strong></td>
                                    <td>1 to 5</td>
                                    <td>Self-Paced, credit-bearing</td>
                                    <td>Ontario student record</td>
                                    <td>Ontario Academic Report Card</td>
                                    <td>$1,800 CAD (6 courses)</td>
                                    <td>$350 CAD</td>
                                </tr>
                                <tr>
                                    <td><strong>Academic Ontario Record — Live Teacher (Elementary)</strong></td>
                                    <td>1 to 5</td>
                                    <td>Live Online, 6 hrs/week</td>
                                    <td>Ontario student record</td>
                                    <td>Ontario Report Card</td>
                                    <td>$4,500 CAD/year (6 courses)</td>
                                    <td>Included in bundle</td>
                                </tr>
                                <tr>
                                    <td><strong>Non-Academic Ontario Record (Middle School)</strong></td>
                                    <td>6 to 8</td>
                                    <td>100% Self-Paced via LMS</td>
                                    <td>Non-Ontario student record</td>
                                    <td>Certificate of Completion</td>
                                    <td>$300 CAD (6 courses)</td>
                                    <td>$50 CAD</td>
                                </tr>
                                <tr>
                                    <td><strong>Academic Ontario Record — Self-paced (Middle School)</strong></td>
                                    <td>6 to 8</td>
                                    <td>Self-Paced, credit-bearing</td>
                                    <td>Ontario student record</td>
                                    <td>Ontario Academic Report Card</td>
                                    <td>$1,800 CAD (6 courses)</td>
                                    <td>$350 CAD</td>
                                </tr>
                                <tr>
                                    <td><strong>Academic Ontario Record — Live Teacher (Middle School)</strong></td>
                                    <td>6 to 8</td>
                                    <td>Live Online, 6 hrs/week</td>
                                    <td>Ontario student record</td>
                                    <td>Ontario Report Card</td>
                                    <td>$4,500 CAD/year (6 courses)</td>
                                    <td>Included in bundle</td>
                                </tr>
                                <tr>
                                    <td><strong>Non-Academic Ontario Record (High School)</strong></td>
                                    <td>9 to 12</td>
                                    <td>100% Self-Paced</td>
                                    <td>Non-Ontario student record</td>
                                    <td>No OSSD credit</td>
                                    <td>$300 CAD (6 courses)</td>
                                    <td>$50 CAD</td>
                                </tr>
                                <tr>
                                    <td><strong>Academic Ontario Record — Self-paced (High School)</strong></td>
                                    <td>9 to 12</td>
                                    <td>Self-Paced, credit-bearing</td>
                                    <td>Ontario student record</td>
                                    <td>OSSD Credits</td>
                                    <td>$1,800 CAD (6 courses)</td>
                                    <td>$400 CAD · $450 single standalone</td>
                                </tr>
                                <tr>
                                    <td><strong>Academic Ontario Record — Live Teacher (High School)</strong></td>
                                    <td>9 to 12</td>
                                    <td>Live Online, 6 hrs/week</td>
                                    <td>Ontario student record</td>
                                    <td>OSSD Credits → Diploma</td>
                                    <td>$4,500 CAD/year (6 courses)</td>
                                    <td>Included in bundle</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="courses-v2-footnote">
                        <em>Note regarding fees:</em> Grades 1 to 5 carry a $50 CAD registration fee and no entrance test fee.
                        Grades 6 to 8 carry a $50 CAD registration fee and a $50 CAD entrance test fee.
                        Grades 9 to 12 carry a $100 CAD registration fee and a $50 CAD entrance test fee. All fees are non-refundable.
                    </p>

                    {/* Decision tree */}
                    <div className="courses-v2-decision-tree">
                        <h3>Which Program Is Right for You?</h3>
                        <div className="decision-groups">
                            <div className="decision-group">
                                <h4>For Elementary Students (Grades 1 to 5)</h4>
                                <ul>
                                    <li>Want curriculum-aligned learning without assessments? → <strong>Non-Academic Ontario Record ($50/course, no Ontario record)</strong></li>
                                    <li>Want an Ontario student record right away? → <strong>Academic Ontario Record — Self-paced ($350/course, $1,800/year for 6)</strong></li>
                                    <li>Want the premium live teacher-led experience with full Ontario report card? → <strong>Academic Ontario Record — Live Teacher ($4,500/year)</strong></li>
                                </ul>
                            </div>
                            <div className="decision-group">
                                <h4>For Middle School Students (Grades 6 to 8)</h4>
                                <ul>
                                    <li>Preparing to transition into Ontario high school? → <strong>Non-Academic Ontario Record</strong></li>
                                    <li>Need an Ontario student record now? → <strong>Academic Ontario Record — Self-paced ($350/course, $1,800/year for 6)</strong></li>
                                    <li>Want live teacher support with full Ontario report card? → <strong>Academic Ontario Record — Live Teacher ($4,500/year)</strong></li>
                                </ul>
                            </div>
                            <div className="decision-group">
                                <h4>For High School Students (Grades 9 to 12)</h4>
                                <ul>
                                    <li>Not sure yet if you want to commit to credit courses? → <strong>Academic Preparation Program — Learn First, Decide Later</strong></li>
                                    <li>Need credits toward your OSSD? → <strong>Official Ontario Program</strong> (8 credits Gr 9-10, 7 credits Gr 11-12)</li>
                                    <li>Already completed the prior grade in your home country? → <strong>French as a Second Language is waived</strong> and an equivalent credit is granted</li>
                                    <li>Want extra practice or exam prep? → <strong>Non-Credit Practice Courses</strong></li>
                                </ul>
                            </div>
                            <div className="decision-group">
                                <h4>For International Students</h4>
                                <ul>
                                    <li>Preparing for Canadian high school? → <strong>Primary Foundation + Academic Preparation</strong></li>
                                    <li>Earning OSSD from abroad? → <strong>Official Ontario Program</strong> (no study permit required)</li>
                                    <li>Aiming for Canadian or international university admission? → <strong>Official Ontario Program Grade 11-12 pathway</strong></li>
                                </ul>
                            </div>
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
                                <p>{t('courses.noCourses', 'No courses currently listed for this grade. Please check back soon.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Courses
