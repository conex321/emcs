import { useTranslation } from 'react-i18next'
import './About.css'

function About() {
    const { t } = useTranslation()

    const accreditationItems = [
        { label: t('about.accreditationDetails.ministryInspection'), value: t('about.accreditationDetails.bsid') },
        { label: t('about.accreditationDetails.creditRecognition'), value: t('about.accreditationDetails.creditDetails') },
        { label: t('about.accreditationDetails.transcriptDelivery'), value: t('about.accreditationDetails.transcriptDetails') }
    ]

    const whatThisMeans = [
        t('about.whatThisMeans.point1'),
        t('about.whatThisMeans.point2'),
        t('about.whatThisMeans.point3'),
        t('about.whatThisMeans.point4')
    ]

    return (
        <div className="about-page">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="container">
                    <div className="about-hero-content animate-fade-in-up">
                        <span className="badge badge-accent">{t('about.subtitle')}</span>
                        <h1>{t('about.title')}</h1>
                    </div>
                </div>
            </section>

            {/* Who We Are Section */}
            <section className="who-we-are-section section">
                <div className="container">
                    <div className="who-we-are-content">
                        <h2>{t('about.whoWeAre.title')}</h2>
                        <p className="lead-text">{t('about.whoWeAre.content')}</p>
                        <p className="bsid-text"><strong>{t('about.whoWeAre.bsid')}</strong></p>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="story-section section bg-light">
                <div className="container">
                    <div className="story-content card animate-fade-in-up">
                        <h2>{t('about.story')}</h2>
                        <p>{t('about.storyText')}</p>
                    </div>
                </div>
            </section>

            {/* Mission & Philosophy Section */}
            <section className="mission-section section">
                <div className="container">
                    <div className="mission-grid">
                        <div className="mission-card card animate-fade-in-up">
                            <div className="mission-icon">🎯</div>
                            <h3>{t('about.mission')}</h3>
                            <p>{t('about.missionText')}</p>
                        </div>
                        <div className="mission-card card animate-fade-in-up stagger-1">
                            <div className="mission-icon">💡</div>
                            <h3>{t('about.philosophy.title')}</h3>
                            <p>{t('about.philosophy.content')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Accreditation Section */}
            <section className="accreditation-about-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('about.accreditation')}</h2>
                    </div>
                    <div className="accreditation-grid">
                        {accreditationItems.map((item, index) => (
                            <div key={index} className="accreditation-item card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <span className="accred-label">{item.label}</span>
                                <span className="accred-value">{item.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="what-this-means card animate-fade-in-up">
                        <h3>{t('about.whatThisMeans.title')}</h3>
                        <ul>
                            {whatThisMeans.map((point, index) => (
                                <li key={index}>
                                    <span className="check-icon">✓</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="values-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('about.values.title', 'Our Values')}</h2>
                    </div>
                    <div className="values-grid">
                        <div className="value-item animate-fade-in-up">
                            <div className="value-number">01</div>
                            <h3>{t('about.values.excellence.title')}</h3>
                            <p>{t('about.values.excellence.desc')}</p>
                        </div>
                        <div className="value-item animate-fade-in-up stagger-1">
                            <div className="value-number">02</div>
                            <h3>{t('about.values.accessibility.title')}</h3>
                            <p>{t('about.values.accessibility.desc')}</p>
                        </div>
                        <div className="value-item animate-fade-in-up stagger-2">
                            <div className="value-number">03</div>
                            <h3>{t('about.values.innovation.title')}</h3>
                            <p>{t('about.values.innovation.desc')}</p>
                        </div>
                        <div className="value-item animate-fade-in-up stagger-3">
                            <div className="value-number">04</div>
                            <h3>{t('about.values.support.title')}</h3>
                            <p>{t('about.values.support.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

export default About
