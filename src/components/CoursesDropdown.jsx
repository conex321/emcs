import { Link } from 'react-router-dom'
import './CoursesDropdown.css'

const gradeGroups = [
    { label: 'Elementary', grades: ['1', '2', '3', '4', '5'] },
    { label: 'Middle School', grades: ['6', '7', '8'] },
    { label: 'High School', grades: ['9', '10', '11', '12'] }
]

function CoursesDropdown({ isOpen, onClose }) {
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
                                Grade {g}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CoursesDropdown
