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
                        <div className="coming-soon-badge">Coming Soon</div>

                        {/* Tab Navigation */}
                        <div className="portal-tabs">
                            <button
                                className={`portal-tab ${activeTab === 'enrollment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('enrollment')}
                            >
                                New Enrollment
                            </button>
                            <button
                                className={`portal-tab ${activeTab === 'login' ? 'active' : ''}`}
                                onClick={() => setActiveTab('login')}
                            >
                                Existing Account
                            </button>
                        </div>

                        {/* Enrollment Tab */}
                        {activeTab === 'enrollment' && (
                            <div className="tab-content">
                                <h2>Enroll Your Child</h2>
                                <p className="portal-description">
                                    Register your child for Academic Preparation or Official Ontario Program courses. Track their progress and manage their education all in one place.
                                </p>

                                <div className="enrollment-steps">
                                    <h3>How It Works:</h3>
                                    <ol className="steps-list">
                                        <li>
                                            <strong>Choose a Program</strong>
                                            <p>Select Academic Prep (self-paced) or Official Ontario (live classes)</p>
                                        </li>
                                        <li>
                                            <strong>Add Courses to Cart</strong>
                                            <p>Browse courses by grade and subject, add to cart</p>
                                        </li>
                                        <li>
                                            <strong>Complete Enrollment Form</strong>
                                            <p>Provide student information and parent/guardian details</p>
                                        </li>
                                        <li>
                                            <strong>Submit Payment</strong>
                                            <p>Pay securely via credit card, bank transfer, or Flywire</p>
                                        </li>
                                        <li>
                                            <strong>Receive Login Credentials</strong>
                                            <p>Both parent and student portals within 24-48 hours</p>
                                        </li>
                                    </ol>
                                </div>

                                <div className="portal-cta">
                                    <div className="cta-buttons">
                                        <Link to="/academic-prep" className="btn btn-primary">
                                            Enroll in Academic Prep
                                        </Link>
                                        <Link to="/official-ontario" className="btn btn-accent">
                                            Enroll in Official Ontario
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Login Tab */}
                        {activeTab === 'login' && (
                            <div className="tab-content">
                                <h2>Access Your Account</h2>
                                <p className="portal-description">
                                    View your child's progress, grades, attendance, and communicate with teachers.
                                </p>

                                <div className="portal-features">
                                    <h3>Parent Dashboard Features:</h3>
                                    <ul className="feature-list">
                                        <li>
                                            <span className="feature-icon">📈</span>
                                            <div>
                                                <strong>Progress Tracking</strong>
                                                <p>Real-time updates on course completion and grades</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">📅</span>
                                            <div>
                                                <strong>Class Schedule</strong>
                                                <p>View upcoming live classes and assignment deadlines</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">💳</span>
                                            <div>
                                                <strong>Billing Management</strong>
                                                <p>View invoices, payment history, and outstanding balances</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">📧</span>
                                            <div>
                                                <strong>Teacher Communication</strong>
                                                <p>Message teachers and receive updates on your child's performance</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">📜</span>
                                            <div>
                                                <strong>Official Documents</strong>
                                                <p>Download transcripts, report cards, and certificates</p>
                                            </div>
                                        </li>
                                        <li>
                                            <span className="feature-icon">🛒</span>
                                            <div>
                                                <strong>Add More Courses</strong>
                                                <p>Enroll in additional courses anytime throughout the year</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className="portal-info-box">
                                    <h3>Need Login Credentials?</h3>
                                    <p>If you've enrolled but haven't received your login information, please contact us:</p>
                                    <Link to="/contact" className="btn btn-outline">Contact Support</Link>
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
