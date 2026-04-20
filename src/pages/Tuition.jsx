import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GRADE_LEVEL_PRICING, formatCurrency } from '../config/pricing'
import ScheduleStrip from '../components/storefront/ScheduleStrip'
import './Tuition.css'

const TABS = ['elementary', 'middle', 'high', 'feeSchedule', 'payment']

function Tuition() {
    const { t } = useTranslation()
    const location = useLocation()
    const [activeTab, setActiveTab] = useState('elementary')

    // Handle hash-anchor navigation from Program dropdown
    useEffect(() => {
        if (location.hash === '#academic-prep' || location.hash === '#official-ontario') {
            setActiveTab('elementary')
            const el = document.getElementById(location.hash.substring(1))
            if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
    }, [location.hash])

    const elem = GRADE_LEVEL_PRICING['1-5']
    const mid = GRADE_LEVEL_PRICING['6-8']
    const hs = GRADE_LEVEL_PRICING['9-12']

    const renderBand = (band, { bandLabel, subtitle, includeSingleCredit = false }) => (
        <div className="pricing-grid">
            <div className="pricing-card pricing-card--academic">
                <h3>Non-Academic Ontario Record</h3>
                <p>Self-paced LMS pathway — no Ontario student record. Ideal for students building foundations.</p>
                <ul className="pricing-breakdown">
                    <li><span>Per course</span> <strong>{formatCurrency(band.nonAcademicOntarioRecord.perCourse)}</strong></li>
                    <li><span>Full year (6 courses)</span> <strong>{formatCurrency(band.nonAcademicOntarioRecord.bundle6)}</strong></li>
                    <li><span>Registration Fee</span> <strong>{formatCurrency(band.registration)}</strong></li>
                    <li><span>Entrance Test Fee</span> <strong>{band.entranceTest === 0 ? 'Waived' : formatCurrency(band.entranceTest)}</strong></li>
                </ul>
            </div>

            {band.hasUpgradeTier && band.upgradeToOntarioRecord && (
                <div className="pricing-card pricing-card--official" id={bandLabel === 'high' ? 'official-ontario' : undefined}>
                    <h3>Upgrade to Ontario Record</h3>
                    <p>Convert an existing Non-Academic course into the credit-bearing Ontario Record at any time (Grades 9 – 12 only).</p>
                    <ul className="pricing-breakdown">
                        <li><span>Upgrade delta (per course)</span> <strong>+{formatCurrency(band.upgradeToOntarioRecord.addOnPerCourse)}</strong></li>
                        <li><span>Total per course after upgrade</span> <strong>{formatCurrency(band.upgradeToOntarioRecord.totalPerCourse)}</strong></li>
                        <li><span>Full year upgrade (6 courses)</span> <strong>{formatCurrency(band.upgradeToOntarioRecord.bundle6)}</strong></li>
                        <li><span>Registration Fee</span> <strong>{formatCurrency(band.registration)}</strong></li>
                        <li><span>Entrance Test Fee</span> <strong>{band.entranceTest === 0 ? 'Waived' : formatCurrency(band.entranceTest)}</strong></li>
                    </ul>
                </div>
            )}

            <div className="pricing-card pricing-card--academic-ontario">
                <h3>Academic Ontario Record</h3>
                <p>Credit-bearing direct-purchase pathway (Ontario student record). Two delivery modes.</p>
                <ul className="pricing-breakdown">
                    <li><span>Self-paced — per course</span> <strong>{formatCurrency(band.academicOntarioRecord.selfPaced.perCourse)}</strong></li>
                    <li><span>Self-paced — full year (6 courses)</span> <strong>{formatCurrency(band.academicOntarioRecord.selfPaced.bundle6)}</strong></li>
                    {includeSingleCredit && band.academicOntarioRecord.selfPaced.singleCreditStandalone && (
                        <li><span>Single credit (standalone)</span> <strong>{formatCurrency(band.academicOntarioRecord.selfPaced.singleCreditStandalone)}</strong></li>
                    )}
                    <li><span>Live Teacher — per year (6 courses)</span> <strong>{formatCurrency(band.academicOntarioRecord.liveTeacher.annual)}</strong></li>
                    <li><span>Registration Fee</span> <strong>{formatCurrency(band.registration)}</strong></li>
                    <li><span>Entrance Test Fee</span> <strong>{band.entranceTest === 0 ? 'Waived' : formatCurrency(band.entranceTest)}</strong></li>
                </ul>
            </div>
        </div>
    )

    return (
        <div className="tuition-page">
            <section className="tuition-hero">
                <div className="container">
                    <h1>{t('tuitionPage.hero.title', 'Tuition and Fees')}</h1>
                    <p>{t('tuitionPage.hero.subtitle', 'Transparent pricing with no hidden costs')}</p>
                </div>
            </section>

            <section className="tuition-body">
                <div className="container">
                    <div className="tuition-tabs" role="tablist">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                role="tab"
                                aria-selected={activeTab === tab}
                                className={`tuition-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {t(`tuitionPage.tabs.${tab}`, tab)}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'elementary' && (
                        <div className="tuition-band">
                            <h2 id="academic-prep">{t('tuitionPage.bands.elementary.heading', 'Elementary Pricing (Grades 1 to 5)')}</h2>
                            <p className="band-subtitle">{t('tuitionPage.bands.elementary.subtitle')}</p>
                            {renderBand(elem, { bandLabel: 'elementary' })}
                            <ScheduleStrip />
                        </div>
                    )}

                    {activeTab === 'middle' && (
                        <div className="tuition-band">
                            <h2>{t('tuitionPage.bands.middle.heading', 'Middle School Pricing (Grades 6 to 8)')}</h2>
                            <p className="band-subtitle">{t('tuitionPage.bands.middle.subtitle')}</p>
                            {renderBand(mid, { bandLabel: 'middle' })}
                            <ScheduleStrip />
                        </div>
                    )}

                    {activeTab === 'high' && (
                        <div className="tuition-band">
                            <h2>{t('tuitionPage.bands.high.heading', 'High School Pricing (Grades 9 to 12)')}</h2>
                            <p className="band-subtitle">{t('tuitionPage.bands.high.subtitle')}</p>
                            {renderBand(hs, { bandLabel: 'high', includeSingleCredit: true })}
                            <p className="tuition-footnote">
                                Single-credit standalone pricing ({formatCurrency(hs.academicOntarioRecord.selfPaced.singleCreditStandalone)}) applies to one-off credit purchases outside the full-year plan.
                                MCV4U must be taken after MHF4U (Grade 12 sequencing requirement).
                            </p>
                            <ScheduleStrip />
                        </div>
                    )}

                    {activeTab === 'feeSchedule' && (
                        <div className="tuition-band">
                            <h2>{t('tuitionPage.feeScheduleHeading', 'Consolidated Fee Schedule')}</h2>
                            <div className="fee-schedule-table-wrapper">
                                <table className="fee-schedule-table">
                                    <thead>
                                        <tr>
                                            <th>Grade Band</th>
                                            <th>Program</th>
                                            <th>Registration</th>
                                            <th>Entrance Test</th>
                                            <th>Per Course</th>
                                            <th>Full Year Bundle (6 courses)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Grades 1–5</td>
                                            <td>Non-Academic Ontario Record</td>
                                            <td>{formatCurrency(elem.registration)}</td>
                                            <td>Waived</td>
                                            <td>{formatCurrency(elem.nonAcademicOntarioRecord.perCourse)}</td>
                                            <td>{formatCurrency(elem.nonAcademicOntarioRecord.bundle6)}</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 1–5</td>
                                            <td>Academic Ontario Record — Self-paced</td>
                                            <td>{formatCurrency(elem.registration)}</td>
                                            <td>Waived</td>
                                            <td>{formatCurrency(elem.academicOntarioRecord.selfPaced.perCourse)}</td>
                                            <td>{formatCurrency(elem.academicOntarioRecord.selfPaced.bundle6)}</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 1–5</td>
                                            <td>Academic Ontario Record — Live Teacher</td>
                                            <td>{formatCurrency(elem.registration)}</td>
                                            <td>Waived</td>
                                            <td>Included</td>
                                            <td>{formatCurrency(elem.academicOntarioRecord.liveTeacher.annual)} / year</td>
                                        </tr>

                                        <tr>
                                            <td>Grades 6–8</td>
                                            <td>Non-Academic Ontario Record</td>
                                            <td>{formatCurrency(mid.registration)}</td>
                                            <td>{formatCurrency(mid.entranceTest)}</td>
                                            <td>{formatCurrency(mid.nonAcademicOntarioRecord.perCourse)}</td>
                                            <td>{formatCurrency(mid.nonAcademicOntarioRecord.bundle6)}</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 6–8</td>
                                            <td>Academic Ontario Record — Self-paced</td>
                                            <td>{formatCurrency(mid.registration)}</td>
                                            <td>{formatCurrency(mid.entranceTest)}</td>
                                            <td>{formatCurrency(mid.academicOntarioRecord.selfPaced.perCourse)}</td>
                                            <td>{formatCurrency(mid.academicOntarioRecord.selfPaced.bundle6)}</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 6–8</td>
                                            <td>Academic Ontario Record — Live Teacher</td>
                                            <td>{formatCurrency(mid.registration)}</td>
                                            <td>{formatCurrency(mid.entranceTest)}</td>
                                            <td>Included</td>
                                            <td>{formatCurrency(mid.academicOntarioRecord.liveTeacher.annual)} / year</td>
                                        </tr>

                                        <tr>
                                            <td>Grades 9–12</td>
                                            <td>Non-Academic Ontario Record</td>
                                            <td>{formatCurrency(hs.registration)}</td>
                                            <td>{formatCurrency(hs.entranceTest)}</td>
                                            <td>{formatCurrency(hs.nonAcademicOntarioRecord.perCourse)}</td>
                                            <td>{formatCurrency(hs.nonAcademicOntarioRecord.bundle6)}</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 9–12</td>
                                            <td>Upgrade to Ontario Record</td>
                                            <td>{formatCurrency(hs.registration)}</td>
                                            <td>{formatCurrency(hs.entranceTest)}</td>
                                            <td>{formatCurrency(hs.upgradeToOntarioRecord.totalPerCourse)} <small>(+{formatCurrency(hs.upgradeToOntarioRecord.addOnPerCourse)} delta)</small></td>
                                            <td>{formatCurrency(hs.upgradeToOntarioRecord.bundle6)}</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 9–12</td>
                                            <td>Academic Ontario Record — Self-paced</td>
                                            <td>{formatCurrency(hs.registration)}</td>
                                            <td>{formatCurrency(hs.entranceTest)}</td>
                                            <td>{formatCurrency(hs.academicOntarioRecord.selfPaced.perCourse)}</td>
                                            <td>{formatCurrency(hs.academicOntarioRecord.selfPaced.bundle6)}</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 9–12</td>
                                            <td>Academic Ontario Record — Single Credit (standalone)</td>
                                            <td>{formatCurrency(hs.registration)}</td>
                                            <td>{formatCurrency(hs.entranceTest)}</td>
                                            <td>{formatCurrency(hs.academicOntarioRecord.selfPaced.singleCreditStandalone)}</td>
                                            <td>—</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 9–12</td>
                                            <td>Academic Ontario Record — Live Teacher</td>
                                            <td>{formatCurrency(hs.registration)}</td>
                                            <td>{formatCurrency(hs.entranceTest)}</td>
                                            <td>Included</td>
                                            <td>{formatCurrency(hs.academicOntarioRecord.liveTeacher.annual)} / year</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="tuition-footnote">{t('tuitionPage.feeScheduleNote')}</p>
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <div className="tuition-band">
                            <h2>{t('tuitionPage.paymentHeading', 'Payment Methods')}</h2>
                            <ul className="payment-methods">
                                {[0, 1, 2].map(i => (
                                    <li key={i}>{t(`tuitionPage.paymentMethods.${i}`)}</li>
                                ))}
                            </ul>
                            <p className="tuition-footnote">
                                All fees are non-refundable. Refund eligibility on tuition depends on course progress — contact admissions for details.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <section className="tuition-cta-section">
                <div className="container">
                    <h2>{t('tuitionPage.ctaTitle', 'Ready to Enroll?')}</h2>
                    <p>{t('tuitionPage.ctaSubtitle', 'Start your Canadian education journey today.')}</p>
                    <div className="tuition-cta-buttons">
                        <Link to="/academic-prep" className="btn btn-primary btn-lg">
                            {t('tuitionPage.ctaAcademicPrep', 'Browse Non-Academic Program')}
                        </Link>
                        <Link to="/official-ontario" className="btn btn-accent btn-lg">
                            {t('tuitionPage.ctaOfficialOntario', 'Browse Academic Ontario Record')}
                        </Link>
                        <Link to="/contact" className="btn btn-outline btn-lg">
                            {t('tuitionPage.ctaContact', 'Contact Us')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Tuition
