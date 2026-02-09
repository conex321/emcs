import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './ProgramLanding.css'

function AcademicPrepLanding() {
    const { t } = useTranslation()
    const [expandedGroup, setExpandedGroup] = useState(null)

    const gradeGroups = [
        {
            id: '1-5',
            label: 'Elementary (Grades 1-5)',
            description: 'Build strong foundations in core subjects',
            grades: ['1', '2', '3', '4', '5'],
            icon: '🏫',
            color: '#27AE60'
        },
        {
            id: '6-8',
            label: 'Middle School (Grades 6-8)',
            description: 'Prepare for high school success',
            grades: ['6', '7', '8'],
            icon: '📚',
            color: '#9B51E0'
        },
        {
            id: '9-12',
            label: 'High School (Grades 9-12)',
            description: 'Practice and review for credit courses',
            grades: ['9', '10', '11', '12'],
            icon: '🎓',
            color: '#2F80ED'
        }
    ]

    const toggleGroup = (groupId) => {
        setExpandedGroup(expandedGroup === groupId ? null : groupId)
    }

    return (
        <div className="program-landing academic-prep">
            {/* Hero Section */}
            <section className="program-hero">
                <div className="container">
                    <div className="program-badge-large">
                        <span className="badge-dot" style={{ background: '#2F80ED' }}></span>
                        Academic Preparation Program
                    </div>
                    <h1>Academic Preparation Program (Non-Credit)</h1>
                    <p className="hero-description">
                        The Academic Preparation Program (Non-Credit) is designed for students who aspire to pursue a rigorous academic pathway within an international educational framework. The program focuses on establishing strong academic foundations while cultivating analytical thinking, disciplined study habits, and the confidence required to succeed within the Canadian education system. Developed in alignment with Ontario curriculum standards, the program strengthens students' competencies in Academic English, mathematical reasoning, and advanced learning skills. Through personalized learning pathways and close academic mentorship, the program provides a solid transition into OSSD credit courses or EAP programs, preparing students to excel in high-quality, globally oriented academic environments.
                    </p>
                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">📹</span>
                            <span>Video Lessons</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⏱️</span>
                            <span>Self-Paced</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📝</span>
                            <span>Practice Activities</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">💰</span>
                            <span>Starting at $75</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Included Section */}
            <section className="whats-included-section">
                <div className="container">
                    <h2>What's Included</h2>
                    <div className="included-grid">
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>High-Quality Video Lessons</h3>
                            <p>Engaging video content aligned with Ontario curriculum standards</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>Interactive Activities</h3>
                            <p>Hands-on practice to reinforce learning concepts</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>Homework Exercises</h3>
                            <p>Practice problems to build confidence and mastery</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>12-Month Access</h3>
                            <p>Learn at your own pace with full year access</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>Parent Dashboard</h3>
                            <p>Track your child's progress and completion</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>No Assessments</h3>
                            <p>No tests, no report cards - focus on learning</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expandable Grade Groups Section */}
            <section className="grade-groups-section">
                <div className="container">
                    <h2>Browse by Grade Level</h2>
                    <p className="section-subtitle">Select a grade group to explore available courses</p>

                    <div className="grade-groups-expandable">
                        {gradeGroups.map(group => (
                            <div
                                key={group.id}
                                className={`grade-group-card ${expandedGroup === group.id ? 'expanded' : ''}`}
                            >
                                <button
                                    className="group-header"
                                    onClick={() => toggleGroup(group.id)}
                                    style={{ borderColor: group.color }}
                                >
                                    <div className="group-header-left">
                                        <span className="group-icon">{group.icon}</span>
                                        <div className="group-info">
                                            <h3>{group.label}</h3>
                                            <p>{group.description}</p>
                                        </div>
                                    </div>
                                    <span className={`expand-icon ${expandedGroup === group.id ? 'open' : ''}`}>
                                        {expandedGroup === group.id ? '−' : '+'}
                                    </span>
                                </button>

                                {expandedGroup === group.id && (
                                    <div className="group-content">
                                        <div className="grade-links">
                                            {group.grades.map(grade => (
                                                <Link
                                                    key={grade}
                                                    to={`/grade/${grade}`}
                                                    className="grade-link"
                                                    style={{ '--grade-color': group.color }}
                                                >
                                                    <span className="grade-number">Grade {grade}</span>
                                                    <span className="grade-arrow">→</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="group-footer">
                                            <p className="pricing-note">
                                                {group.id === '9-12'
                                                    ? <>💰 <strong>$150 per course</strong> (50% off) · Full year from <strong>$750</strong></>
                                                    : <>💰 <strong>$75 per subject</strong> (50% off) or <strong>$325 for full year</strong> (all 6 subjects)</>
                                                }
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Key Features Section */}
            <section className="key-features-section">
                <div className="container">
                    <h2>Why Choose Academic Preparation?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-large">📚</div>
                            <h3>Perfect for Practice</h3>
                            <p>Ideal for summer learning, exam prep, or supplementing regular school curriculum</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">🌍</div>
                            <h3>Learn Anywhere</h3>
                            <p>Access your courses 24/7 from any device with internet connection</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">⏰</div>
                            <h3>Your Schedule</h3>
                            <p>Study at your own pace without deadlines or time pressure</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">✅</div>
                            <h3>Ontario Aligned</h3>
                            <p>All content aligned with Ontario Ministry of Education curriculum standards</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready to Get Started?</h2>
                        <p>Choose a grade level above to explore courses and pricing</p>
                        <div className="cta-buttons">
                            <Link to="/grade/1" className="btn btn-primary btn-lg">
                                Browse Elementary (Grades 1-5)
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AcademicPrepLanding
