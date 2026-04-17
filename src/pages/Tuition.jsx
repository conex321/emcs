import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GRADE_LEVEL_PRICING, PRIMARY_FOUNDATION_LEGACY } from '../config/pricing'
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
    const hs9 = GRADE_LEVEL_PRICING['9']
    const hs11 = GRADE_LEVEL_PRICING['11']

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

                            <div className="pricing-grid">
                                <div className="pricing-card pricing-card--academic">
                                    <h3>Academic Preparation Program (Non-Credit)</h3>
                                    <p>{t('tuitionPage.bands.elementary.academicPrep')}</p>
                                    <ul className="pricing-breakdown">
                                        <li><span>Per course</span> <strong>${elem.academicPrep.salePrice} <s>${elem.academicPrep.listPrice}</s></strong></li>
                                        <li><span>Full year (6 subjects)</span> <strong>${elem.academicPrep.fullYear}</strong></li>
                                        <li><span>Registration Fee</span> <strong>${elem.registration}</strong></li>
                                        <li><span>Entrance Test Fee</span> <strong>Waived</strong></li>
                                    </ul>
                                </div>

                                <div className="pricing-card pricing-card--official" id="official-ontario">
                                    <h3>Upgrade to Ontario Official Program</h3>
                                    <p>{t('tuitionPage.bands.elementary.upgrade')}</p>
                                    <ul className="pricing-breakdown">
                                        <li><span>Per course</span> <strong>${elem.officialOntario.perCourse}</strong></li>
                                        <li><span>Full year (6 subjects)</span> <strong>${elem.officialOntario.fullYear}</strong></li>
                                        <li><span>Registration Fee</span> <strong>${elem.registration}</strong></li>
                                        <li><span>Entrance Test Fee</span> <strong>Waived</strong></li>
                                    </ul>
                                </div>

                                <div className="pricing-card pricing-card--legacy">
                                    <span className="pricing-card__badge">Premium Legacy</span>
                                    <h3>Primary Foundation Teacher-Led</h3>
                                    <p>{t('tuitionPage.bands.elementary.legacy')}</p>
                                    <ul className="pricing-breakdown">
                                        <li><span>Core Subjects (6, full year)</span> <strong>${PRIMARY_FOUNDATION_LEGACY.corePrice}</strong></li>
                                        <li><span>French as a Second Language (add-on)</span> <strong>${PRIMARY_FOUNDATION_LEGACY.frenchAddOn}</strong></li>
                                        <li><span>Registration Fee</span> <strong>${PRIMARY_FOUNDATION_LEGACY.registration}</strong></li>
                                        <li><span>Entrance Test Fee</span> <strong>${PRIMARY_FOUNDATION_LEGACY.entranceTest}</strong></li>
                                    </ul>
                                </div>
                            </div>
                            <ScheduleStrip />
                        </div>
                    )}

                    {activeTab === 'middle' && (
                        <div className="tuition-band">
                            <h2>{t('tuitionPage.bands.middle.heading', 'Middle School Pricing (Grades 6 to 8)')}</h2>
                            <p className="band-subtitle">{t('tuitionPage.bands.middle.subtitle')}</p>

                            <div className="pricing-grid">
                                <div className="pricing-card pricing-card--academic">
                                    <h3>Academic Preparation Program (Non-Credit)</h3>
                                    <p>{t('tuitionPage.bands.middle.academicPrep')}</p>
                                    <ul className="pricing-breakdown">
                                        <li><span>Per course</span> <strong>${mid.academicPrep.salePrice} <s>${mid.academicPrep.listPrice}</s></strong></li>
                                        <li><span>Full year (6 subjects)</span> <strong>${mid.academicPrep.fullYear}</strong></li>
                                        <li><span>Registration Fee</span> <strong>${mid.registration}</strong></li>
                                        <li><span>Entrance Test Fee</span> <strong>${mid.entranceTest}</strong></li>
                                    </ul>
                                </div>

                                <div className="pricing-card pricing-card--official">
                                    <h3>Upgrade to Ontario Official Program</h3>
                                    <p>{t('tuitionPage.bands.middle.upgrade')}</p>
                                    <ul className="pricing-breakdown">
                                        <li><span>Per course</span> <strong>${mid.officialOntario.perCourse}</strong></li>
                                        <li><span>Full year (6 subjects)</span> <strong>${mid.officialOntario.fullYear}</strong></li>
                                        <li><span>Registration Fee</span> <strong>${mid.registration}</strong></li>
                                        <li><span>Entrance Test Fee</span> <strong>${mid.entranceTest}</strong></li>
                                    </ul>
                                </div>
                            </div>
                            <ScheduleStrip />
                        </div>
                    )}

                    {activeTab === 'high' && (
                        <div className="tuition-band">
                            <h2>{t('tuitionPage.bands.high.heading', 'High School Pricing (Grades 9 to 12)')}</h2>
                            <p className="band-subtitle">{t('tuitionPage.bands.high.subtitle')}</p>

                            <div className="pricing-grid">
                                <div className="pricing-card pricing-card--academic">
                                    <h3>Academic Preparation Program (Non-Credit)</h3>
                                    <p>{t('tuitionPage.bands.high.academicPrep')}</p>
                                    <ul className="pricing-breakdown">
                                        <li><span>Per course</span> <strong>${hs9.academicPrep.salePrice} <s>${hs9.academicPrep.listPrice}</s></strong></li>
                                        <li><span>Grade 9–10 Full Year Bundle</span> <strong>Contact for tiered quotes</strong></li>
                                        <li><span>Registration Fee</span> <strong>${hs9.registration}</strong></li>
                                        <li><span>Entrance Test Fee</span> <strong>${hs9.entranceTest}</strong></li>
                                    </ul>
                                </div>

                                <div className="pricing-card pricing-card--official">
                                    <h3>Official Ontario Program</h3>
                                    <p>{t('tuitionPage.bands.high.official')}</p>
                                    <ul className="pricing-breakdown">
                                        <li><span>Per course</span> <strong>From ${hs9.officialOntario.perCourse}</strong></li>
                                        <li><span>Grade 9 & 10 (8-credit)</span> <strong>From ${hs9.officialOntario.fullYear}</strong></li>
                                        <li><span>Grade 11 & 12 (7-credit)</span> <strong>From ${hs11.officialOntario.fullYear}</strong></li>
                                        <li><span>Registration Fee</span> <strong>${hs9.registration}</strong></li>
                                    </ul>
                                </div>
                            </div>
                            <p className="tuition-footnote">
                                Contact admissions for domestic, visa, and international tier quotes.
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
                                            <th>Full Year Bundle</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Grades 1–5</td>
                                            <td>Academic Preparation</td>
                                            <td>$50</td>
                                            <td>Waived</td>
                                            <td>$75 <s>$150</s></td>
                                            <td>$325 (6 subjects)</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 1–5</td>
                                            <td>Upgrade to Ontario Official</td>
                                            <td>$50</td>
                                            <td>Waived</td>
                                            <td>$250</td>
                                            <td>$600 (6 subjects)</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 1–5</td>
                                            <td>Primary Foundation Teacher-Led (Legacy)</td>
                                            <td>$100</td>
                                            <td>$50</td>
                                            <td>Included</td>
                                            <td>$3,500</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 6–8</td>
                                            <td>Academic Preparation</td>
                                            <td>$50</td>
                                            <td>$50</td>
                                            <td>$75 <s>$150</s></td>
                                            <td>$325 (6 subjects)</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 6–8</td>
                                            <td>Upgrade to Ontario Official</td>
                                            <td>$50</td>
                                            <td>$50</td>
                                            <td>$250</td>
                                            <td>$600 (6 subjects)</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 9–10</td>
                                            <td>Official Ontario (8-credit)</td>
                                            <td>$100</td>
                                            <td>$50</td>
                                            <td>From $700</td>
                                            <td>From $3,800</td>
                                        </tr>
                                        <tr>
                                            <td>Grades 11–12</td>
                                            <td>Official Ontario (7-credit)</td>
                                            <td>$100</td>
                                            <td>$50</td>
                                            <td>From $700</td>
                                            <td>From $3,800</td>
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
                            {t('tuitionPage.ctaAcademicPrep', 'Browse Academic Prep')}
                        </Link>
                        <Link to="/official-ontario" className="btn btn-accent btn-lg">
                            {t('tuitionPage.ctaOfficialOntario', 'Browse Official Ontario')}
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
