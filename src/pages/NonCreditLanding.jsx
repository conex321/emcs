import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './StorefrontLanding.css'

function NonCreditLanding() {
    const { t } = useTranslation()

    const gradeGroups = [
        {
            id: 'elementary',
            label: t('storefront.nonCredit.gradeGroups.elementary'),
            grades: ['K', '1', '2', '3', '4', '5'],
            description: t('storefront.nonCredit.gradeGroups.elementaryDesc'),
            icon: '🎨',
        },
        {
            id: 'middle',
            label: t('storefront.nonCredit.gradeGroups.middle'),
            grades: ['6', '7', '8'],
            description: t('storefront.nonCredit.gradeGroups.middleDesc'),
            icon: '📚',
        },
        {
            id: 'secondary',
            label: t('storefront.nonCredit.gradeGroups.secondary'),
            grades: ['9', '10', '11', '12'],
            description: t('storefront.nonCredit.gradeGroups.secondaryDesc'),
            icon: '🎓',
        },
    ]

    const features = [
        {
            icon: '🎬',
            title: t('storefront.nonCredit.features.videoLessons'),
            desc: t('storefront.nonCredit.features.videoLessonsDesc'),
        },
        {
            icon: '✏️',
            title: t('storefront.nonCredit.features.practiceActivities'),
            desc: t('storefront.nonCredit.features.practiceActivitiesDesc'),
        },
        {
            icon: '📝',
            title: t('storefront.nonCredit.features.homework'),
            desc: t('storefront.nonCredit.features.homeworkDesc'),
        },
        {
            icon: '⏰',
            title: t('storefront.nonCredit.features.selfPaced'),
            desc: t('storefront.nonCredit.features.selfPacedDesc'),
        },
    ]

    const perfectFor = [
        t('storefront.nonCredit.perfectForItems.practice'),
        t('storefront.nonCredit.perfectForItems.summer'),
        t('storefront.nonCredit.perfectForItems.homeschool'),
        t('storefront.nonCredit.perfectForItems.international'),
    ]

    const notIncluded = [
        t('storefront.nonCredit.notIncludedItems.tests'),
        t('storefront.nonCredit.notIncludedItems.reports'),
        t('storefront.nonCredit.notIncludedItems.credit'),
        t('storefront.nonCredit.notIncludedItems.live'),
    ]

    return (
        <div className="storefront-landing non-credit">
            {/* Hero */}
            <section className="storefront-hero" style={{ '--storefront-color': '#2F80ED' }}>
                <div className="container">
                    <div className="hero-content">
                        <span className="storefront-badge non-credit-badge">{t('storefront.nonCredit.label')}</span>
                        <h1>{t('storefront.nonCredit.title')}</h1>
                        <p className="hero-subtitle">
                            {t('storefront.nonCredit.subtitle')}
                        </p>

                        <div className="hero-disclaimer">
                            <span className="disclaimer-icon">ℹ️</span>
                            <p>{t('storefront.nonCredit.disclaimer')}</p>
                        </div>

                        <div className="hero-price">
                            {t('storefront.nonCredit.startingAt')} <strong>$75 CAD</strong>
                        </div>

                        <div className="hero-cta">
                            <a href="#grades" className="btn btn-accent btn-lg">{t('storefront.nonCredit.browseCta')}</a>
                            <Link to="/credit" className="btn btn-outline btn-lg">
                                {t('storefront.nonCredit.creditLink')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="storefront-features section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('storefront.nonCredit.whatsIncluded')}</h2>
                    </div>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card card">
                                <span className="feature-icon">{feature.icon}</span>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Perfect For */}
            <section className="perfect-for section bg-light">
                <div className="container">
                    <div className="perfect-for-content">
                        <div className="perfect-for-text">
                            <h2>{t('storefront.nonCredit.perfectFor')}</h2>
                            <ul className="perfect-for-list">
                                {perfectFor.map((item, index) => (
                                    <li key={index}>
                                        <span className="check-icon">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="not-included">
                            <h3>{t('storefront.nonCredit.notIncluded')}</h3>
                            <ul className="not-included-list">
                                {notIncluded.map((item, index) => (
                                    <li key={index}>
                                        <span className="x-icon">✗</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/credit" className="credit-link">
                                {t('storefront.nonCredit.needCredit')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse by Grade */}
            <section id="grades" className="grade-browser section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2>{t('storefront.nonCredit.browseCta')}</h2>
                        <p className="section-subtitle">{t('storefront.credit.browseGradeSubtitle')}</p>
                    </div>

                    <div className="grade-groups">
                        {gradeGroups.map(group => (
                            <div key={group.id} className="grade-group-card card">
                                <span className="group-icon">{group.icon}</span>
                                <h3>{group.label}</h3>
                                <p>{group.description}</p>
                                <div className="grade-buttons">
                                    {group.grades.map(grade => (
                                        <Link
                                            key={grade}
                                            to={`/non-credit/grade/${grade}`}
                                            className="grade-button"
                                        >
                                            {grade === 'K' ? 'K' : grade}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="storefront-cta section" style={{ '--storefront-color': '#2F80ED' }}>
                <div className="container text-center">
                    <h2>{t('storefront.nonCredit.startLearning')}</h2>
                    <p>{t('storefront.nonCredit.startLearningSubtitle')}</p>
                    <div className="cta-buttons">
                        <Link to="/non-credit/grade/1" className="btn btn-accent btn-lg">
                            {t('storefront.nonCredit.startGrade1')}
                        </Link>
                        <Link to="/contact" className="btn btn-outline-light btn-lg">
                            {t('storefront.nonCredit.haveQuestions')}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default NonCreditLanding
