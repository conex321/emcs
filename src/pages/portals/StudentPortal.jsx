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
                        <div className="coming-soon-badge">Coming Soon</div>

                        <h2>Student Learning Portal</h2>
                        <p className="portal-description">
                            Access your courses, track your progress, submit assignments, and communicate with your teachers—all in one place.
                        </p>

                        <div className="portal-features">
                            <h3>What You'll Be Able To Do:</h3>
                            <ul className="feature-list">
                                <li>
                                    <span className="feature-icon">📚</span>
                                    <div>
                                        <strong>Access Course Materials</strong>
                                        <p>View video lessons, download resources, and track your learning path</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">✍️</span>
                                    <div>
                                        <strong>Submit Assignments</strong>
                                        <p>Upload homework, quizzes, and projects directly to your teacher</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">📊</span>
                                    <div>
                                        <strong>Track Progress</strong>
                                        <p>Monitor your grades, completion rates, and learning milestones</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">💬</span>
                                    <div>
                                        <strong>Teacher Communication</strong>
                                        <p>Ask questions and get feedback from your Ontario Certified Teachers</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">🎥</span>
                                    <div>
                                        <strong>Join Live Classes</strong>
                                        <p>Access Zoom links and class schedules for live instruction</p>
                                    </div>
                                </li>
                                <li>
                                    <span className="feature-icon">📜</span>
                                    <div>
                                        <strong>View Transcripts</strong>
                                        <p>Access your official Ontario transcripts and report cards</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="portal-cta">
                            <p className="cta-text">Not enrolled yet? Start your learning journey today.</p>
                            <div className="cta-buttons">
                                <Link to="/academic-prep" className="btn btn-primary">
                                    Browse Academic Prep
                                </Link>
                                <Link to="/official-ontario" className="btn btn-accent">
                                    Browse Official Ontario
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="portal-info-box">
                        <h3>Need Help?</h3>
                        <p>If you're already enrolled and need login credentials, please contact our support team:</p>
                        <Link to="/contact" className="btn btn-outline">Contact Support</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentPortal
