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
                        <div className="coming-soon-badge">Coming Soon</div>

                        <h2>Partner Enrollment Portal</h2>
                        <p className="portal-description">
                            Streamlined enrollment process for education agents and partner schools. Manage bulk enrollments, track commissions, and support your students' success.
                        </p>

                        <div className="portal-features">
                            <h3>Agent Dashboard Features:</h3>
                            <ul className="feature-list">
                                <li>
                                    <span className="feature-icon">📝</span>
                                    <div>
                                        <strong>Bulk Enrollment Forms</strong>
                                        <p>Enroll multiple students at once with streamlined forms and CSV upload</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">💰</span>
                                    <div>
                                        <strong>Commission Tracking</strong>
                                        <p>Real-time visibility into earnings, payouts, and referral status</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">👥</span>
                                    <div>
                                        <strong>Student Management</strong>
                                        <p>View all students you've enrolled, their progress, and enrollment status</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">📊</span>
                                    <div>
                                        <strong>Analytics Dashboard</strong>
                                        <p>Track enrollment trends, popular programs, and student outcomes</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">🎁</span>
                                    <div>
                                        <strong>Promotional Materials</strong>
                                        <p>Download brochures, flyers, and marketing assets for your region</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">📞</span>
                                    <div>
                                        <strong>Dedicated Support</strong>
                                        <p>Priority support from our partner relations team</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="partnership-benefits">
                            <h3>Why Partner With EMCS?</h3>
                            <div className="benefits-grid">
                                <div className="benefit-card">
                                    <span className="benefit-icon">✅</span>
                                    <h4>Ministry Inspected</h4>
                                    <p>Official Ontario Ministry accreditation (BSID: 665588)</p>
                                </div>
                                <div className="benefit-card">
                                    <span className="benefit-icon">🌍</span>
                                    <h4>Global Recognition</h4>
                                    <p>OSSD credentials recognized by universities worldwide</p>
                                </div>
                                <div className="benefit-card">
                                    <span className="benefit-icon">💵</span>
                                    <h4>Competitive Commissions</h4>
                                    <p>Attractive commission structure for agent partners</p>
                                </div>
                                <div className="benefit-card">
                                    <span className="benefit-icon">📈</span>
                                    <h4>Growing Programs</h4>
                                    <p>Grades 1-12 with both Academic Prep and Official Ontario options</p>
                                </div>
                            </div>
                        </div>

                        <div className="portal-cta">
                            <h3>Interested in Becoming a Partner?</h3>
                            <p className="cta-text">
                                Join our network of education agents and partner schools. Help students worldwide access quality Canadian education.
                            </p>
                            <div className="cta-buttons">
                                <Link to="/contact" className="btn btn-primary">
                                    Inquire About Partnership
                                </Link>
                                <a href="mailto:partnerships@emcs.ca" className="btn btn-outline">
                                    Email: partnerships@emcs.ca
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="portal-info-box">
                        <h3>Existing Partner?</h3>
                        <p>If you're already an approved partner and need login credentials:</p>
                        <Link to="/contact" className="btn btn-outline">Contact Partner Support</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AgentPortal
