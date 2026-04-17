import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './PortalPages.css'

/**
 * StudentPortal
 * Portal for enrolled students to access their LMS, courses, and learning materials
 */
function StudentPortal() {
    const { t } = useTranslation()

    return (
        <div className="portal-page">
            <div className="portal-hero student-portal">
                <div className="container">
                    <div className="portal-icon">🎓</div>
                    <h1>{t('portals.student.title')}</h1>
                    <p className="portal-subtitle">{t('portals.student.description')}</p>
                </div>
            </div>

            <div className="portal-content">
                <div className="container">
                    <div className="portal-card">
                        <div className="coming-soon-badge">{t('portals.comingSoon', 'Coming Soon')}</div>

                        <h2>{t('portals.student.portalTitle', 'Student Learning Portal')}</h2>
                        <p className="portal-description">
                            {t('portals.student.portalDesc', 'Access your courses, track your progress, submit assignments, and communicate with your teachers—all in one place.')}
                        </p>

                        <div className="portal-features">
                            <h3>{t('portals.student.featuresTitle', "What You'll Be Able To Do:")}</h3>
                            <ul className="feature-list">
                                <li>
                                    <span className="feature-icon">📚</span>
                                    <div>
                                        <strong>{t('portals.student.feature1Title', 'Access Course Materials')}</strong>
                                        <p>{t('portals.student.feature1Desc', 'View video lessons, download resources, and track your learning path')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">✍️</span>
                                    <div>
                                        <strong>{t('portals.student.feature2Title', 'Submit Assignments')}</strong>
                                        <p>{t('portals.student.feature2Desc', 'Upload homework, quizzes, and projects directly to your teacher')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">📊</span>
                                    <div>
                                        <strong>{t('portals.student.feature3Title', 'Track Progress')}</strong>
                                        <p>{t('portals.student.feature3Desc', 'Monitor your grades, completion rates, and learning milestones')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">💬</span>
                                    <div>
                                        <strong>{t('portals.student.feature4Title', 'Teacher Communication')}</strong>
                                        <p>{t('portals.student.feature4Desc', 'Ask questions and get feedback from your Ontario Certified Teachers')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">🎥</span>
                                    <div>
                                        <strong>{t('portals.student.feature5Title', 'Join Live Classes')}</strong>
                                        <p>{t('portals.student.feature5Desc', 'Access Zoom links and class schedules for live instruction')}</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">📜</span>
                                    <div>
                                        <strong>{t('portals.student.feature6Title', 'View Transcripts')}</strong>
                                        <p>{t('portals.student.feature6Desc', 'Access your official Ontario transcripts and report cards')}</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="portal-cta">
                            <p className="cta-text">{t('portals.student.ctaText', 'Not enrolled yet? Start your learning journey today.')}</p>
                            <div className="cta-buttons">
                                <Link to="/academic-prep" className="btn btn-primary">
                                    {t('portals.student.browseAcademicPrep', 'Browse Academic Prep')}
                                </Link>
                                <Link to="/official-ontario" className="btn btn-accent">
                                    {t('portals.student.browseOfficialOntario', 'Browse Official Ontario')}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="portal-info-box">
                        <h3>{t('portals.student.needHelp', 'Need Help?')}</h3>
                        <p>{t('portals.student.needHelpDesc', "If you're already enrolled and need login credentials, please contact our support team:")}</p>
                        <Link to="/contact" className="btn btn-outline">{t('portals.student.contactSupport', 'Contact Support')}</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentPortal
