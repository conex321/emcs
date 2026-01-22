import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './Home.css'

function Home() {
    const { t, i18n } = useTranslation()

    const trustIndicators = [
        { label: t('trustIndicators.ministryInspected'), value: t('trustIndicators.bsid'), icon: '✓' },
        { label: t('trustIndicators.yearsExperience'), value: t('trustIndicators.since'), icon: '📅' },
        { label: t('trustIndicators.studentsWorldwide'), value: t('trustIndicators.countries'), icon: '🌍' },
        { label: t('trustIndicators.courseCompletion'), value: t('trustIndicators.completionTime'), icon: '⏱️' },
        { label: t('trustIndicators.teacherSupport'), value: t('trustIndicators.responseTime'), icon: '👨‍🏫' },
        { label: t('trustIndicators.transcriptDelivery'), value: t('trustIndicators.directTo'), icon: '📤' }
    ]

    const programPathways = [
        {
            id: 'elementary',
            title: t('programPathways.elementary.title'),
            desc: t('programPathways.elementary.desc'),
            price: t('programPathways.elementary.price'),
            cta: t('programPathways.elementary.cta'),
            link: '/programs/elementary',
            color: '#27AE60',
            icon: '🏫',
            badge: i18n.language === 'vi' ? 'Lớp 1-5' : 'Grades 1-5'
        },
        {
            id: 'middle',
            title: t('programPathways.middle.title'),
            desc: t('programPathways.middle.desc'),
            cta: t('programPathways.middle.cta'),
            link: '/non-credit/grade/6',
            color: '#9B51E0',
            icon: '📚',
            badge: i18n.language === 'vi' ? 'Lớp 6-8' : 'Grades 6-8'
        },
        {
            id: 'highschool',
            title: t('programPathways.highSchool.title'),
            desc: t('programPathways.highSchool.desc'),
            price: t('programPathways.highSchool.price'),
            cta: t('programPathways.highSchool.cta'),
            link: '/credit',
            color: '#D4AF37',
            icon: '🎓',
            badge: i18n.language === 'vi' ? 'Lớp 9-12' : 'Grades 9-12',
            featured: true
        },
        {
            id: 'practice',
            title: t('programPathways.practice.title'),
            desc: t('programPathways.practice.desc'),
            price: t('programPathways.practice.price'),
            cta: t('programPathways.practice.cta'),
            link: '/non-credit',
            color: '#2F80ED',
            icon: '🎬',
            badge: i18n.language === 'vi' ? 'Tất cả các lớp' : 'All Grades'
        }
    ]

    const whyChoose = [
        {
            icon: '🌍',
            title: t('why.card1.title'),
            desc: t('why.card1.desc'),
            color: '#2F80ED'
        },
        {
            icon: '⏰',
            title: t('why.card2.title'),
            desc: t('why.card2.desc'),
            color: '#27AE60'
        },
        {
            icon: '👨‍🏫',
            title: t('why.card3.title'),
            desc: t('why.card3.desc'),
            color: '#9B51E0'
        },
        {
            icon: '🎓',
            title: t('why.card4.title'),
            desc: t('why.card4.desc'),
            color: '#D4AF37'
        }
    ]

    const howItWorks = [
        {
            num: '1',
            icon: '📝',
            title: t('home.howItWorks.step1.title'),
            desc: t('home.howItWorks.step1.desc')
        },
        {
            num: '2',
            icon: '💻',
            title: t('home.howItWorks.step2.title'),
            desc: t('home.howItWorks.step2.desc')
        },
        {
            num: '3',
            icon: '👨‍🏫',
            title: t('home.howItWorks.step3.title'),
            desc: t('home.howItWorks.step3.desc')
        },
        {
            num: '4',
            icon: '🎓',
            title: t('home.howItWorks.step4.title'),
            desc: t('home.howItWorks.step4.desc')
        }
    ]

    const universities = [
        'University of Toronto',
        'McGill University',
        'University of Waterloo',
        'Western University',
        'University of British Columbia',
        'McMaster University',
        'Queen\'s University',
        'York University'
    ]

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                </div>
                <div className="hero-content container">
                    <div className="hero-text animate-fade-in-up">
                        <span className="hero-badge">
                            <span className="badge-icon">✓</span>
                            {t('hero.badge')}
                        </span>
                        <h1>
                            {t('hero.title')}{' '}
                            <span className="text-gradient">{t('hero.titleHighlight')}</span>
                        </h1>
                        <p className="hero-subtitle">
                            {t('hero.subtitle')}
                        </p>
                        <div className="hero-actions">
                            <Link to="/credit" className="btn btn-accent btn-lg">
                                {t('hero.cta1')}
                            </Link>
                            <Link to="/programs/elementary" className="btn btn-secondary btn-lg hero-btn-secondary">
                                {t('hero.cta2')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators Bar */}
            <section className="trust-indicators-section">
                <div className="container">
                    <div className="trust-indicators-grid">
                        {trustIndicators.map((indicator, index) => (
                            <div key={index} className="trust-indicator-item">
                                <span className="trust-icon">{indicator.icon}</span>
                                <div className="trust-content">
                                    <span className="trust-value">{indicator.value}</span>
                                    <span className="trust-label">{indicator.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Program Pathways Section */}
            <section className="program-pathways-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('programPathways.title')}</h2>
                        <p className="section-subtitle">{t('programPathways.subtitle')}</p>
                    </div>
                    <div className="pathways-grid">
                        {programPathways.map((pathway, index) => (
                            <div
                                key={pathway.id}
                                className={`pathway-card card ${pathway.featured ? 'featured' : ''} animate-fade-in-up`}
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    '--pathway-color': pathway.color
                                }}
                            >
                                {pathway.featured && (
                                    <span className="featured-ribbon">
                                        {i18n.language === 'vi' ? 'Phổ biến nhất' : 'Most Popular'}
                                    </span>
                                )}
                                <div className="pathway-badge">{pathway.badge}</div>
                                <div className="pathway-icon">{pathway.icon}</div>
                                <h3>{pathway.title}</h3>
                                <p className="pathway-desc">{pathway.desc}</p>
                                {pathway.price && (
                                    <div className="pathway-price">{pathway.price}</div>
                                )}
                                <Link to={pathway.link} className="btn btn-primary btn-block">
                                    {pathway.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose EMCS Section */}
            <section className="why-choose-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('why.title')}</h2>
                        <p className="section-subtitle">{t('why.subtitle')}</p>
                    </div>
                    <div className="why-grid">
                        {whyChoose.map((item, index) => (
                            <div
                                key={index}
                                className="why-card card animate-fade-in-up"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    '--why-color': item.color
                                }}
                            >
                                <div className="why-icon" style={{ background: `${item.color}15` }}>
                                    <span>{item.icon}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('home.howItWorks.title')}</h2>
                        <p className="section-subtitle">{t('home.howItWorks.subtitle')}</p>
                    </div>
                    <div className="steps-grid">
                        {howItWorks.map((step, index) => (
                            <div key={index} className="step-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="step-number">{step.num}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                                {index < howItWorks.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Accreditation Section */}
            <section className="accreditation-section section">
                <div className="container">
                    <div className="accreditation-card card">
                        <div className="accreditation-badge">
                            <span className="badge-icon">✓</span>
                            {t('accreditation.title')}
                        </div>
                        <div className="accreditation-content">
                            <p className="accreditation-statement">{t('accreditation.statement')}</p>
                            <p className="accreditation-bsid"><strong>{t('accreditation.bsid')}</strong></p>
                            <p className="accreditation-details">{t('accreditation.details')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Program - Primary Foundation */}
            <section className="featured-program-section section bg-light">
                <div className="container">
                    <div className="featured-program-card card">
                        <span className="new-badge">{t('home.featuredPrograms.primaryFoundation.badge')}</span>
                        <div className="featured-program-content">
                            <h2>{t('home.featuredPrograms.primaryFoundation.title')}</h2>
                            <p>{t('home.featuredPrograms.primaryFoundation.desc')}</p>
                            <ul className="featured-program-options">
                                <li>{t('home.featuredPrograms.primaryFoundation.selfLearning')}</li>
                                <li>{t('home.featuredPrograms.primaryFoundation.teacherLed')}</li>
                            </ul>
                            <Link to="/programs/elementary" className="btn btn-primary btn-lg">
                                {t('home.featuredPrograms.primaryFoundation.cta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* University Acceptance Section */}
            <section className="universities section">
                <div className="container">
                    <div className="text-center mb-4">
                        <h2>{t('home.universityAcceptance.title')}</h2>
                        <p className="text-muted">{t('home.universityAcceptance.subtitle')}</p>
                    </div>
                    <div className="universities-ticker">
                        <div className="ticker-content">
                            {[...universities, ...universities].map((uni, index) => (
                                <span key={index} className="uni-name">{uni}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cta-section">
                <div className="cta-content container">
                    <h2>{t('cta.title')}</h2>
                    <p>{t('cta.subtitle')}</p>
                    <div className="cta-buttons">
                        <Link to="/credit" className="btn btn-accent btn-lg">
                            {t('storefront.credit.browseCta')}
                        </Link>
                        <Link to="/programs/elementary" className="btn btn-secondary btn-lg">
                            {t('programPathways.elementary.cta')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
