import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './Faq.css'

function Faq() {
    const { t } = useTranslation()
    const [openIndex, setOpenIndex] = useState(0)

    const faqs = [
        { q: t('faq.q1'), a: t('faq.a1') },
        { q: t('faq.q2'), a: t('faq.a2') },
        { q: t('faq.q3'), a: t('faq.a3') },
        { q: t('faq.q4'), a: t('faq.a4') },
        { q: t('faq.q5'), a: t('faq.a5') },
        { q: t('faq.q6'), a: t('faq.a6') },
        { q: t('faq.q7'), a: t('faq.a7') },
        { q: t('faq.q8'), a: t('faq.a8') },
        { q: t('faq.q9'), a: t('faq.a9') },
        { q: t('faq.q10'), a: t('faq.a10') }
    ]

    return (
        <div className="faq-page">
            {/* Hero */}
            <section className="faq-hero">
                <div className="container">
                    <h1>{t('faq.title')}</h1>
                    <p>{t('faq.subtitle')}</p>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section section">
                <div className="container">
                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div
                                key={index}
                                className={`faq-item ${openIndex === index ? 'open' : ''}`}
                                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                            >
                                <div className="faq-question">
                                    <h3>{faq.q}</h3>
                                    <span className="faq-icon">
                                        {openIndex === index ? '−' : '+'}
                                    </span>
                                </div>
                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="faq-cta section">
                <div className="container text-center">
                    <h2>{t('faq.cta.title')}</h2>
                    <p>{t('faq.cta.subtitle')}</p>
                    <a href="/contact" className="btn btn-primary btn-lg">{t('faq.cta.button')}</a>
                </div>
            </section>
        </div>
    )
}

export default Faq
