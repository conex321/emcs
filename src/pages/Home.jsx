import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GRADE_LEVEL_PRICING, formatCurrency } from '../config/pricing'
import './Home.css'

function Home() {
    const { t } = useTranslation()
    const elem = GRADE_LEVEL_PRICING['1-5']
    const mid = GRADE_LEVEL_PRICING['6-8']
    const hs = GRADE_LEVEL_PRICING['9-12']
    const feeRow = (band) => ({
        registration: formatCurrency(band.registration),
        entranceTest: band.entranceTest === 0 ? 'Waived' : formatCurrency(band.entranceTest),
    })

    const trustIndicators = [
        { label: t('trustIndicators.ministryInspected'), value: t('trustIndicators.bsid'), icon: '✓' },
        { label: t('trustIndicators.yearsExperience'), value: t('trustIndicators.since'), icon: '📅' },
        { label: t('trustIndicators.studentsWorldwide'), value: t('trustIndicators.countries'), icon: '🌍' },
        { label: t('trustIndicators.courseCompletion'), value: t('trustIndicators.completionTime'), icon: '⏱️' },
        { label: t('trustIndicators.teacherSupport'), value: t('trustIndicators.responseTime'), icon: '👨‍🏫' },
        { label: t('trustIndicators.transcriptDelivery'), value: t('trustIndicators.directTo'), icon: '📤' }
    ]

    const whyChoose = [
        {
            icon: '🌍',
            title: t('why.card1.title'),
            desc: t('why.card1.desc'),
            color: '#2F80ED'
        },
        {
            icon: '⏰',
            title: t('why.card2.title'),
            desc: t('why.card2.desc'),
            color: '#27AE60'
        },
        {
            icon: '👨‍🏫',
            title: t('why.card3.title'),
            desc: t('why.card3.desc'),
            color: '#9B51E0'
        },
        {
            icon: '🎓',
            title: t('why.card4.title'),
            desc: t('why.card4.desc'),
            color: '#D4AF37'
        }
    ]

    const howItWorks = [
        {
            num: '1',
            icon: '📝',
            title: t('home.howItWorks.step1.title'),
            desc: t('home.howItWorks.step1.desc')
        },
        {
            num: '2',
            icon: '💻',
            title: t('home.howItWorks.step2.title'),
            desc: t('home.howItWorks.step2.desc')
        },
        {
            num: '3',
            icon: '👨‍🏫',
            title: t('home.howItWorks.step3.title'),
            desc: t('home.howItWorks.step3.desc')
        },
        {
            num: '4',
            icon: '🎓',
            title: t('home.howItWorks.step4.title'),
            desc: t('home.howItWorks.step4.desc')
        }
    ]

    const universities = [
        'University of Toronto',
        'McGill University',
        'University of Waterloo',
        'Western University',
        'University of British Columbia',
        'McMaster University',
        'Queen\'s University',
        'York University'
    ]

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-gradient"></div>
                    <div className="hero-pattern"></div>
                </div>
                <div className="hero-content container">
                    <div className="hero-text animate-fade-in-up">
                        <span className="hero-badge">
                            <span className="badge-icon">✓</span>
                            {t('hero.badge')}
                        </span>
                        <h1>{t('home.heroTitle', 'ONTARIO CURRICULUM PROGRAMS (Grades 1–12)')}</h1>
                        <h2 className="hero-subheading">{t('home.heroSubtitle', 'Flexible Learning Pathways')}</h2>
                        <p className="hero-tagline-text">{t('home.heroTagline', 'Learn First. Decide Later. Succeed Safely.')}</p>
                        <p className="hero-subtitle">
                            {t('home.heroDesc', 'We offer Ontario Curriculum-aligned learning for students in Grades 1–12 through two flexible pathways: the Academic Preparation Program (Non-Ontario student record) and the Official Ontario Program (Ontario student record). Students may start with preparation learning and upgrade to credit-bearing courses when academically ready.')}
                        </p>
                        <div className="hero-actions">
                            <Link to="/official-ontario" className="btn btn-accent btn-lg">
                                {t('programs.officialOntario.name', 'Official Ontario Program')}
                            </Link>
                            <Link to="/academic-prep" className="btn btn-secondary btn-lg hero-btn-secondary">
                                {t('programs.academicPrep.name', 'Academic Preparation Program')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Indicators Bar */}
            <section className="trust-indicators-section">
                <div className="container">
                    <div className="trust-indicators-grid">
                        {trustIndicators.map((indicator, index) => (
                            <div key={index} className="trust-indicator-item">
                                <span className="trust-icon">{indicator.icon}</span>
                                <div className="trust-content">
                                    <span className="trust-value">{indicator.value}</span>
                                    <span className="trust-label">{indicator.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Two Programs Section */}
            <section className="two-programs-section section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('home.choosePathTitle', 'Choose Your Learning Path')}</h2>
                        <p className="section-subtitle">{t('home.choosePathSubtitle', 'Two flexible pathways aligned with the Ontario Curriculum')}</p>
                    </div>

                    <div className="two-programs-grid">
                        {/* Left Column: Academic Preparation Program */}
                        <div className="program-column card academic-prep animate-fade-in-up">
                            <div className="program-badge">
                                <span className="badge-dot" style={{ background: '#2F80ED' }}></span>
                                {t('programs.academicPrep.name', 'Academic Preparation Program')}
                            </div>
                            <p className="program-subtitle-label">{t('home.program1Subtitle', '(Non-Ontario student record)')}</p>
                            <p className="program-desc">
                                {t('home.program1Desc', 'The Academic Preparation Program builds strong foundations in Academic English, mathematics, science, social studies, and essential learning skills. Aligned with Ontario standards, it develops analytical thinking and disciplined study habits, preparing students for a smooth transition into OSSD credit courses or the Ontario Secondary School Diploma (OSSD) program.')}
                            </p>
                            <Link to="/academic-prep" className="btn btn-primary btn-lg btn-block">
                                {t('home.viewMore', 'View More')}
                            </Link>
                        </div>

                        {/* Right Column: Official Ontario Program */}
                        <div className="program-column card official-ontario featured animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <span className="featured-ribbon">{t('home.mostPopular', 'Most Popular')}</span>
                            <div className="program-badge">
                                <span className="badge-dot" style={{ background: '#D4AF37' }}></span>
                                {t('programs.officialOntario.name', 'Official Ontario Program')}
                            </div>
                            <p className="program-subtitle-label">{t('home.program2Subtitle', '(Ontario student record)')}</p>
                            <p className="program-desc">
                                {t('home.program2Desc', 'The Official Ontario Program is a fully accredited Canadian secondary education pathway designed for students pursuing academic excellence and global university opportunities. Aligned with Ontario curriculum standards, the program emphasizes strong academic foundations, critical thinking, and disciplined learning. With personalized academic guidance and a structured learning environment, students are prepared for university admission in Canada and internationally. Upon successful completion, students earn the Ontario Secondary School Diploma (OSSD).')}
                            </p>
                            <Link to="/official-ontario" className="btn btn-accent btn-lg btn-block">
                                {t('home.viewMore', 'View More')}
                            </Link>
                        </div>
                    </div>

                    {/* Program Comparison Table */}
                    <div className="program-comparison-table">
                        <h3 className="comparison-title">{t('home.comparePrograms', 'Compare Programs')}</h3>
                        <div className="comparison-table-wrapper">
                            <table className="comparison-table">
                                <colgroup>
                                    <col className="comparison-col-label" />
                                    <col className="comparison-col-program" />
                                    <col className="comparison-col-program" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>{t('programs.academicPrep.name', 'Academic Preparation Program')}<br /><span className="th-subtitle">{t('home.program1Subtitle', '(Non-Ontario student record)')}</span></th>
                                        <th>{t('programs.officialOntario.name', 'Official Ontario Program')}<br /><span className="th-subtitle">{t('home.program2Subtitle', '(Ontario student record)')}</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><strong>{t('home.compareRowPurpose', 'Purpose')}</strong></td>
                                        <td>{t('home.compareAcadPurpose', 'Preparation for entry into the Official Ontario Program')}</td>
                                        <td>{t('home.compareOntPurpose', 'Official Ontario high school program')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('home.compareRowType', 'Program Type')}</strong></td>
                                        <td>{t('home.compareAcadType', 'Preparation for credit')}</td>
                                        <td>{t('home.compareOntType', 'Credit-based secondary program')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('home.compareRowCurriculum', 'Curriculum')}</strong></td>
                                        <td>{t('home.compareAcadCurriculum', 'Ontario-aligned')}</td>
                                        <td>{t('home.compareOntCurriculum', 'Official Ontario Curriculum')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('home.compareRowFocus', 'Academic Focus')}</strong></td>
                                        <td>{t('home.compareAcadFocus', 'Math, English, Science, and Social Studies')}</td>
                                        <td>{t('home.compareOntFocus', 'Math, English, Science, and Social Studies')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('home.compareRowAssessment', 'Assessment')}</strong></td>
                                        <td>{t('home.compareAcadAssessment', 'Skill-based feedback')}</td>
                                        <td>{t('home.compareOntAssessment', 'Graded courses with records and credits')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('home.compareRowProgression', 'Progression')}</strong></td>
                                        <td>{t('home.compareAcadProgression', 'Pathway to the Official Ontario Program')}</td>
                                        <td>{t('home.compareOntProgression', 'OSSD completion')}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>{t('home.compareRowOutcome', 'Outcome')}</strong></td>
                                        <td>{t('home.compareAcadOutcome', 'Academic readiness')}</td>
                                        <td>{t('home.compareOntOutcome', 'OSSD & university preparation')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose EMCS Section */}
            <section className="why-choose-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('why.title')}</h2>
                        <p className="section-subtitle">{t('why.subtitle')}</p>
                    </div>
                    <div className="why-grid">
                        {whyChoose.map((item, index) => (
                            <div
                                key={index}
                                className="why-card card animate-fade-in-up"
                                style={{
                                    animationDelay: `${index * 0.1}s`,
                                    '--why-color': item.color
                                }}
                            >
                                <div className="why-icon" style={{ background: `${item.color}15` }}>
                                    <span>{item.icon}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('home.howItWorks.title')}</h2>
                        <p className="section-subtitle">{t('home.howItWorks.subtitle')}</p>
                    </div>
                    <div className="steps-grid">
                        {howItWorks.map((step, index) => (
                            <div key={index} className="step-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="step-number">{step.num}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                                {index < howItWorks.length - 1 && <div className="step-connector"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Accreditation Section */}
            <section className="accreditation-section section">
                <div className="container">
                    <div className="accreditation-card card">
                        <div className="accreditation-badge">
                            <span className="badge-icon">✓</span>
                            {t('accreditation.title')}
                        </div>
                        <div className="accreditation-content">
                            <p className="accreditation-statement">{t('accreditation.statement')}</p>
                            <p className="accreditation-bsid"><strong>{t('accreditation.bsid')}</strong></p>
                            <p className="accreditation-details">{t('accreditation.details')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Programs - 3 cards (v2) */}
            <section className="featured-program-section section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('home.featuredProgramsTitle', 'Featured Programs')}</h2>
                        <p className="section-subtitle">{t('home.taglineLearn', 'Learn First. Decide Later. Succeed Safely.')}</p>
                    </div>
                    <div className="featured-programs-table-wrapper">
                        <table className="featured-programs-table">
                            <thead>
                                <tr>
                                    <th scope="col">Grade Band</th>
                                    <th scope="col">
                                        Non-Academic Ontario Record
                                        <small>Self-paced · No Ontario student record</small>
                                    </th>
                                    <th scope="col">
                                        Upgrade to Ontario Record
                                        <small>Credit-bearing · Add-on path</small>
                                    </th>
                                    <th scope="col">
                                        Academic Ontario Record — Self-paced
                                        <small>Credit-bearing · Ontario student record</small>
                                    </th>
                                    <th scope="col">
                                        Academic Ontario Record — Live Teacher
                                        <small>Live online classes · OCT teachers</small>
                                    </th>
                                    <th scope="col">Fees</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" className="grade-band">
                                        <strong>Grades 1 – 5</strong>
                                        <Link to="/programs/elementary" className="grade-band-link">Elementary →</Link>
                                    </th>
                                    <td>
                                        <strong>{formatCurrency(elem.nonAcademicOntarioRecord.perCourse)}</strong> per course<br/>
                                        <strong>{formatCurrency(elem.nonAcademicOntarioRecord.bundle6)}</strong> for 6 courses
                                    </td>
                                    <td>
                                        <strong>+{formatCurrency(elem.upgradeToOntarioRecord.addOnPerCourse)}</strong> per course<br/>
                                        <em>(total {formatCurrency(elem.upgradeToOntarioRecord.totalPerCourse)})</em><br/>
                                        <strong>{formatCurrency(elem.upgradeToOntarioRecord.bundle6)}</strong> for 6 courses
                                    </td>
                                    <td>
                                        <strong>{formatCurrency(elem.academicOntarioRecord.selfPaced.perCourse)}</strong> per course<br/>
                                        <strong>{formatCurrency(elem.academicOntarioRecord.selfPaced.bundle6)}</strong> for 6 courses
                                    </td>
                                    <td>
                                        <strong>{formatCurrency(elem.academicOntarioRecord.liveTeacher.annual)}</strong> / year<br/>
                                        <em>({elem.academicOntarioRecord.liveTeacher.courses} courses included)</em>
                                    </td>
                                    <td>
                                        Registration: {feeRow(elem).registration}<br/>
                                        Entrance Test: {feeRow(elem).entranceTest}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="grade-band">
                                        <strong>Grades 6 – 8</strong>
                                        <Link to="/programs/middle-school" className="grade-band-link">Middle School →</Link>
                                    </th>
                                    <td>
                                        <strong>{formatCurrency(mid.nonAcademicOntarioRecord.perCourse)}</strong> per course<br/>
                                        <strong>{formatCurrency(mid.nonAcademicOntarioRecord.bundle6)}</strong> for 6 courses
                                    </td>
                                    <td>
                                        <strong>+{formatCurrency(mid.upgradeToOntarioRecord.addOnPerCourse)}</strong> per course<br/>
                                        <em>(total {formatCurrency(mid.upgradeToOntarioRecord.totalPerCourse)})</em><br/>
                                        <strong>{formatCurrency(mid.upgradeToOntarioRecord.bundle6)}</strong> for 6 courses
                                    </td>
                                    <td>
                                        <strong>{formatCurrency(mid.academicOntarioRecord.selfPaced.perCourse)}</strong> per course<br/>
                                        <strong>{formatCurrency(mid.academicOntarioRecord.selfPaced.bundle6)}</strong> for 6 courses
                                    </td>
                                    <td>
                                        <strong>{formatCurrency(mid.academicOntarioRecord.liveTeacher.annual)}</strong> / year<br/>
                                        <em>({mid.academicOntarioRecord.liveTeacher.courses} courses included)</em>
                                    </td>
                                    <td>
                                        Registration: {feeRow(mid).registration}<br/>
                                        Entrance Test: {feeRow(mid).entranceTest}
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row" className="grade-band">
                                        <strong>Grades 9 – 12</strong>
                                        <Link to="/programs/high-school" className="grade-band-link">High School →</Link>
                                    </th>
                                    <td>
                                        <strong>{formatCurrency(hs.nonAcademicOntarioRecord.perCourse)}</strong> per course<br/>
                                        <strong>{formatCurrency(hs.nonAcademicOntarioRecord.bundle6)}</strong> for 6 courses
                                    </td>
                                    <td>
                                        <strong>+{formatCurrency(hs.upgradeToOntarioRecord.addOnPerCourse)}</strong> per course<br/>
                                        <em>(total {formatCurrency(hs.upgradeToOntarioRecord.totalPerCourse)})</em><br/>
                                        <strong>{formatCurrency(hs.upgradeToOntarioRecord.bundle6)}</strong> for 6 courses
                                    </td>
                                    <td>
                                        <strong>{formatCurrency(hs.academicOntarioRecord.selfPaced.perCourse)}</strong> per course<br/>
                                        <strong>{formatCurrency(hs.academicOntarioRecord.selfPaced.bundle6)}</strong> for 6 courses<br/>
                                        <em>Single credit: {formatCurrency(hs.academicOntarioRecord.selfPaced.singleCreditStandalone)}</em>
                                    </td>
                                    <td>
                                        <strong>{formatCurrency(hs.academicOntarioRecord.liveTeacher.annual)}</strong> / year<br/>
                                        <em>({hs.academicOntarioRecord.liveTeacher.courses} courses included)</em>
                                    </td>
                                    <td>
                                        Registration: {feeRow(hs).registration}<br/>
                                        Entrance Test: {feeRow(hs).entranceTest}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p className="featured-programs-footnote">
                        All prices in CAD. Registration and entrance test fees are non-refundable. The G9–12 single-credit standalone rate of {formatCurrency(hs.academicOntarioRecord.selfPaced.singleCreditStandalone)} applies only when purchasing one Academic Ontario Record credit on its own; two or more credits revert to the {formatCurrency(hs.academicOntarioRecord.selfPaced.perCourse)}/course rate, and six or more are capped at the {formatCurrency(hs.academicOntarioRecord.selfPaced.bundle6)} bundle.
                    </p>

                    {/* V2: Compare + Calendar quick links */}
                    <div className="home-v2-quicklinks">
                        <Link to="/compare" className="home-quicklink">
                            🔍 {t('nav.programDropdown.compareLink', 'Compare Both Programs →')}
                        </Link>
                        <Link to="/schedule" className="home-quicklink">
                            📅 {t('nav.programDropdown.scheduleLink', 'View Academic Calendar →')}
                        </Link>
                        <Link to="/tuition" className="home-quicklink">
                            💰 {t('nav.tuitionPage', 'Tuition & Fees')}
                        </Link>
                    </div>
                </div>
            </section>

            {/* University Acceptance Section */}
            <section className="universities section">
                <div className="container">
                    <div className="text-center mb-4">
                        <h2>{t('home.universityAcceptance.title')}</h2>
                        <p className="text-muted">{t('home.universityAcceptance.subtitle')}</p>
                    </div>
                    <div className="universities-ticker">
                        <div className="ticker-content">
                            {[...universities, ...universities].map((uni, index) => (
                                <span key={index} className="uni-name">{uni}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="cta-section">
                <div className="cta-content container">
                    <h2>{t('cta.title')}</h2>
                    <p>{t('cta.subtitle')}</p>
                    <div className="cta-buttons">
                        <Link to="/official-ontario" className="btn btn-accent btn-lg">
                            {t('storefront.credit.browseCta')}
                        </Link>
                        <Link to="/academic-prep" className="btn btn-secondary btn-lg">
                            {t('programPathways.elementary.cta')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home
