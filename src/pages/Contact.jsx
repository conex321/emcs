import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Contact.css'

function Contact() {
    const { t } = useTranslation()
    const socialComingSoon = t('contact.socialComingSoon', 'Social channels are being updated. Please use email or phone for now.')

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [errors, setErrors] = useState({})
    const [submitted, setSubmitted] = useState(false)

    const contactInfo = [
        { icon: '📍', label: t('contact.address'), value: '10 Gurney Crescent, North York, ON M6B 1S8' },
        { icon: '📞', label: t('contact.phone'), value: '+1 (416) 882-6571' },
        { icon: '✉️', label: t('contact.email'), value: 'contact@emcs.ca' },
        { icon: '🕐', label: t('contact.hours'), value: t('contact.businessHours', 'Mon-Fri: 9:00AM – 5:00PM') }
    ]

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formData.name.trim()) newErrors.name = t('contact.errors.nameRequired', 'Name is required')
        if (!formData.email.trim()) {
            newErrors.email = t('contact.errors.emailRequired', 'Email is required')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('contact.errors.emailInvalid', 'Please enter a valid email')
        }
        if (!formData.subject) newErrors.subject = t('contact.errors.subjectRequired', 'Please select a subject')
        if (!formData.message.trim()) newErrors.message = t('contact.errors.messageRequired', 'Message is required')
        return newErrors
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const newErrors = validate()
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }
        setSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setErrors({})
    }

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

                            {submitted ? (
                                <div className="form-success">
                                    <span className="success-icon">✓</span>
                                    <h3>{t('contact.successTitle', 'Message Sent!')}</h3>
                                    <p>{t('contact.successMessage', "Thank you for reaching out. We'll get back to you within 1-2 business days.")}</p>
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        {t('contact.sendAnother', 'Send Another Message')}
                                    </button>
                                </div>
                            ) : (
                                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                                    <div className={`form-group ${errors.name ? 'error' : ''}`}>
                                        <label htmlFor="name" className="label">{t('contact.formName')}</label>
                                        <input
                                            type="text"
                                            id="name"
                                            className="input"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                        />
                                        {errors.name && <span className="form-error">{errors.name}</span>}
                                    </div>
                                    <div className={`form-group ${errors.email ? 'error' : ''}`}>
                                        <label htmlFor="email" className="label">{t('contact.formEmail')}</label>
                                        <input
                                            type="email"
                                            id="email"
                                            className="input"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                        />
                                        {errors.email && <span className="form-error">{errors.email}</span>}
                                    </div>
                                    <div className={`form-group ${errors.subject ? 'error' : ''}`}>
                                        <label htmlFor="subject" className="label">{t('contact.subject')}</label>
                                        <select
                                            id="subject"
                                            className="input"
                                            value={formData.subject}
                                            onChange={(e) => handleChange('subject', e.target.value)}
                                        >
                                            <option value="">{t('contact.subjectPlaceholder')}</option>
                                            <option value="transfer">{t('contact.topics.transfer')}</option>
                                            <option value="technical">{t('contact.topics.technical')}</option>
                                            <option value="guidance">{t('contact.topics.guidance')}</option>
                                            <option value="other">{t('contact.topics.other')}</option>
                                        </select>
                                        {errors.subject && <span className="form-error">{errors.subject}</span>}
                                    </div>
                                    <div className={`form-group ${errors.message ? 'error' : ''}`}>
                                        <label htmlFor="message" className="label">{t('contact.formMessage')}</label>
                                        <textarea
                                            id="message"
                                            className="input textarea"
                                            rows="5"
                                            placeholder={t('contact.formMessage')}
                                            value={formData.message}
                                            onChange={(e) => handleChange('message', e.target.value)}
                                        ></textarea>
                                        {errors.message && <span className="form-error">{errors.message}</span>}
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-lg">{t('contact.formSubmit')}</button>
                                </form>
                            )}
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
                                    <p>{t('contact.location', 'Toronto, Ontario, Canada')}</p>
                                </div>
                            </div>

                            <div className="social-section">
                                <h3>{t('contact.follow')}</h3>
                                <div className="social-links">
                                    <span className="social-link social-link--disabled" title={socialComingSoon}>{t('contact.social.facebook', 'Facebook')}</span>
                                    <span className="social-link social-link--disabled" title={socialComingSoon}>{t('contact.social.instagram', 'Instagram')}</span>
                                    <span className="social-link social-link--disabled" title={socialComingSoon}>{t('contact.social.linkedin', 'LinkedIn')}</span>
                                    <span className="social-link social-link--disabled" title={socialComingSoon}>{t('contact.social.youtube', 'YouTube')}</span>
                                </div>
                                <p className="social-help-text">{socialComingSoon}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact
