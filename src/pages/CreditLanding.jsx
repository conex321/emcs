import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './StorefrontLanding.css'

function CreditLanding() {
    const { t } = useTranslation()

    const grades = ['9', '10', '11', '12']

    const features = [
        {
            icon: '🏛️',
            title: t('storefront.credit.features.ministryApproved'),
            desc: t('storefront.credit.features.ministryApprovedDesc'),
        },
        {
            icon: '👨‍🏫',
            title: t('storefront.credit.features.certifiedTeachers'),
            desc: t('storefront.credit.features.certifiedTeachersDesc'),
        },
        {
            icon: '📹',
            title: t('storefront.credit.features.liveClasses'),
            desc: t('storefront.credit.features.liveClassesDesc'),
        },
        {
            icon: '📋',
            title: t('storefront.credit.features.officialTranscripts'),
            desc: t('storefront.credit.features.officialTranscriptsDesc'),
        },
    ]

    const schedule = {
        hoursPerWeek: 6,
        daysPerWeek: 3,
        hoursPerSession: 2,
    }

    const included = [
        t('storefront.credit.included.liveZoom'),
        t('storefront.credit.included.replays'),
        t('storefront.credit.included.assignments'),
        t('storefront.credit.included.quizzes'),
        t('storefront.credit.included.finalExam'),
        t('storefront.credit.included.transcript'),
        t('storefront.credit.included.reportCard'),
        t('storefront.credit.included.freeNonCredit'),
    ]

    const gradeSubtitles = {
        '9': t('storefront.credit.foundation'),
        '10': t('storefront.credit.academicFocus'),
        '11': t('storefront.credit.preUniversity'),
        '12': t('storefront.credit.universityPrep'),
    }

    return (
        <div className="storefront-landing credit">
            {/* Hero */}
            <section className="storefront-hero credit-hero" style={{ '--storefront-color': '#D4AF37' }}>
                <div className="container">
                    <div className="hero-content">
                        <div className="hero-badges">
                            <span className="storefront-badge credit-badge">{t('storefront.credit.labelFull')}</span>
                            <span className="ministry-badge">{t('storefront.credit.ministryApproved')}</span>
                        </div>
                        <h1>{t('storefront.credit.title')}</h1>
                        <p className="hero-subtitle">
                            {t('storefront.credit.subtitle')}
                        </p>

                        <div className="hero-highlights">
                            <div className="highlight-item">
                                <span className="highlight-icon">📅</span>
                                <span className="highlight-text">{schedule.hoursPerWeek} {t('storefront.credit.hrsPerWeek')}</span>
                            </div>
                            <div className="highlight-item">
                                <span className="highlight-icon">🎓</span>
                                <span className="highlight-text">{t('storefront.credit.ossdCredit')}</span>
                            </div>
                            <div className="highlight-item">
                                <span className="highlight-icon">💰</span>
                                <span className="highlight-text">{t('storefront.credit.fromPrice')}</span>
                            </div>
                        </div>

                        <div className="hero-cta">
                            <a href="#grades" className="btn btn-accent btn-lg">{t('storefront.credit.browseCta')}</a>
                            <Link to="/non-credit" className="btn btn-outline btn-lg">
                                {t('storefront.credit.nonCreditLink')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="storefront-features section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('storefront.credit.whyEmcs')}</h2>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card">
                                <span className="feature-icon">{feature.icon}</span>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What's Included */}
            <section className="included-section section bg-light">
                <div className="container">
                    <div className="included-content">
                        <div className="included-left">
                            <h2>{t('storefront.credit.whatsIncluded')}</h2>
                            <ul className="included-list">
                                {included.map((item, index) => (
                                    <li key={index}>
                                        <span className="check-icon">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="schedule-card card">
                            <h3>{t('storefront.credit.schedule')}</h3>
                            <div className="schedule-details">
                                <div className="schedule-item">
                                    <span className="schedule-value">{schedule.hoursPerWeek}</span>
                                    <span className="schedule-label">{t('storefront.credit.hoursWeek')}</span>
                                </div>
                                <div className="schedule-item">
                                    <span className="schedule-value">{schedule.daysPerWeek}</span>
                                    <span className="schedule-label">{t('storefront.credit.daysWeek')}</span>
                                </div>
                                <div className="schedule-item">
                                    <span className="schedule-value">{schedule.hoursPerSession}</span>
                                    <span className="schedule-label">{t('storefront.credit.hoursSession')}</span>
                                </div>
                            </div>
                            <p className="schedule-note">{t('storefront.credit.scheduleDesc')}</p>
                            <p className="schedule-note">{t('storefront.credit.smallGroups')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse by Grade */}
            <section id="grades" className="grade-browser section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('storefront.credit.browseGrade')}</h2>
                        <p className="section-subtitle">{t('storefront.credit.browseGradeSubtitle')}</p>
                    </div>

                    <div className="grade-cards-row">
                        {grades.map(grade => (
                            <Link
                                key={grade}
                                to={`/credit/grade/${grade}`}
                                className="grade-card-large card"
                            >
                                <span className="grade-number">{t('storefront.grade.grade')} {grade}</span>
                                <span className="grade-subtitle">{gradeSubtitles[grade]}</span>
                                <span className="grade-subjects">Math • Science • English</span>
                                <span className="grade-cta">{t('storefront.credit.viewCourses')}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Bundle Highlight */}
            <section className="bundle-highlight section">
                <div className="container">
                    <div className="bundle-card card">
                        <div className="bundle-icon">🎁</div>
                        <div className="bundle-content">
                            <h3>{t('storefront.credit.freeBundle')}</h3>
                            <p>{t('storefront.credit.freeBundleDesc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="storefront-cta credit-cta section" style={{ '--storefront-color': '#D4AF37' }}>
                <div className="container text-center">
                    <h2>{t('storefront.credit.readyToEarn')}</h2>
                    <p>{t('storefront.credit.readyToEarnSubtitle')}</p>
                    <div className="cta-buttons">
                        <Link to="/credit/grade/12" className="btn btn-accent btn-lg">
                            {t('storefront.credit.viewGrade12')}
                        </Link>
                        <Link to="/contact" className="btn btn-outline-light btn-lg">
                            {t('storefront.credit.speakCounselor')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default CreditLanding
