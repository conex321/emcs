import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './OssdRequirements.css'

function OssdRequirements() {
    const { t } = useTranslation()

    const compulsoryCredits = [
        { subject: 'English', credits: 4, note: '1 credit per grade (9, 10, 11, 12)' },
        { subject: 'Mathematics', credits: 3, note: 'At least 1 in Grade 11 or 12' },
        { subject: 'Science', credits: 2, note: '' },
        { subject: 'Canadian History', credits: 1, note: 'Grade 10' },
        { subject: 'Canadian Geography', credits: 1, note: 'Grade 9' },
        { subject: 'Arts', credits: 1, note: 'Music, Art, Drama, or Dance' },
        { subject: 'Health & Physical Education', credits: 1, note: '' },
        { subject: 'French as a Second Language', credits: 1, note: '' },
        { subject: 'Career Studies', credits: 0.5, note: '' },
        { subject: 'Civics', credits: 0.5, note: '' },
        { subject: 'Group 1, 2, or 3', credits: 3, note: 'Additional from specified groups' }
    ]

    const electiveOptions = [
        'Accounting',
        'Business Studies',
        'Economics',
        'Law',
        'Marketing',
        'Music',
        'Visual Arts',
        'Computer Science',
        'Technological Education',
        'Additional Sciences',
        'Additional Mathematics',
        'World Languages'
    ]

    const additionalReqs = [
        {
            icon: '📝',
            title: 'Ontario Secondary School Literacy Test (OSSLT)',
            desc: 'The OSSLT evaluates English reading and writing skills and is administered in Grade 10. Students may retake the test until Grade 12, or complete an additional English credit (OSSLC) if unsuccessful.'
        },
        {
            icon: '🤝',
            title: '40 Hours Community Involvement',
            desc: 'Complete 40 hours of community volunteer service before graduation. This helps develop civic responsibility and gives back to the community.'
        },
        {
            icon: '💻',
            title: 'Online Learning Requirement',
            desc: 'Minimum of 2 online learning credits required for graduation. This requirement is automatically fulfilled through EMCS courses.'
        }
    ]

    const internationalBenefits = [
        {
            icon: '🌍',
            title: 'Transfer Credit Recognition',
            desc: 'High school courses from your home country receive recognition, considered equivalent to a maximum of 23 credits. Only 7 credits must be completed in Canada.'
        },
        {
            icon: '🎯',
            title: 'Personalized Study Plans',
            desc: 'We provide mathematics diagnostic testing and personalized study plans for non-native speakers to enhance comprehension of mathematical terminology in English.'
        },
        {
            icon: '📚',
            title: 'Language Support',
            desc: 'Non-native English speakers receive support to demonstrate proficiency through IELTS or TOEFL, with comprehensive preparation resources available.'
        }
    ]

    return (
        <div className="ossd-page">
            {/* Hero */}
            <section className="ossd-hero">
                <div className="container">
                    <h1>{t('ossd.title')}</h1>
                    <p className="hero-subtitle">{t('ossd.subtitle')}</p>
                    <div className="hero-highlight">
                        <p>A vital qualification for students aspiring to pursue post-secondary education or enter the workforce</p>
                    </div>
                </div>
            </section>

            {/* What is OSSD */}
            <section className="ossd-intro section">
                <div className="container">
                    <div className="intro-content">
                        <div className="intro-text">
                            <h2>What is the Ontario Secondary School Diploma?</h2>
                            <p>The Ontario Secondary School Diploma (OSSD) represents a qualification from Ontario, Canada for students completing secondary education requirements. It is recognized worldwide and opens doors to top universities and careers globally.</p>
                            <p>Excellence Maple Canadian School (EMCS) provides a full range of high school courses approved by the Ontario Ministry of Education for students in grades 9 to 12. BSID: 665588.</p>
                            <div className="intro-stats">
                                <div className="intro-stat">
                                    <span className="stat-value">98%</span>
                                    <span className="stat-label">University Acceptance</span>
                                </div>
                                <div className="intro-stat">
                                    <span className="stat-value">170+</span>
                                    <span className="stat-label">Course Options</span>
                                </div>
                                <div className="intro-stat">
                                    <span className="stat-value">100%</span>
                                    <span className="stat-label">Ministry Approved</span>
                                </div>
                            </div>
                        </div>
                        <div className="intro-image">
                            <div className="image-placeholder">
                                <div className="diploma-icon">🎓</div>
                                <h3>OSSD</h3>
                                <p>Recognized Worldwide</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Overview */}
            <section className="ossd-overview section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Graduation Requirements Overview</h2>
                        <p className="section-subtitle">To earn your OSSD, you must complete:</p>
                    </div>
                    <div className="overview-cards">
                        <div className="overview-card card animate-fade-in-up">
                            <div className="overview-number">30</div>
                            <div className="overview-label">{t('ossd.total')}</div>
                            <div className="overview-detail">18 Compulsory + 12 Elective</div>
                        </div>
                        <div className="overview-card card animate-fade-in-up stagger-1">
                            <div className="overview-number">1</div>
                            <div className="overview-label">{t('ossd.literacy')}</div>
                            <div className="overview-detail">OSSLT or OSSLC</div>
                        </div>
                        <div className="overview-card card animate-fade-in-up stagger-2">
                            <div className="overview-number">40</div>
                            <div className="overview-label">{t('ossd.community')} Hours</div>
                            <div className="overview-detail">Community Service</div>
                        </div>
                        <div className="overview-card card animate-fade-in-up stagger-3">
                            <div className="overview-number">2</div>
                            <div className="overview-label">Online Credits</div>
                            <div className="overview-detail">Fulfilled at EMCS</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Compulsory Credits */}
            <section className="credits-section section">
                <div className="container">
                    <div className="section-header">
                        <h2>{t('ossd.compulsoryTitle')}</h2>
                        <p className="section-subtitle">{t('ossd.compulsorySubtitle')}</p>
                    </div>
                    <div className="credits-table card">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('ossd.table.subject')}</th>
                                    <th>{t('ossd.table.credits')}</th>
                                    <th>{t('ossd.table.notes')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compulsoryCredits.map((item, index) => (
                                    <tr key={index}>
                                        <td><strong>{t(`ossd.subjects.${item.subject.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`) || item.subject}</strong></td>
                                        <td><span className="credit-badge">{item.credits}</span></td>
                                        <td className="note">{t(`ossd.notes.${item.subject.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`) || item.note}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td><strong>{t('ossd.table.total')}</strong></td>
                                    <td><span className="credit-badge total">18</span></td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </section>

            {/* Elective Credits */}
            <section className="elective-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>12 Elective Credits</h2>
                        <p className="section-subtitle">Choose from a wide range of subjects based on your interests and career goals</p>
                    </div>
                    <div className="elective-grid">
                        {electiveOptions.map((elective, index) => (
                            <div key={index} className="elective-item card">
                                <span className="elective-icon">📘</span>
                                <span className="elective-name">{elective}</span>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-4">
                        <p className="elective-note">And many more options available! Students earn one credit per completed subject.</p>
                    </div>
                </div>
            </section>

            {/* Additional Requirements */}
            <section className="additional-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('ossd.additional.title')}</h2>
                        <p className="section-subtitle">{t('ossd.additional.subtitle')}</p>
                    </div>
                    <div className="additional-grid">
                        {additionalReqs.map((req, index) => (
                            <div key={index} className="additional-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="additional-icon">{req.icon}</div>
                                <h3>{req.title}</h3>
                                <p>{req.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* International Students */}
            <section className="international-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>International Student Provisions</h2>
                        <p className="section-subtitle">Special considerations for students transferring from international schools</p>
                    </div>
                    <div className="international-grid">
                        {internationalBenefits.map((benefit, index) => (
                            <div key={index} className="international-card card" style={{ animationDelay: `${index * 0.15}s` }}>
                                <div className="international-icon">{benefit.icon}</div>
                                <h3>{benefit.title}</h3>
                                <p>{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="international-highlight card">
                        <h3>Credit Transfer Process</h3>
                        <div className="transfer-steps">
                            <div className="transfer-step">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <h4>Submit Transcripts</h4>
                                    <p>Provide official transcripts from your previous schools</p>
                                </div>
                            </div>
                            <div className="transfer-step">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <h4>Credit Evaluation</h4>
                                    <p>We assess your courses (up to 23 credits recognized)</p>
                                </div>
                            </div>
                            <div className="transfer-step">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <h4>Complete Remaining</h4>
                                    <p>Finish the remaining 7 credits to earn your OSSD</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose EMCS for OSSD */}
            <section className="why-emcs section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>Why Choose EMCS for Your OSSD?</h2>
                    </div>
                    <div className="benefits-grid">
                        <div className="benefit-card card">
                            <div className="benefit-icon">✓</div>
                            <h3>Ministry Approved</h3>
                            <p>All courses approved by the Ontario Ministry of Education</p>
                        </div>
                        <div className="benefit-card card">
                            <div className="benefit-icon">✓</div>
                            <h3>Flexible Learning</h3>
                            <p>Study online at your own pace, from anywhere in the world</p>
                        </div>
                        <div className="benefit-card card">
                            <div className="benefit-icon">✓</div>
                            <h3>Expert Teachers</h3>
                            <p>Ontario Certified Teachers (OCT) with real teaching experience</p>
                        </div>
                        <div className="benefit-card card">
                            <div className="benefit-icon">✓</div>
                            <h3>University Ready</h3>
                            <p>OSSD recognized by top universities worldwide</p>
                        </div>
                        <div className="benefit-card card">
                            <div className="benefit-icon">✓</div>
                            <h3>Personalized Support</h3>
                            <p>Diagnostic testing and customized study plans</p>
                        </div>
                        <div className="benefit-card card">
                            <div className="benefit-icon">✓</div>
                            <h3>Fast Track Options</h3>
                            <p>Complete courses in as little as 4 weeks</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="ossd-cta section">
                <div className="container text-center">
                    <h2>{t('ossd.cta.title')}</h2>
                    <p>{t('ossd.cta.subtitle')}</p>
                    <div className="cta-buttons">
                        <Link to="/contact" className="btn btn-accent btn-lg">{t('ossd.cta.button')}</Link>
                        <Link to="/official-ontario" className="btn btn-secondary btn-lg">Browse Courses</Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default OssdRequirements
