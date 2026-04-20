import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import GradeGroupPanel from '../components/storefront/GradeGroupPanel'
import ScheduleStrip from '../components/storefront/ScheduleStrip'
import './ProgramLanding.css'

function OfficialOntarioLanding() {
    const { t } = useTranslation()
    const [expandedGroup, setExpandedGroup] = useState(null)

    const gradeGroups = [
        {
            id: '1-5',
            label: t('officialOntario.gradeGroupElem', 'Elementary (Grades 1-5)'),
            description: t('officialOntario.gradeGroupElemDesc', 'Official Ontario elementary education'),
            grades: ['1', '2', '3', '4', '5'],
            icon: '🏫',
            color: '#27AE60'
        },
        {
            id: '6-8',
            label: t('officialOntario.gradeGroupMiddle', 'Middle School (Grades 6-8)'),
            description: t('officialOntario.gradeGroupMiddleDesc', 'Build strong middle school foundations'),
            grades: ['6', '7', '8'],
            icon: '📚',
            color: '#9B51E0'
        },
        {
            id: '9-12',
            label: t('officialOntario.gradeGroupHs', 'High School (Grades 9-12)'),
            description: t('officialOntario.gradeGroupHsDesc', 'Earn official OSSD credits'),
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
                        {t('programs.officialOntario.name', 'Official Ontario Program')}
                    </div>
                    <span className="featured-banner">{t('officialOntario.mostPopularChoice', 'Most Popular Choice')}</span>
                    <h1>{t('officialOntario.heroTitle', 'Official Ontario Program — Ontario Secondary School Diploma (OSSD)')}</h1>
                    <p className="hero-description">
                        {t('officialOntario.heroDesc', 'The Ontario Secondary School Diploma (OSSD) Program is a prestigious, fully accredited Canadian secondary education pathway designed for students pursuing academic excellence and global university opportunities. Delivered in alignment with Ontario curriculum standards, the program emphasizes strong academic foundations, critical thinking, and disciplined learning. Through personalized academic guidance and a structured learning environment, students are fully prepared for graduation, university admission in Canada and internationally, and long-term success within a globally recognized education system.')}
                    </p>
                    <div className="hero-features">
                        <div className="feature-item">
                            <span className="feature-icon">👨‍🏫</span>
                            <span>{t('officialOntario.featureLiveClasses', 'Live Classes')}</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">✓</span>
                            <span>{t('officialOntario.featureOctTeachers', 'OCT Teachers')}</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">📜</span>
                            <span>{t('officialOntario.featureOfficialCredits', 'Official Credits')}</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">🎓</span>
                            <span>{t('officialOntario.featureOssdDiploma', 'OSSD Diploma')}</span>
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
                            <h3>{t('officialOntario.ministryTitle', 'Ontario Ministry Inspected School')}</h3>
                            <p><strong>{t('officialOntario.ministryBsid', 'BSID: 886229')}</strong></p>
                            <p>{t('officialOntario.ministryDesc', 'Authorized to grant credits toward the Ontario Secondary School Diploma (OSSD)')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Included Section */}
            <section className="whats-included-section">
                <div className="container">
                    <h2>{t('officialOntario.whatsIncluded', "What's Included")}</h2>
                    <div className="included-grid">
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('officialOntario.included1Title', 'Live Online Classes')}</h3>
                            <p>{t('officialOntario.included1Desc', 'Interactive classes via Zoom with Ontario Certified Teachers')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('officialOntario.included2Title', 'Official Transcripts')}</h3>
                            <p>{t('officialOntario.included2Desc', 'Recognized by universities worldwide, sent directly to OUAC/OCAS')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('officialOntario.included3Title', 'Formal Assessments')}</h3>
                            <p>{t('officialOntario.included3Desc', 'Tests, assignments, and evaluations count toward your grade')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('officialOntario.included4Title', 'Report Cards')}</h3>
                            <p>{t('officialOntario.included4Desc', 'Official Ontario report cards upon course completion')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('officialOntario.included5Title', 'Learning Materials')}</h3>
                            <p>{t('officialOntario.included5Desc', 'All textbooks, resources, and course materials provided')}</p>
                        </div>
                        <div className="included-card">
                            <span className="included-icon">✓</span>
                            <h3>{t('officialOntario.included6Title', 'Teacher Support')}</h3>
                            <p>{t('officialOntario.included6Desc', 'Direct access to your teacher for help and guidance')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expandable Grade Groups Section */}
            <section className="grade-groups-section">
                <div className="container">
                    <h2>{t('officialOntario.browseByGrade', 'Browse by Grade Level')}</h2>
                    <p className="section-subtitle">{t('officialOntario.browseByGradeSubtitle', 'Select a grade group to explore available courses')}</p>

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
                                        {/* V2: Embedded GradeGroupPanel with dual-column layout */}
                                        <GradeGroupPanel
                                            groupSlug={group.id === '1-5' ? 'elementary' : group.id === '6-8' ? 'middle' : 'high'}
                                            context="official-ontario"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* V2: French exemption callout for Grades 9-12 */}
            <section className="french-exemption-section">
                <div className="container">
                    <div className="french-exemption-card">
                        <span className="french-exemption-icon">🇫🇷</span>
                        <div>
                            <h3>French as a Second Language — Exemption for International Students</h3>
                            <ul>
                                <li><strong>Grade 9:</strong> {t('storefronts.frenchExemption.grade9')}</li>
                                <li><strong>Grade 10:</strong> {t('storefronts.frenchExemption.grade10')}</li>
                                <li><strong>Grade 11:</strong> {t('storefronts.frenchExemption.grade11')}</li>
                                <li><strong>Grade 12:</strong> {t('storefronts.frenchExemption.grade12')}</li>
                            </ul>
                        </div>
                    </div>
                    <ScheduleStrip />
                </div>
            </section>

            {/* Key Features Section */}
            <section className="key-features-section">
                <div className="container">
                    <h2>{t('officialOntario.whyTitle', 'Why Choose Official Ontario Program?')}</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon-large">🎓</div>
                            <h3>{t('officialOntario.keyFeature1Title', 'Earn Real Credits')}</h3>
                            <p>{t('officialOntario.keyFeature1Desc', 'Official OSSD credits recognized by Canadian and international universities')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">👨‍🏫</div>
                            <h3>{t('officialOntario.keyFeature2Title', 'Expert Teachers')}</h3>
                            <p>{t('officialOntario.keyFeature2Desc', 'Learn from Ontario Certified Teachers with years of teaching experience')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">📊</div>
                            <h3>{t('officialOntario.keyFeature3Title', 'Structured Learning')}</h3>
                            <p>{t('officialOntario.keyFeature3Desc', 'Guided curriculum with assignments, tests, and formal evaluations')}</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon-large">🌍</div>
                            <h3>{t('officialOntario.keyFeature4Title', 'Global Recognition')}</h3>
                            <p>{t('officialOntario.keyFeature4Desc', 'OSSD diploma accepted by top universities around the world')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section official">
                <div className="container">
                    <div className="cta-card official">
                        <h2>{t('officialOntario.ctaTitle', 'Ready to Earn Your OSSD?')}</h2>
                        <p>{t('officialOntario.ctaDesc', 'Choose a grade level above to explore courses and start your journey')}</p>
                        <div className="cta-buttons">
                            <Link to="/grade/9" className="btn btn-accent btn-lg">
                                {t('officialOntario.ctaBrowseHs', 'Browse High School (Grades 9-12)')}
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">
                                {t('officialOntario.ctaContact', 'Contact Us')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default OfficialOntarioLanding
