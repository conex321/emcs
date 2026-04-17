import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './PortalPages.css'

/**
 * ParentPortal
 * Portal for parents to enroll students, track progress, and manage accounts
 */
function ParentPortal() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState('enrollment') // 'enrollment' or 'login'

    return (
        <div className="portal-page">
            <div className="portal-hero parent-portal">
                <div className="container">
                    <div className="portal-icon">👨‍👩‍👧‍👦</div>
                    <h1>{t('portals.parent.title')}</h1>
                    <p className="portal-subtitle">{t('portals.parent.description')}</p>
                </div>
            </div>

            <div className="portal-content">
                <div className="container">
                    <div className="portal-card">
                        <div className="coming-soon-badge">{t('portals.comingSoon', 'Coming Soon')}</div>

                        {/* Tab Navigation */}
                        <div className="portal-tabs">
                            <button
                                className={`portal-tab ${activeTab === 'enrollment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('enrollment')}
                            >
                                {t('portals.parent.tabEnrollment', 'New Enrollment')}
                            </button>
                            <button
                                className={`portal-tab ${activeTab === 'login' ? 'active' : ''}`}
                                onClick={() => setActiveTab('login')}
                            >
                                {t('portals.parent.tabLogin', 'Existing Account')}
                            </button>
                        </div>

                        {/* Enrollment Tab */}
                        {activeTab === 'enrollment' && (
                            <div className="tab-content">
                                <h2>{t('portals.parent.enrollTitle', 'Enroll Your Child')}</h2>
                                <p className="portal-description">
                                    {t('portals.parent.enrollDesc', 'Register your child for Academic Preparation or Official Ontario Program courses. Track their progress and manage their education all in one place.')}
                                </p>

                                <div className="enrollment-steps">
                                    <h3>{t('portals.parent.howItWorks', 'How It Works:')}</h3>
                                    <ol className="steps-list">
                                        <li>
                                            <strong>{t('portals.parent.step1Title', 'Choose a Program')}</strong>
                                            <p>{t('portals.parent.step1Desc', 'Select Academic Prep (self-paced) or Official Ontario (live classes)')}</p>
                                        </li>
                                        <li>
                                            <strong>{t('portals.parent.step2Title', 'Add Courses to Cart')}</strong>
                                            <p>{t('portals.parent.step2Desc', 'Browse courses by grade and subject, add to cart')}</p>
                                        </li>
                                        <li>
                                            <strong>{t('portals.parent.step3Title', 'Complete Enrollment Form')}</strong>
                                            <p>{t('portals.parent.step3Desc', 'Provide student information and parent/guardian details')}</p>
                                        </li>
                                        <li>
                                            <strong>{t('portals.parent.step4Title', 'Submit Payment')}</strong>
                                            <p>{t('portals.parent.step4Desc', 'Pay securely via credit card, bank transfer, or Flywire')}</p>
                                        </li>
                                        <li>
                                            <strong>{t('portals.parent.step5Title', 'Receive Login Credentials')}</strong>
                                            <p>{t('portals.parent.step5Desc', 'Both parent and student portals within 24-48 hours')}</p>
                                        </li>
                                    </ol>
                                </div>

                                <div className="portal-cta">
                                    <div className="cta-buttons">
                                        <Link to="/academic-prep" className="btn btn-primary">
                                            {t('portals.parent.enrollAcademicPrep', 'Enroll in Academic Prep')}
                                        </Link>
                                        <Link to="/official-ontario" className="btn btn-accent">
                                            {t('portals.parent.enrollOfficialOntario', 'Enroll in Official Ontario')}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Login Tab */}
                        {activeTab === 'login' && (
                            <div className="tab-content">
                                <h2>{t('portals.parent.loginTitle', 'Access Your Account')}</h2>
                                <p className="portal-description">
                                    {t('portals.parent.loginDesc', "View your child's progress, grades, attendance, and communicate with teachers.")}
                                </p>

                                <div className="portal-features">
                                    <h3>{t('portals.parent.dashFeaturesTitle', 'Parent Dashboard Features:')}</h3>
                                    <ul className="feature-list">
                                        <li>
                                            <span className="feature-icon">📈</span>
                                            <div>
                                                <strong>{t('portals.parent.dashFeature1Title', 'Progress Tracking')}</strong>
                                                <p>{t('portals.parent.dashFeature1Desc', 'Real-time updates on course completion and grades')}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">📅</span>
                                            <div>
                                                <strong>{t('portals.parent.dashFeature2Title', 'Class Schedule')}</strong>
                                                <p>{t('portals.parent.dashFeature2Desc', 'View upcoming live classes and assignment deadlines')}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">💳</span>
                                            <div>
                                                <strong>{t('portals.parent.dashFeature3Title', 'Billing Management')}</strong>
                                                <p>{t('portals.parent.dashFeature3Desc', 'View invoices, payment history, and outstanding balances')}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">📧</span>
                                            <div>
                                                <strong>{t('portals.parent.dashFeature4Title', 'Teacher Communication')}</strong>
                                                <p>{t('portals.parent.dashFeature4Desc', "Message teachers and receive updates on your child's performance")}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">📜</span>
                                            <div>
                                                <strong>{t('portals.parent.dashFeature5Title', 'Official Documents')}</strong>
                                                <p>{t('portals.parent.dashFeature5Desc', 'Download transcripts, report cards, and certificates')}</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">🛒</span>
                                            <div>
                                                <strong>{t('portals.parent.dashFeature6Title', 'Add More Courses')}</strong>
                                                <p>{t('portals.parent.dashFeature6Desc', 'Enroll in additional courses anytime throughout the year')}</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="portal-info-box">
                                    <h3>{t('portals.parent.needCredentials', 'Need Login Credentials?')}</h3>
                                    <p>{t('portals.parent.needCredentialsDesc', "If you've enrolled but haven't received your login information, please contact us:")}</p>
                                    <Link to="/contact" className="btn btn-outline">{t('portals.parent.contactSupport', 'Contact Support')}</Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ParentPortal
