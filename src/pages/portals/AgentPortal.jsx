import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './PortalPages.css'

/**
 * AgentPortal
 * Portal for education agents and partner schools to enroll students and track commissions
 */
function AgentPortal() {
    const { t } = useTranslation()

    return (
        <div className="portal-page">
            <div className="portal-hero agent-portal">
                <div className="container">
                    <div className="portal-icon">🤝</div>
                    <h1>{t('portals.agent.title')}</h1>
                    <p className="portal-subtitle">{t('portals.agent.description')}</p>
                </div>
            </div>

            <div className="portal-content">
                <div className="container">
                    <div className="portal-card">
                        <div className="coming-soon-badge">{t('portals.comingSoon', 'Coming Soon')}</div>

                        <h2>{t('portals.agent.portalTitle', 'Partner Enrollment Portal')}</h2>
                        <p className="portal-description">
                            {t('portals.agent.portalDesc', "Streamlined enrollment process for education agents and partner schools. Manage bulk enrollments, track commissions, and support your students' success.")}
                        </p>

                        <div className="portal-features">
                            <h3>{t('portals.agent.featuresTitle', 'Agent Dashboard Features:')}</h3>
                            <ul className="feature-list">
                                <li>
                                    <span className="feature-icon">📝</span>
                                    <div>
                                        <strong>{t('portals.agent.feature1Title', 'Bulk Enrollment Forms')}</strong>
                                        <p>{t('portals.agent.feature1Desc', 'Enroll multiple students at once with streamlined forms and CSV upload')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">💰</span>
                                    <div>
                                        <strong>{t('portals.agent.feature2Title', 'Commission Tracking')}</strong>
                                        <p>{t('portals.agent.feature2Desc', 'Real-time visibility into earnings, payouts, and referral status')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">👥</span>
                                    <div>
                                        <strong>{t('portals.agent.feature3Title', 'Student Management')}</strong>
                                        <p>{t('portals.agent.feature3Desc', "View all students you've enrolled, their progress, and enrollment status")}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">📊</span>
                                    <div>
                                        <strong>{t('portals.agent.feature4Title', 'Analytics Dashboard')}</strong>
                                        <p>{t('portals.agent.feature4Desc', 'Track enrollment trends, popular programs, and student outcomes')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">🎁</span>
                                    <div>
                                        <strong>{t('portals.agent.feature5Title', 'Promotional Materials')}</strong>
                                        <p>{t('portals.agent.feature5Desc', 'Download brochures, flyers, and marketing assets for your region')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">📞</span>
                                    <div>
                                        <strong>{t('portals.agent.feature6Title', 'Dedicated Support')}</strong>
                                        <p>{t('portals.agent.feature6Desc', 'Priority support from our partner relations team')}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="partnership-benefits">
                            <h3>{t('portals.agent.whyPartner', 'Why Partner With EMCS?')}</h3>
                            <div className="benefits-grid">
                                <div className="benefit-card">
                                    <span className="benefit-icon">✅</span>
                                    <h4>{t('portals.agent.benefit1Title', 'Ministry Inspected')}</h4>
                                    <p>{t('portals.agent.benefit1Desc', 'Official Ontario Ministry accreditation (BSID: 665588)')}</p>
                                </div>
                                <div className="benefit-card">
                                    <span className="benefit-icon">🌍</span>
                                    <h4>{t('portals.agent.benefit2Title', 'Global Recognition')}</h4>
                                    <p>{t('portals.agent.benefit2Desc', 'OSSD credentials recognized by universities worldwide')}</p>
                                </div>
                                <div className="benefit-card">
                                    <span className="benefit-icon">💵</span>
                                    <h4>{t('portals.agent.benefit3Title', 'Competitive Commissions')}</h4>
                                    <p>{t('portals.agent.benefit3Desc', 'Attractive commission structure for agent partners')}</p>
                                </div>
                                <div className="benefit-card">
                                    <span className="benefit-icon">📈</span>
                                    <h4>{t('portals.agent.benefit4Title', 'Growing Programs')}</h4>
                                    <p>{t('portals.agent.benefit4Desc', 'Grades 1-12 with both Academic Prep and Official Ontario options')}</p>
                                </div>
                            </div>
                        </div>

                        <div className="portal-cta">
                            <h3>{t('portals.agent.partnerCtaTitle', 'Interested in Becoming a Partner?')}</h3>
                            <p className="cta-text">
                                {t('portals.agent.partnerCtaDesc', 'Join our network of education agents and partner schools. Help students worldwide access quality Canadian education.')}
                            </p>
                            <div className="cta-buttons">
                                <Link to="/contact" className="btn btn-primary">
                                    {t('portals.agent.inquirePartnership', 'Inquire About Partnership')}
                                </Link>
                                <a href="mailto:partnerships@emcs.ca" className="btn btn-outline">
                                    {t('portals.agent.emailPartnership', 'Email: partnerships@emcs.ca')}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="portal-info-box">
                        <h3>{t('portals.agent.existingPartner', 'Existing Partner?')}</h3>
                        <p>{t('portals.agent.existingPartnerDesc', "If you're already an approved partner and need login credentials:")}</p>
                        <Link to="/contact" className="btn btn-outline">{t('portals.agent.contactPartnerSupport', 'Contact Partner Support')}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AgentPortal
