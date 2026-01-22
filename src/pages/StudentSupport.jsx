import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './StudentSupport.css'

function StudentSupport() {
    const { t } = useTranslation()

    const services = [
        {
            icon: '🎯',
            title: t('support.services.guidance.title'),
            desc: t('support.services.guidance.desc'),
            features: t('support.services.guidance.features', { returnObjects: true })
        },
        {
            icon: '🎓',
            title: t('support.services.university.title'),
            desc: t('support.services.university.desc'),
            features: t('support.services.university.features', { returnObjects: true })
        },
        {
            icon: '👨‍🏫',
            title: t('support.services.academic.title'),
            desc: t('support.services.academic.desc'),
            features: t('support.services.academic.features', { returnObjects: true })
        },
        {
            icon: '💻',
            title: t('support.services.tech.title'),
            desc: t('support.services.tech.desc'),
            features: t('support.services.tech.features', { returnObjects: true })
        }
    ]

    return (
        <div className="support-page">
            {/* Hero */}
            <section className="support-hero">
                <div className="container">
                    <h1>{t('nav.support')}</h1>
                    <p>{t('support.subtitle')}</p>
                </div>
            </section>

            {/* Services */}
            <section className="services-section section">
                <div className="container">
                    <div className="services-grid">
                        {services.map((service, index) => (
                            <div key={index} className="service-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="service-icon">{service.icon}</div>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                                <ul className="service-features">
                                    {service.features.map((feature, i) => (
                                        <li key={i}>
                                            <span className="check">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('support.howTo.title')}</h2>
                        <p className="section-subtitle">{t('support.howTo.subtitle')}</p>
                    </div>
                    <div className="how-grid">
                        <div className="how-card card">
                            <div className="how-number">1</div>
                            <h4>{t('support.howTo.email.title')}</h4>
                            <p>{t('support.howTo.email.desc')}</p>
                        </div>
                        <div className="how-card card">
                            <div className="how-number">2</div>
                            <h4>{t('support.howTo.book.title')}</h4>
                            <p>{t('support.howTo.book.desc')}</p>
                        </div>
                        <div className="how-card card">
                            <div className="how-number">3</div>
                            <h4>{t('support.howTo.chat.title')}</h4>
                            <p>{t('support.howTo.chat.desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="support-cta">
                <div className="container text-center">
                    <h2>{t('support.cta.title')}</h2>
                    <p>{t('support.cta.subtitle')}</p>
                    <Link to="/contact" className="btn btn-accent btn-lg">{t('support.cta.button')}</Link>
                </div>
            </section>
        </div>
    )
}

export default StudentSupport
