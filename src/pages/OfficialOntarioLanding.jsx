import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './ProgramLanding.css'

function OfficialOntarioLanding() {
    const { t } = useTranslation()
    const [expandedGroup, setExpandedGroup] = useState(null)

    const gradeGroups = [
        {
            id: '1-5',
            label: 'Elementary (Grades 1-5)',
            description: 'Official Ontario elementary education',
            grades: ['1', '2', '3', '4', '5'],
            icon: '🏫',
            color: '#27AE60'
        },
        {
            id: '6-8',
            label: 'Middle School (Grades 6-8)',
            description: 'Build strong middle school foundations',
            grades: ['6', '7', '8'],
            icon: '📚',
            color: '#9B51E0'
        },
        {
            id: '9-12',
            label: 'High School (Grades 9-12)',
            description: 'Earn official OSSD credits',
            grades: ['9', '10', '11', '12'],
            icon: '🎓',
            color: '#D4AF37'
        }
    ]

    const toggleGroup = (groupId) => {
        setExpandedGroup(expandedGroup === groupId ? null : groupId)
    }

    return (
        <div className="program-landing official-ontario">
            {/* Hero Section */}
            <section className="program-hero official">
                <div className="container">
                    <div className="program-badge-large official">
                        <span className="badge-dot" style={{ background: '#D4AF37' }}></span>
                        Official Ontario Program
                    </div>
                    <span className="featured-banner">Most Popular Choice</span>
                    <h1>Official Ontario Program — Ontario Secondary School Diploma (OSSD)</h1>
                    <p className="hero-description">
                        The Ontario Secondary School Diploma (OSSD) Program is a prestigious, fully accredited Canadian secondary education pathway designed for students pursuing academic excellence and global university opportunities. Delivered in alignment with Ontario curriculum standards, the program emphasizes strong academic foundations, critical thinking, and disciplined learning. Through personalized academic guidance and a structured learning environment, students are fully prepared for graduation, university admission in Canada and internationally, and long-term success within a globally recognized education system.
                    </p>
                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">👨‍🏫</span>
                            <span>Live Classes</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            <span>OCT Teachers</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📜</span>
                            <span>Official Credits</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🎓</span>
                            <span>OSSD Diploma</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ministry Badge Section */}
            <section className="ministry-badge-section">
                <div className="container">
                    <div className="ministry-badge">
                        <span className="badge-icon">✓</span>
                        <div className="badge-content">
                            <h3>Ontario Ministry Inspected School</h3>
                            <p><strong>BSID: 665588</strong></p>
                            <p>Authorized to grant credits toward the Ontario Secondary School Diploma (OSSD)</p>
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
                            <h3>Live Online Classes</h3>
                            <p>Interactive classes via Zoom with Ontario Certified Teachers</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>Official Transcripts</h3>
                            <p>Recognized by universities worldwide, sent directly to OUAC/OCAS</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>Formal Assessments</h3>
                            <p>Tests, assignments, and evaluations count toward your grade</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>Report Cards</h3>
                            <p>Official Ontario report cards upon course completion</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>Learning Materials</h3>
                            <p>All textbooks, resources, and course materials provided</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>Teacher Support</h3>
                            <p>Direct access to your teacher for help and guidance</p>
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
                                    className="group-header official"
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
                                                    className="grade-link official"
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
                                                    ? <>💰 <strong>$700 per course</strong> · Full year from <strong>$3,800</strong></>
                                                    : <>💰 <strong>$250 per subject</strong> or <strong>$600 for full year</strong> (all 6 subjects)</>
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
                    <h2>Why Choose Official Ontario Program?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-large">🎓</div>
                            <h3>Earn Real Credits</h3>
                            <p>Official OSSD credits recognized by Canadian and international universities</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">👨‍🏫</div>
                            <h3>Expert Teachers</h3>
                            <p>Learn from Ontario Certified Teachers with years of teaching experience</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">📊</div>
                            <h3>Structured Learning</h3>
                            <p>Guided curriculum with assignments, tests, and formal evaluations</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">🌍</div>
                            <h3>Global Recognition</h3>
                            <p>OSSD diploma accepted by top universities around the world</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section official">
                <div className="container">
                    <div className="cta-card official">
                        <h2>Ready to Earn Your OSSD?</h2>
                        <p>Choose a grade level above to explore courses and start your journey</p>
                        <div className="cta-buttons">
                            <Link to="/grade/9" className="btn btn-accent btn-lg">
                                Browse High School (Grades 9-12)
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

export default OfficialOntarioLanding
