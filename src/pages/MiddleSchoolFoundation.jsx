import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GradeGroupPanel from '../components/storefront/GradeGroupPanel'
import ScheduleStrip from '../components/storefront/ScheduleStrip'
import { GRADE_LEVEL_PRICING } from '../config/pricing'
import './MiddleSchoolFoundation.css'

const GRADES = ['6', '7', '8']

function MiddleSchoolFoundation() {
    const { t } = useTranslation()
    const pricing = GRADE_LEVEL_PRICING['6-8']

    return (
        <div className="middle-school-foundation-page">
            <section className="msf-hero">
                <div className="container">
                    <span className="msf-hero__badge">{t('middleSchool.hero.badge', 'Grades 6 to 8 Foundation')}</span>
                    <h1>{t('middleSchool.hero.title', 'Ontario Middle School Foundation Program')}</h1>
                    <p className="msf-hero__tagline">{t('middleSchool.hero.tagline', 'Build the bridge from elementary to high school success')}</p>
                </div>
            </section>

            <section className="msf-overview">
                <div className="container">
                    <h2>{t('middleSchool.overview.title', 'Program Overview')}</h2>
                    <p>{t('middleSchool.overview.body')}</p>
                </div>
            </section>

            <section className="msf-panel-section">
                <div className="container">
                    <GradeGroupPanel groupSlug="middle" context="both" />
                </div>
            </section>

            <section className="msf-pricing">
                <div className="container">
                    <h2>Pricing Summary (Grades 6 to 8)</h2>
                    <table className="msf-pricing-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Academic Preparation</th>
                                <th>Upgrade to Official Ontario</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Per Course</td>
                                <td>${pricing.academicPrep.salePrice} <s>${pricing.academicPrep.listPrice}</s> (50% off)</td>
                                <td>${pricing.officialOntario.perCourse}</td>
                            </tr>
                            <tr>
                                <td>Full Year (6 subjects)</td>
                                <td>${pricing.academicPrep.fullYear}</td>
                                <td>${pricing.officialOntario.fullYear}</td>
                            </tr>
                            <tr>
                                <td>Registration Fee</td>
                                <td>${pricing.registration}</td>
                                <td>${pricing.registration}</td>
                            </tr>
                            <tr>
                                <td>Entrance Test Fee</td>
                                <td>${pricing.entranceTest} (non-refundable)</td>
                                <td>${pricing.entranceTest} (non-refundable)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="msf-grades">
                <div className="container">
                    <h2>Grade-by-Grade Breakdown</h2>
                    <div className="msf-grade-cards">
                        {GRADES.map(g => (
                            <div key={g} className="msf-grade-card">
                                <h3>{t(`middleSchool.grades.grade${g}.title`, `Grade ${g}`)}</h3>
                                <p>{t(`middleSchool.grades.grade${g}.body`)}</p>
                                <Link to={`/grade/${g}`} className="btn btn-outline">
                                    View Grade {g} Programs
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="msf-french">
                <div className="container">
                    <h2>{t('middleSchool.french.title', 'French as a Second Language')}</h2>
                    <p>{t('middleSchool.french.body')}</p>
                </div>
            </section>

            <section className="msf-upgrade">
                <div className="container">
                    <h2>{t('middleSchool.upgrade.title', 'Upgrade Path')}</h2>
                    <p>{t('middleSchool.upgrade.body')}</p>
                </div>
            </section>

            <section className="msf-cta">
                <div className="container">
                    <h2>{t('middleSchool.cta.title', 'Ready to Build Your Middle School Foundation?')}</h2>
                    <p>{t('middleSchool.cta.subtitle', 'Choose a pathway and start your Ontario-aligned learning journey today.')}</p>
                    <div className="msf-cta-buttons">
                        <Link to="/academic-prep/group/middle" className="btn btn-primary btn-lg">
                            {t('middleSchool.cta.enroll', 'Enroll in Academic Prep')}
                        </Link>
                        <Link to="/official-ontario/group/middle" className="btn btn-accent btn-lg">
                            {t('middleSchool.cta.upgrade', 'Upgrade to Official Ontario')}
                        </Link>
                        <Link to="/contact" className="btn btn-outline btn-lg">
                            {t('middleSchool.cta.contact', 'Speak with an Advisor')}
                        </Link>
                    </div>
                    <ScheduleStrip />
                </div>
            </section>
        </div>
    )
}

export default MiddleSchoolFoundation
