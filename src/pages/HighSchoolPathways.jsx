import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import HighSchoolTimetable from '../components/storefront/HighSchoolTimetable'
import ScheduleStrip from '../components/storefront/ScheduleStrip'
import { getPricingForGrade } from '../config/pricing'
import './HighSchoolPathways.css'

const HS_GRADES = ['9', '10', '11', '12']

function HighSchoolPathways() {
    const { t } = useTranslation()
    const [activeGrade, setActiveGrade] = useState('9')
    const pricing = getPricingForGrade(activeGrade)

    return (
        <div className="hs-pathways-page">
            {/* Hero */}
            <section className="hsp-hero">
                <div className="container">
                    <h1>{t('highSchool.hero.title', 'ONTARIO CURRICULUM PROGRAMS (Grades 9 to 12)')}</h1>
                    <h2 className="hsp-hero__subtitle">{t('highSchool.hero.subtitle', 'Flexible Learning Pathways')}</h2>
                    <p className="hsp-hero__tagline">{t('highSchool.hero.tagline', 'Learn First. Decide Later. Succeed Safely.')}</p>
                    <p className="hsp-hero__lede">{t('highSchool.lede')}</p>
                    <div className="hsp-hero__ctas">
                        <Link to="/academic-prep" className="btn btn-primary btn-lg">
                            {t('highSchool.dualCta.left', 'Start with Preparation')}
                        </Link>
                        <Link to="/official-ontario" className="btn btn-accent btn-lg">
                            {t('highSchool.dualCta.right', 'Earn OSSD Credits')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Pathway A & B cards */}
            <section className="hsp-pathways">
                <div className="container">
                    <div className="hsp-pathway-grid">
                        <div className="hsp-pathway-card hsp-pathway-card--academic">
                            <h3>{t('highSchool.pathwayA.title', 'Academic Preparation Program (Non-Credit)')}</h3>
                            <p>{t('highSchool.pathwayA.description')}</p>
                            <h4>{t('highSchool.pathwayA.outcomesTitle', 'Outcomes')}</h4>
                            <ul>
                                {[0, 1, 2, 3, 4].map(i => (
                                    <li key={i}>{t(`highSchool.pathwayA.outcomes.${i}`)}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="hsp-pathway-card hsp-pathway-card--official">
                            <span className="hsp-badge">Most Popular</span>
                            <h3>{t('highSchool.pathwayB.title', 'Ontario Secondary School Diploma (OSSD) Program')}</h3>
                            <p>{t('highSchool.pathwayB.description')}</p>
                            <h4>{t('highSchool.pathwayB.outcomesTitle', 'Outcomes')}</h4>
                            <ul>
                                {[0, 1, 2, 3].map(i => (
                                    <li key={i}>{t(`highSchool.pathwayB.outcomes.${i}`)}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Official HS section heading */}
            <section className="hsp-official-heading">
                <div className="container">
                    <h2>{t('highSchool.officialHeading', 'Ontario Official High School Program')}</h2>
                    <p className="hsp-official-sub">{t('highSchool.officialSubheading', 'Study with Canadian Teachers')}</p>
                    <p className="hsp-official-tagline">
                        Grade 9 and Grade 10 are 8-credit programs. Grade 11 and Grade 12 are 7-credit programs.
                    </p>
                </div>
            </section>

            {/* Grade tabs */}
            <section className="hsp-tabs-section">
                <div className="container">
                    <div className="hsp-grade-tabs" role="tablist">
                        {HS_GRADES.map(g => (
                            <button
                                key={g}
                                role="tab"
                                aria-selected={activeGrade === g}
                                className={`hsp-grade-tab ${activeGrade === g ? 'active' : ''}`}
                                onClick={() => setActiveGrade(g)}
                            >
                                {t(`highSchool.tabs.grade${g}`, `Grade ${g} Timetable`)}
                            </button>
                        ))}
                    </div>

                    {pricing && <HighSchoolTimetable grade={activeGrade} pricing={pricing} showLinks={false} />}

                    <div className="hsp-note-card">
                        <strong>Note:</strong> {t(`highSchool.grade${activeGrade}Note`)}
                    </div>
                </div>
            </section>

            {/* Fee strip */}
            <section className="hsp-fees">
                <div className="container">
                    <div className="hsp-fees-grid">
                        <div className="hsp-fee-card">{t('highSchool.fees.registration', 'Registration Fee: $100 CAD (non-refundable)')}</div>
                        <div className="hsp-fee-card">{t('highSchool.fees.entranceTest', 'Entrance Test Fee: $50 CAD (non-refundable)')}</div>
                    </div>
                </div>
            </section>

            {/* Why the dual pathway explainer */}
            <section className="hsp-dual-pathway">
                <div className="container">
                    <h2>{t('highSchool.dualPathway.title', 'Why the Dual Pathway?')}</h2>
                    <div className="hsp-dual-grid">
                        <div className="hsp-dual-card">
                            <h3>1. {t('highSchool.dualPathway.learnFirst.title', 'Learn First')}</h3>
                            <p>{t('highSchool.dualPathway.learnFirst.body')}</p>
                        </div>
                        <div className="hsp-dual-card">
                            <h3>2. {t('highSchool.dualPathway.decideLater.title', 'Decide Later')}</h3>
                            <p>{t('highSchool.dualPathway.decideLater.body')}</p>
                        </div>
                        <div className="hsp-dual-card">
                            <h3>3. {t('highSchool.dualPathway.succeedSafely.title', 'Succeed Safely')}</h3>
                            <p>{t('highSchool.dualPathway.succeedSafely.body')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Closing CTA */}
            <section className="hsp-cta-closing">
                <div className="container">
                    <div className="hsp-cta-buttons">
                        <Link to="/contact" className="btn btn-primary btn-lg">
                            {t('highSchool.cta.advisor', 'Speak with an Advisor')}
                        </Link>
                        <Link to="/official-ontario/grade/9" className="btn btn-accent btn-lg">
                            {t('highSchool.cta.browseCourses', 'Browse Grade 9 to 12 Courses')}
                        </Link>
                        <Link to="/schedule" className="btn btn-outline btn-lg">
                            {t('highSchool.cta.calendar', 'View Academic Calendar')}
                        </Link>
                    </div>
                    <ScheduleStrip />
                </div>
            </section>
        </div>
    )
}

export default HighSchoolPathways
