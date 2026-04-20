import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './InternationalStudents.css'

function InternationalStudents() {
    const { t } = useTranslation()

    const steps = [
        { num: 1, icon: '📝', title: t('international.step1') },
        { num: 2, icon: '📧', title: t('international.step2') },
        { num: 3, icon: '📄', title: t('international.step3') },
        { num: 4, icon: '💳', title: t('international.step4') },
        { num: 5, icon: '🎓', title: t('international.step5') }
    ]

    const benefits = [
        { icon: '🌍', title: t('international.benefits.anywhere.title'), desc: t('international.benefits.anywhere.desc') },
        { icon: '📜', title: t('international.benefits.noPermit.title'), desc: t('international.benefits.noPermit.desc') },
        { icon: '🎓', title: t('international.benefits.diploma.title'), desc: t('international.benefits.diploma.desc') },
        { icon: '🏫', title: t('international.benefits.university.title'), desc: t('international.benefits.university.desc') }
    ]

    const whyChoose = [
        {
            icon: '✓',
            title: t('international.whyChoose.inspected.title', 'Ontario Ministry Inspected'),
            desc: t('international.whyChoose.inspected.desc', 'BSID: 886229 - Official transcripts recognized by universities worldwide')
        },
        {
            icon: '💻',
            title: t('international.whyChoose.online.title', '100% Online'),
            desc: t('international.whyChoose.online.desc', 'No relocation to Canada required - study from anywhere')
        },
        {
            icon: '👨‍🏫',
            title: t('international.whyChoose.liveClasses.title', 'Live Classes'),
            desc: t('international.whyChoose.liveClasses.desc', '6 hours/week live Zoom classes with Ontario Certified Teachers')
        },
        {
            icon: '📤',
            title: t('international.whyChoose.transcripts.title', 'Direct Transcript Delivery'),
            desc: t('international.whyChoose.transcripts.desc', 'Official transcripts sent directly to universities')
        }
    ]

    return (
        <div className="international-page">
            {/* Hero */}
            <section className="international-hero">
                <div className="container">
                    <div className="hero-content animate-fade-in-up">
                        <div className="hero-flag">🇨🇦</div>
                        <h1>{t('international.title')}</h1>
                        <p>{t('international.subtitle')}</p>
                        <div className="hero-highlight">
                            <span className="highlight-icon">✓</span>
                            <span>{t('international.noPermit')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose EMCS */}
            <section className="why-international section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('international.whyChooseTitle', 'Why Choose EMCS?')}</h2>
                    </div>
                    <div className="why-grid">
                        {whyChoose.map((item, index) => (
                            <div key={index} className="why-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="why-icon">{item.icon}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Partnerships */}
            <section className="partnerships-section section bg-light">
                <div className="container">
                    <div className="partnership-card card">
                        <div className="partnership-content">
                            <h3>{t('international.partnership.title', 'Joint OSSD Program with Viet Anh Education Group')}</h3>
                            <p>
                                {t('international.partnership.desc', 'EMC has partnered with Viet Anh Education Group Corporation to enable students in Vietnam to attain both the OSSD and the Vietnamese High School Diploma. This pioneering collaboration allows students to obtain OSSD credits without relocating to Canada.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="benefits-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('international.benefitsTitle', 'Benefits for International Students')}</h2>
                    </div>
                    <div className="benefits-grid">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="benefit-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="benefit-icon">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Registration Steps */}
            <section className="steps-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('international.howTo.title')}</h2>
                        <p className="section-subtitle">{t('international.howTo.subtitle')}</p>
                    </div>
                    <div className="steps-timeline">
                        {steps.map((step, index) => (
                            <div key={index} className="step-item animate-fade-in-up" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="step-number">{step.num}</div>
                                <div className="step-icon">{step.icon}</div>
                                <div className="step-title">{step.title}</div>
                                {index < steps.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="pricing-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('international.tuition.title')}</h2>
                        <p className="section-subtitle">{t('international.tuition.subtitle')}</p>
                    </div>
                    <div className="pricing-cards">
                        <div className="pricing-card card">
                            <div className="pricing-header">
                                <h3>{t('international.tuition.perCourse.title')}</h3>
                                <div className="price">$400 <span>CAD</span></div>
                            </div>
                            <ul className="pricing-features">
                                {t('international.tuition.perCourse.features', { returnObjects: true }).map((feature, i) => (
                                    <li key={i}><span className="check">✓</span> {feature}</li>
                                ))}
                            </ul>
                            <Link to="/official-ontario" className="btn btn-primary btn-lg">{t('international.browseCourses', 'Browse Courses')}</Link>
                        </div>
                        <div className="pricing-card card featured">
                            <div className="featured-badge">{t('international.tuition.package.bestValue')}</div>
                            <div className="pricing-header">
                                <h3>{t('international.tuition.package.title')}</h3>
                                <div className="price">$1,800 <span>CAD / {t('international.tuition.package.perYear', 'year')}</span></div>
                            </div>
                            <ul className="pricing-features">
                                {t('international.tuition.package.features', { returnObjects: true }).map((feature, i) => (
                                    <li key={i}><span className="check">✓</span> {feature}</li>
                                ))}
                            </ul>
                            <Link to="/contact" className="btn btn-accent btn-lg">{t('nav.contact')}</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Documents Required */}
            <section className="documents-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('international.documentsTitle', 'Documents Required')}</h2>
                    </div>
                    <div className="documents-grid">
                        <div className="document-card card">
                            <span className="doc-icon">📋</span>
                            <h4>{t('international.documents.applicationForm.title', 'Application Form')}</h4>
                            <p>{t('international.documents.applicationForm.desc', 'Complete online registration')}</p>
                        </div>
                        <div className="document-card card">
                            <span className="doc-icon">📄</span>
                            <h4>{t('international.documents.transcripts.title', 'Transcripts')}</h4>
                            <p>{t('international.documents.transcripts.desc', 'Previous school transcripts (English translation)')}</p>
                        </div>
                        <div className="document-card card">
                            <span className="doc-icon">🪪</span>
                            <h4>{t('international.documents.idDocument.title', 'ID Document')}</h4>
                            <p>{t('international.documents.idDocument.desc', 'Passport or valid identification')}</p>
                        </div>
                        <div className="document-card card">
                            <span className="doc-icon">📝</span>
                            <h4>{t('international.documents.englishAssessment.title', 'English Assessment')}</h4>
                            <p>{t('international.documents.englishAssessment.desc', 'English proficiency assessment (if required)')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="international-cta">
                <div className="container text-center">
                    <h2>{t('international.cta.title')}</h2>
                    <p>{t('international.cta.subtitle')}</p>
                    <div className="cta-buttons">
                        <Link to="/official-ontario" className="btn btn-accent btn-lg">{t('international.browseCreditCourses', 'Browse Credit Courses')}</Link>
                        <Link to="/contact" className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>{t('nav.contact')}</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default InternationalStudents
