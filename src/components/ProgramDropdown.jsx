import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './ProgramDropdown.css'

function ProgramDropdown({ isOpen, onClose }) {
    const { t } = useTranslation()

    const gradeGroups = [
        { label: t('nav.gradeGroups.elementaryRange', 'Elementary (1-5)'), slug: 'elementary', grades: ['1', '2', '3', '4', '5'] },
        { label: t('nav.gradeGroups.middleSchoolRange', 'Middle School (6-8)'), slug: 'middle', grades: ['6', '7', '8'] },
        { label: t('nav.gradeGroups.highSchoolRange', 'High School (9-12)'), slug: 'high', grades: ['9', '10', '11', '12'] }
    ]

    if (!isOpen) return null

    return (
        <div className="program-dropdown-two-panel program-dropdown-v2">
            {/* Left Panel: Academic Preparation Program */}
            <div className="panel panel-left academic-prep">
                <div className="panel-header">
                    <div className="program-dot" style={{ background: '#2F80ED' }}></div>
                    <h3>{t('nav.programDropdown.leftTitle', 'Academic Preparation Program')}</h3>
                </div>
                <p className="panel-sublabel">{t('nav.programDropdown.leftSublabel', 'Non-Credit | Non-Ontario student record')}</p>
                <p className="panel-tagline">{t('nav.programDropdown.leftTagline', 'Self-paced preparation. Learn First. Decide Later.')}</p>
                <p className="panel-description">{t('nav.programDropdown.leftDescription')}</p>

                <div className="grade-groups-list">
                    {gradeGroups.map(group => (
                        <div key={group.label} className="grade-group">
                            <Link
                                to={`/academic-prep/group/${group.slug}`}
                                className="grade-group-label grade-group-label--link"
                                onClick={onClose}
                            >
                                {group.label}
                            </Link>
                            <div className="grade-pills">
                                {group.grades.map(g => (
                                    <Link
                                        key={g}
                                        to={`/academic-prep/grade/${g}`}
                                        className="grade-pill"
                                        onClick={onClose}
                                    >
                                        {t('nav.gradeAbbrev', 'Gr')} {g}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="panel-footer">
                    <Link to="/academic-prep" className="panel-view-more" onClick={onClose}>
                        {t('nav.viewMore', 'View More →')}
                    </Link>
                    <Link to="/tuition#academic-prep" className="panel-pricing-link" onClick={onClose}>
                        {t('nav.programDropdown.pricingLink', 'See Pricing')}
                    </Link>
                </div>
            </div>

            {/* Right Panel: Official Ontario Program */}
            <div className="panel panel-right official-ontario">
                <div className="panel-header">
                    <div className="program-dot" style={{ background: '#D4AF37' }}></div>
                    <h3>{t('nav.programDropdown.rightTitle', 'Official Ontario Program')}</h3>
                    <span className="featured-badge">{t('nav.programDropdown.rightBadge', 'Most Popular')}</span>
                </div>
                <p className="panel-sublabel">{t('nav.programDropdown.rightSublabel', 'Credit-bearing | Ontario student record')}</p>
                <p className="panel-tagline">{t('nav.programDropdown.rightTagline', 'Earn official OSSD credits. Succeed Safely.')}</p>
                <p className="panel-description">{t('nav.programDropdown.rightDescription')}</p>

                <div className="grade-groups-list">
                    {gradeGroups.map(group => (
                        <div key={group.label} className="grade-group">
                            <Link
                                to={`/official-ontario/group/${group.slug}`}
                                className="grade-group-label grade-group-label--link"
                                onClick={onClose}
                            >
                                {group.label}
                            </Link>
                            <div className="grade-pills">
                                {group.grades.map(g => (
                                    <Link
                                        key={g}
                                        to={`/official-ontario/grade/${g}`}
                                        className="grade-pill grade-pill-gold"
                                        onClick={onClose}
                                    >
                                        {t('nav.gradeAbbrev', 'Gr')} {g}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="panel-footer">
                    <Link to="/official-ontario" className="panel-view-more" onClick={onClose}>
                        {t('nav.viewMore', 'View More →')}
                    </Link>
                    <Link to="/tuition#official-ontario" className="panel-pricing-link" onClick={onClose}>
                        {t('nav.programDropdown.pricingLink', 'See Pricing')}
                    </Link>
                </div>
            </div>

            {/* Shared footer strip */}
            <div className="program-dropdown-shared-footer">
                <div className="shared-footer-links">
                    <Link to="/compare" className="shared-link" onClick={onClose}>
                        {t('nav.programDropdown.compareLink', 'Compare Both Programs →')}
                    </Link>
                    <Link to="/schedule" className="shared-link" onClick={onClose}>
                        {t('nav.programDropdown.scheduleLink', 'View Academic Calendar →')}
                    </Link>
                </div>
                <p className="shared-footer-tagline">
                    {t('nav.programDropdown.footerTagline', 'Flexible Learning Pathways. Learn First. Decide Later. Succeed Safely.')}
                </p>
            </div>
        </div>
    )
}

export default ProgramDropdown
