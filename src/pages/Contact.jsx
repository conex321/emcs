import { useTranslation } from 'react-i18next'
import './Contact.css'

function Contact() {
    const { t } = useTranslation()

    const contactInfo = [
        { icon: '📍', label: t('contact.address'), value: '10 Gurney Crescent, North York, ON M6B 1S8' },
        { icon: '📞', label: t('contact.phone'), value: '+1 (416) 882-6571' },
        { icon: '✉️', label: t('contact.email'), value: 'contact@emcs.ca' },
        { icon: '🕐', label: t('contact.hours'), value: 'Mon-Fri: 9:00AM – 5:00PM' }
    ]

    return (
        <div className="contact-page">
            {/* Hero */}
            <section className="contact-hero">
                <div className="container">
                    <h1>{t('contact.title')}</h1>
                    <p>{t('contact.subtitle')}</p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="contact-content section">
                <div className="container">
                    <div className="contact-grid">
                        {/* Contact Form */}
                        <div className="contact-form-wrapper card animate-fade-in-up">
                            <h2>{t('contact.messageHeader')}</h2>
                            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label htmlFor="name" className="label">{t('contact.formName')}</label>
                                    <input type="text" id="name" className="input" placeholder="John Doe" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email" className="label">{t('contact.formEmail')}</label>
                                    <input type="email" id="email" className="input" placeholder="john@example.com" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="subject" className="label">{t('contact.subject')}</label>
                                    <select id="subject" className="input">
                                        <option value="">{t('contact.subjectPlaceholder')}</option>
                                        <option value="enrollment">{t('contact.topics.enrollment')}</option>
                                        <option value="transfer">{t('contact.topics.transfer')}</option>
                                        <option value="technical">{t('contact.topics.technical')}</option>
                                        <option value="guidance">{t('contact.topics.guidance')}</option>
                                        <option value="other">{t('contact.topics.other')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message" className="label">{t('contact.formMessage')}</label>
                                    <textarea id="message" className="input textarea" rows="5" placeholder={t('contact.formMessage')}></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg">{t('contact.formSubmit')}</button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="contact-info animate-fade-in-up stagger-2">
                            <div className="info-cards">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="info-card">
                                        <span className="info-icon">{info.icon}</span>
                                        <div className="info-content">
                                            <span className="info-label">{info.label}</span>
                                            <span className="info-value">{info.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="map-placeholder card">
                                <div className="map-inner">
                                    <span className="map-icon">🗺️</span>
                                    <p>Toronto, Ontario, Canada</p>
                                </div>
                            </div>

                            <div className="social-section">
                                <h3>{t('contact.follow')}</h3>
                                <div className="social-links">
                                    <a href="#" className="social-link">Facebook</a>
                                    <a href="#" className="social-link">Instagram</a>
                                    <a href="#" className="social-link">LinkedIn</a>
                                    <a href="#" className="social-link">YouTube</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact
