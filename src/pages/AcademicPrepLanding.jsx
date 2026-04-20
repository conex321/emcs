import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GradeGroupPanel from '../components/storefront/GradeGroupPanel'
import ScheduleStrip from '../components/storefront/ScheduleStrip'
import './ProgramLanding.css'

function AcademicPrepLanding() {
    const { t } = useTranslation()
    const [expandedGroup, setExpandedGroup] = useState(null)

    const gradeGroups = [
        {
            id: '1-5',
            label: t('academicPrep.gradeGroupElem', 'Elementary (Grades 1-5)'),
            description: t('academicPrep.gradeGroupElemDesc', 'Build strong foundations in core subjects'),
            grades: ['1', '2', '3', '4', '5'],
            icon: '🏫',
            color: '#27AE60'
        },
        {
            id: '6-8',
            label: t('academicPrep.gradeGroupMiddle', 'Middle School (Grades 6-8)'),
            description: t('academicPrep.gradeGroupMiddleDesc', 'Prepare for high school success'),
            grades: ['6', '7', '8'],
            icon: '📚',
            color: '#9B51E0'
        },
        {
            id: '9-12',
            label: t('academicPrep.gradeGroupHs', 'High School (Grades 9-12)'),
            description: t('academicPrep.gradeGroupHsDesc', 'Practice and review for credit courses'),
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
                        {t('programs.academicPrep.name', 'Academic Preparation Program')}
                    </div>
                    <h1>{t('academicPrep.heroTitle', 'Academic Preparation Program (Non-Credit)')}</h1>
                    <p className="hero-description">
                        {t('academicPrep.heroDesc', 'The Academic Preparation Program (Non-Credit) is designed for students who aspire to pursue a rigorous academic pathway within an international educational framework. The program focuses on establishing strong academic foundations while cultivating analytical thinking, disciplined study habits, and the confidence required to succeed within the Canadian education system. Developed in alignment with Ontario curriculum standards, the program strengthens students\' competencies in Academic English, mathematical reasoning, and advanced learning skills. Through personalized learning pathways and close academic mentorship, the program provides a solid transition into OSSD credit courses or EAP programs, preparing students to excel in high-quality, globally oriented academic environments.')}
                    </p>
                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">📹</span>
                            <span>{t('academicPrep.featureVideoLessons', 'Video Lessons')}</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">⏱️</span>
                            <span>{t('academicPrep.featureSelfPaced', 'Self-Paced')}</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📝</span>
                            <span>{t('academicPrep.featurePracticeActivities', 'Practice Activities')}</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">💰</span>
                            <span>{t('academicPrep.featureStartingPrice', 'Starting at $50')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Included Section */}
            <section className="whats-included-section">
                <div className="container">
                    <h2>{t('academicPrep.whatsIncluded', "What's Included")}</h2>
                    <div className="included-grid">
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('academicPrep.included1Title', 'High-Quality Video Lessons')}</h3>
                            <p>{t('academicPrep.included1Desc', 'Engaging video content aligned with Ontario curriculum standards')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('academicPrep.included2Title', 'Interactive Activities')}</h3>
                            <p>{t('academicPrep.included2Desc', 'Hands-on practice to reinforce learning concepts')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('academicPrep.included3Title', 'Homework Exercises')}</h3>
                            <p>{t('academicPrep.included3Desc', 'Practice problems to build confidence and mastery')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('academicPrep.included4Title', '12-Month Access')}</h3>
                            <p>{t('academicPrep.included4Desc', 'Learn at your own pace with full year access')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('academicPrep.included5Title', 'Parent Dashboard')}</h3>
                            <p>{t('academicPrep.included5Desc', "Track your child's progress and completion")}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('academicPrep.included6Title', 'No Assessments')}</h3>
                            <p>{t('academicPrep.included6Desc', 'No tests, no report cards - focus on learning')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expandable Grade Groups Section */}
            <section className="grade-groups-section">
                <div className="container">
                    <h2>{t('academicPrep.browseByGrade', 'Browse by Grade Level')}</h2>
                    <p className="section-subtitle">{t('academicPrep.browseByGradeSubtitle', 'Select a grade group to explore available courses')}</p>

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
                                        {/* V2: Embedded GradeGroupPanel with dual-column layout */}
                                        <GradeGroupPanel
                                            groupSlug={group.id === '1-5' ? 'elementary' : group.id === '6-8' ? 'middle' : 'high'}
                                            context="academic-prep"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* V2: Pricing summary + upgrade callout + schedule footnote */}
            <section className="pricing-callout-section">
                <div className="container">
                    <div className="pricing-v2-banner">
                        {t('storefronts.pricingV2.promoBanner', 'Start from just $50 per course — $300 for a full 6-course year.')}
                    </div>
                    <div className="pricing-v2-upgrade">
                        <strong>{t('storefronts.programFrame.upgradeCallout', 'UPGRADE to Ontario Record (credit-bearing)')}:</strong>{' '}
                        {t('storefronts.pricingV2.upgradePerCourse', '+$350 per course (total $400)')}{' · '}
                        {t('storefronts.pricingV2.upgradeFullYear', '$1,800 per year (6 courses)')}
                    </div>
                    <ScheduleStrip />
                </div>
            </section>

            {/* Key Features Section */}
            <section className="key-features-section">
                <div className="container">
                    <h2>{t('academicPrep.whyTitle', 'Why Choose Academic Preparation?')}</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-large">📚</div>
                            <h3>{t('academicPrep.keyFeature1Title', 'Perfect for Practice')}</h3>
                            <p>{t('academicPrep.keyFeature1Desc', 'Ideal for summer learning, exam prep, or supplementing regular school curriculum')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">🌍</div>
                            <h3>{t('academicPrep.keyFeature2Title', 'Learn Anywhere')}</h3>
                            <p>{t('academicPrep.keyFeature2Desc', 'Access your courses 24/7 from any device with internet connection')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">⏰</div>
                            <h3>{t('academicPrep.keyFeature3Title', 'Your Schedule')}</h3>
                            <p>{t('academicPrep.keyFeature3Desc', 'Study at your own pace without deadlines or time pressure')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">✅</div>
                            <h3>{t('academicPrep.keyFeature4Title', 'Ontario Aligned')}</h3>
                            <p>{t('academicPrep.keyFeature4Desc', 'All content aligned with Ontario Ministry of Education curriculum standards')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-card">
                        <h2>{t('academicPrep.ctaTitle', 'Ready to Get Started?')}</h2>
                        <p>{t('academicPrep.ctaDesc', 'Choose a grade level above to explore courses and pricing')}</p>
                        <div className="cta-buttons">
                            <Link to="/grade/1" className="btn btn-primary btn-lg">
                                {t('academicPrep.ctaBrowseElem', 'Browse Elementary (Grades 1-5)')}
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">
                                {t('academicPrep.ctaContact', 'Contact Us')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AcademicPrepLanding
