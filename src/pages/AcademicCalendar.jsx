import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './AcademicCalendar.css'

function AcademicCalendar() {
    const { t } = useTranslation()

    return (
        <div className="academic-calendar-page">
            <section className="calendar-hero">
                <div className="container">
                    <h1>{t('schedulePage.hero.title', 'Academic Calendar 2026 to 2027')}</h1>
                    <p>{t('schedulePage.hero.subtitle', 'September 5, 2026 to May 30, 2027 · 39 instructional weeks')}</p>
                </div>
            </section>

            <section className="calendar-body">
                <div className="container">
                    <div className="calendar-overview-card">
                        <h2>{t('schedulePage.overview.heading', 'Calendar Overview')}</h2>
                        <div className="calendar-grid">
                            <div className="calendar-item">
                                <span className="calendar-item__icon">🟢</span>
                                <div>
                                    <strong>{t('schedulePage.overview.start', 'Program Start: September 5, 2026')}</strong>
                                </div>
                            </div>
                            <div className="calendar-item">
                                <span className="calendar-item__icon">🏁</span>
                                <div>
                                    <strong>{t('schedulePage.overview.end', 'Program End: May 30, 2027')}</strong>
                                </div>
                            </div>
                            <div className="calendar-item">
                                <span className="calendar-item__icon">❄️</span>
                                <div>
                                    <strong>{t('schedulePage.overview.winter', 'Winter Break: mid-December 2026 to early January 2027')}</strong>
                                </div>
                            </div>
                            <div className="calendar-item">
                                <span className="calendar-item__icon">🌷</span>
                                <div>
                                    <strong>{t('schedulePage.overview.march', 'March Break: mid-March 2027')}</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="continuous-banner">
                        <span className="continuous-banner__icon">♾️</span>
                        <p>{t('schedulePage.continuousBanner')}</p>
                    </div>

                    <div className="calendar-module">
                        <h2>{t('schedulePage.assessmentHeading', 'Assessment Windows')}</h2>
                        <p>{t('schedulePage.assessmentBody')}</p>
                    </div>

                    <div className="calendar-module">
                        <h2>{t('schedulePage.transcriptHeading', 'Transcript Delivery Deadlines')}</h2>
                        <p>{t('schedulePage.transcriptBody')}</p>
                    </div>

                    <div className="calendar-module">
                        <h2>{t('schedulePage.programCardsHeading', 'Program-Specific Schedules')}</h2>
                        <div className="program-cards-grid">
                            <div className="program-card">
                                <h3>Academic Preparation Program</h3>
                                <p>{t('schedulePage.programCards.academicPrep')}</p>
                            </div>
                            <div className="program-card">
                                <h3>Official Ontario (Grades 9 & 10)</h3>
                                <p>{t('schedulePage.programCards.officialHs910')}</p>
                            </div>
                            <div className="program-card">
                                <h3>Official Ontario (Grades 11 & 12)</h3>
                                <p>{t('schedulePage.programCards.officialHs1112')}</p>
                            </div>
                            <div className="program-card">
                                <h3>Primary Foundation Teacher-Led</h3>
                                <p>{t('schedulePage.programCards.primaryFoundation')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="calendar-download">
                        <Link to="/contact" className="btn btn-primary btn-lg">
                            📄 {t('schedulePage.downloadCta', 'Download the 2026 to 2027 Academic Calendar (PDF)')}
                        </Link>
                        <p className="calendar-download__note">PDF available on request from admissions.</p>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AcademicCalendar
