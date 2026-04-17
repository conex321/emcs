import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './CoursesDropdown.css'

function CoursesDropdown({ isOpen, onClose }) {
    const { t } = useTranslation()

    const gradeGroups = [
        { label: t('nav.gradeGroups.elementary', 'Elementary'), grades: ['1', '2', '3', '4', '5'] },
        { label: t('nav.gradeGroups.middleSchool', 'Middle School'), grades: ['6', '7', '8'] },
        { label: t('nav.gradeGroups.highSchool', 'High School'), grades: ['9', '10', '11', '12'] }
    ]

    if (!isOpen) return null

    return (
        <div className="courses-dropdown">
            {gradeGroups.map(group => (
                <div key={group.label} className="courses-group">
                    <span className="courses-group-label">{group.label}</span>
                    <div className="courses-grade-list">
                        {group.grades.map(g => (
                            <Link
                                key={g}
                                to={`/grade/${g}`}
                                className="courses-grade-link"
                                onClick={onClose}
                            >
                                {t('nav.gradePrefix', 'Grade')} {g}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CoursesDropdown
