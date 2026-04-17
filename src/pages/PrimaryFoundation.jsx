import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './PrimaryFoundation.css'

function PrimaryFoundation() {
    const { t } = useTranslation()

    const coreSubjects = [
        { name: t('primaryFoundation.selfLearning.subjects.math'), icon: '🔢' },
        { name: t('primaryFoundation.selfLearning.subjects.language'), icon: '📖' },
        { name: t('primaryFoundation.selfLearning.subjects.arts'), icon: '🎨' },
        { name: t('primaryFoundation.selfLearning.subjects.science'), icon: '🔬' },
        { name: t('primaryFoundation.selfLearning.subjects.health'), icon: '💪' },
        { name: t('primaryFoundation.selfLearning.subjects.social'), icon: '🌍' }
    ]

    const grades = [
        {
            grade: '1',
            title: t('primaryFoundation.grades.grade1.title'),
            focus: t('primaryFoundation.grades.grade1.focus'),
            hasFrench: false
        },
        {
            grade: '2',
            title: t('primaryFoundation.grades.grade2.title'),
            focus: t('primaryFoundation.grades.grade2.focus'),
            hasFrench: false
        },
        {
            grade: '3',
            title: t('primaryFoundation.grades.grade3.title'),
            focus: t('primaryFoundation.grades.grade3.focus'),
            hasFrench: false
        },
        {
            grade: '4',
            title: t('primaryFoundation.grades.grade4.title'),
            focus: t('primaryFoundation.grades.grade4.focus'),
            hasFrench: true
        },
        {
            grade: '5',
            title: t('primaryFoundation.grades.grade5.title'),
            focus: t('primaryFoundation.grades.grade5.focus'),
            hasFrench: true
        }
    ]

    const comparisonFeatures = [
        { feature: t('primaryFoundation.comparison.materials'), selfLearning: t('primaryFoundation.comparison.included'), teacherLed: t('primaryFoundation.comparison.included') },
        { feature: t('primaryFoundation.comparison.access'), selfLearning: t('primaryFoundation.comparison.yes'), teacherLed: t('primaryFoundation.comparison.recordingsAvailable') },
        { feature: t('primaryFoundation.comparison.assessments'), selfLearning: t('primaryFoundation.comparison.none'), teacherLed: t('primaryFoundation.comparison.required') },
        { feature: t('primaryFoundation.comparison.liveClasses'), selfLearning: t('primaryFoundation.comparison.none'), teacherLed: t('primaryFoundation.comparison.hoursPerWeek') },
        { feature: t('primaryFoundation.comparison.teacherSupportLabel'), selfLearning: t('primaryFoundation.comparison.limited'), teacherLed: t('primaryFoundation.comparison.directAccess') },
        { feature: t('primaryFoundation.comparison.reportCard'), selfLearning: t('primaryFoundation.comparison.notIncluded'), teacherLed: t('primaryFoundation.comparison.included') },
        { feature: t('primaryFoundation.comparison.startAnytime'), selfLearning: t('primaryFoundation.comparison.yes'), teacherLed: t('primaryFoundation.comparison.septemberStart') },
        { feature: t('primaryFoundation.comparison.bestFor'), selfLearning: t('primaryFoundation.comparison.practiceHomeschool'), teacherLed: t('primaryFoundation.comparison.officialCredential') }
    ]

    return (
        <div className="primary-foundation-page">
            {/* Hero Section */}
            <section className="pf-hero">
                <div className="container">
                    <div className="pf-hero-content animate-fade-in-up">
                        <span className="pf-badge">{t('primaryFoundation.badge')}</span>
                        <h1>{t('primaryFoundation.title')}</h1>
                        <p>{t('primaryFoundation.subtitle')}</p>
                    </div>
                </div>
            </section>

            {/* Program Overview */}
            <section className="pf-overview section">
                <div className="container">
                    <div className="pf-overview-content">
                        <h2>{t('primaryFoundation.overview.title')}</h2>
                        <p>{t('primaryFoundation.overview.content')}</p>
                        <p className="pf-french-note">{t('primaryFoundation.overview.french')}</p>
                        <p className="pf-purpose">{t('primaryFoundation.overview.purpose')}</p>
                    </div>
                </div>
            </section>

            {/* Two Learning Pathways */}
            <section className="pf-pathways section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('primaryFoundation.twoPathways', 'Two Learning Pathways')}</h2>
                    </div>

                    <div className="pathways-container">
                        {/* Self-Learning Option */}
                        <div className="pathway-option card">
                            <span className="pathway-badge self-learning">{t('primaryFoundation.selfLearning.badge')}</span>
                            <h3>{t('primaryFoundation.selfLearning.title')}</h3>

                            <div className="pathway-whats-included">
                                <h4>{t('primaryFoundation.selfLearning.whatsIncluded.title')}</h4>
                                <ul>
                                    <li><span className="check">✓</span> {t('primaryFoundation.selfLearning.whatsIncluded.materials')}</li>
                                    <li><span className="check">✓</span> {t('primaryFoundation.selfLearning.whatsIncluded.credentials')}</li>
                                    <li><span className="check">✓</span> {t('primaryFoundation.selfLearning.whatsIncluded.access')}</li>
                                    <li><span className="check">✓</span> {t('primaryFoundation.selfLearning.whatsIncluded.pace')}</li>
                                </ul>
                            </div>

                            <div className="pathway-important">
                                <p><strong>{t('primaryFoundation.important', 'Important:')}</strong> {t('primaryFoundation.selfLearning.important')}</p>
                                <ul>
                                    <li>{t('primaryFoundation.selfLearning.idealFor.practice')}</li>
                                    <li>{t('primaryFoundation.selfLearning.idealFor.summer')}</li>
                                    <li>{t('primaryFoundation.selfLearning.idealFor.homeschool')}</li>
                                    <li>{t('primaryFoundation.selfLearning.idealFor.international')}</li>
                                </ul>
                            </div>

                            <div className="pathway-pricing">
                                <h4>{t('primaryFoundation.selfLearning.pricing.title')}</h4>
                                <div className="price-row">
                                    <span>{t('primaryFoundation.selfLearning.pricing.grade1to3')}</span>
                                    <span className="price">{t('primaryFoundation.selfLearning.pricing.perSubject')}</span>
                                </div>
                                <div className="price-row">
                                    <span>{t('primaryFoundation.selfLearning.pricing.french')}</span>
                                    <span className="price">{t('primaryFoundation.selfLearning.pricing.frenchPrice')}</span>
                                </div>
                                <p className="optional-record">{t('primaryFoundation.selfLearning.optionalRecord')}</p>
                            </div>

                            <div className="pathway-fees">
                                <h4>{t('primaryFoundation.selfLearning.fees.title')}</h4>
                                <p>{t('primaryFoundation.selfLearning.fees.entrance')}</p>
                                <p>{t('primaryFoundation.selfLearning.fees.registration')}</p>
                            </div>

                            <Link to="/non-credit/grade/1" className="btn btn-primary btn-lg btn-block">
                                {t('primaryFoundation.selfLearning.cta')}
                            </Link>
                        </div>

                        {/* V2: Upgrade to Official Ontario Program (low-price tier) */}
                        <div className="pathway-option card">
                            <span className="pathway-badge" style={{ background: '#d4af37', color: '#fff' }}>NEW · v2</span>
                            <h3>Upgrade to Official Ontario Program ($600/year)</h3>

                            <div className="pathway-whats-included">
                                <h4>What's Included:</h4>
                                <ul>
                                    <li><span className="check">✓</span> Ontario student record</li>
                                    <li><span className="check">✓</span> All 6 subjects covered</li>
                                    <li><span className="check">✓</span> Official Ontario Academic Report Card</li>
                                    <li><span className="check">✓</span> Upgradeable from Academic Prep at any time</li>
                                </ul>
                            </div>

                            <div className="pathway-pricing">
                                <h4>Pricing:</h4>
                                <div className="price-row highlight">
                                    <span>Full Year (6 subjects)</span>
                                    <span className="price">$600 CAD</span>
                                </div>
                                <div className="price-row">
                                    <span>Per Course</span>
                                    <span className="price">$250 CAD</span>
                                </div>
                                <p className="optional-record">
                                    Entry-level Ontario student record pathway. NOT the premium Teacher-Led Primary Foundation ($3,500/yr) — this tier offers the student record at the new Version 2 low-price tier.
                                </p>
                            </div>

                            <Link to="/academic-prep/group/elementary" className="btn btn-primary btn-lg btn-block">
                                View Upgrade Pathway
                            </Link>
                        </div>

                        {/* Teacher-Led Option */}
                        <div className="pathway-option card featured">
                            <span className="pathway-badge teacher-led">Premium Legacy · $3,500/yr</span>
                            <h3>{t('primaryFoundation.teacherLed.title')}</h3>

                            <div className="pathway-whats-included">
                                <h4>{t('primaryFoundation.teacherLed.whatsIncluded.title')}</h4>
                                <ul>
                                    <li><span className="check">✓</span> {t('primaryFoundation.teacherLed.whatsIncluded.materials')}</li>
                                    <li><span className="check">✓</span> {t('primaryFoundation.teacherLed.whatsIncluded.credentials')}</li>
                                    <li><span className="check">✓</span> {t('primaryFoundation.teacherLed.whatsIncluded.live')}</li>
                                    <li><span className="check">✓</span> {t('primaryFoundation.teacherLed.whatsIncluded.assessments')}</li>
                                    <li><span className="check">✓</span> {t('primaryFoundation.teacherLed.whatsIncluded.reportCard')}</li>
                                </ul>
                            </div>

                            <div className="pathway-schedule">
                                <h4>{t('primaryFoundation.teacherLed.schedule.title')}</h4>
                                <p>{t('primaryFoundation.teacherLed.schedule.option1')}</p>
                                <p>{t('primaryFoundation.teacherLed.schedule.option2')}</p>
                                <p className="duration">{t('primaryFoundation.teacherLed.duration')}</p>
                            </div>

                            <div className="pathway-pricing">
                                <h4>{t('primaryFoundation.teacherLed.pricing.title')}</h4>
                                <div className="price-row highlight">
                                    <span>{t('primaryFoundation.teacherLed.pricing.core')}</span>
                                    <span className="price">{t('primaryFoundation.teacherLed.pricing.corePrice')}</span>
                                </div>
                                <div className="price-row">
                                    <span>{t('primaryFoundation.teacherLed.pricing.french')}</span>
                                    <span className="price">{t('primaryFoundation.teacherLed.pricing.frenchPrice')}</span>
                                </div>
                            </div>

                            <div className="pathway-fees">
                                <p>{t('primaryFoundation.teacherLed.pricing.entrance')}: {t('primaryFoundation.teacherLed.pricing.entrancePrice')}</p>
                                <p>{t('primaryFoundation.teacherLed.pricing.registration')}: {t('primaryFoundation.teacherLed.pricing.registrationPrice')}</p>
                            </div>

                            <Link to="/contact" className="btn btn-accent btn-lg btn-block">
                                {t('primaryFoundation.teacherLed.cta')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Subjects */}
            <section className="pf-subjects section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('primaryFoundation.selfLearning.subjects.title')}</h2>
                    </div>
                    <div className="subjects-grid">
                        {coreSubjects.map((subject, index) => (
                            <div key={index} className="subject-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <span className="subject-icon">{subject.icon}</span>
                                <span className="subject-name">{subject.name}</span>
                            </div>
                        ))}
                        <div className="subject-card card french animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                            <span className="subject-icon">🇫🇷</span>
                            <span className="subject-name">{t('primaryFoundation.selfLearning.subjects.french')}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grade-Specific Information */}
            <section className="pf-grades section bg-light">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('primaryFoundation.gradeSpecificInfo', 'Grade-Specific Information')}</h2>
                    </div>
                    <div className="grades-grid">
                        {grades.map((grade, index) => (
                            <div key={index} className="grade-card card animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="grade-number">{t('primaryFoundation.gradePrefix', 'Grade')} {grade.grade}</div>
                                <h3>{grade.title}</h3>
                                <p>{grade.focus}</p>
                                {grade.hasFrench && (
                                    <span className="french-badge">{t('primaryFoundation.frenchBadge', '+ French as a Second Language')}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="pf-comparison section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('primaryFoundation.comparison.title')}</h2>
                    </div>
                    <div className="comparison-table-wrapper">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>{t('primaryFoundation.comparison.feature')}</th>
                                    <th className="self-learning">{t('primaryFoundation.comparison.selfLearning')}</th>
                                    <th className="teacher-led">{t('primaryFoundation.comparison.teacherLed')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparisonFeatures.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.feature}</td>
                                        <td>{row.selfLearning}</td>
                                        <td>{row.teacherLed}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="comparison-note">{t('primaryFoundation.comparison.recordNote')}</p>
                </div>
            </section>

            {/* Disclaimers */}
            <section className="pf-disclaimers section bg-light">
                <div className="container">
                    <div className="disclaimer-grid">
                        <div className="disclaimer-card self-learning">
                            <h4>{t('primaryFoundation.disclaimers.selfLearning.title')}</h4>
                            <p>{t('primaryFoundation.disclaimers.selfLearning.content')}</p>
                            <p><strong>{t('primaryFoundation.disclaimers.selfLearning.idealFor')}</strong></p>
                            <ul>
                                {t('primaryFoundation.disclaimers.selfLearning.items', { returnObjects: true }).map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="disclaimer-card teacher-led">
                            <h4>{t('primaryFoundation.forTeacherLedProgram', 'For Teacher-Led Program:')}</h4>
                            <p>{t('primaryFoundation.disclaimers.teacherLed.content')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="pf-cta">
                <div className="container">
                    <div className="pf-cta-content">
                        <h2>{t('primaryFoundation.cta.title')}</h2>
                        <p>{t('primaryFoundation.cta.subtitle')}</p>
                        <div className="pf-cta-buttons">
                            <Link to="/non-credit/grade/1" className="btn btn-primary btn-lg">
                                {t('primaryFoundation.cta.selfLearning')}
                            </Link>
                            <Link to="/contact" className="btn btn-accent btn-lg">
                                {t('primaryFoundation.cta.teacherLed')}
                            </Link>
                            <Link to="/contact" className="btn btn-secondary btn-lg">
                                {t('primaryFoundation.cta.advisor')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PrimaryFoundation
