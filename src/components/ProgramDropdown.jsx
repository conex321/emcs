import { Link } from 'react-router-dom'
import './ProgramDropdown.css'

const gradeGroups = [
    { label: 'Elementary (1-5)', grades: ['1', '2', '3', '4', '5'] },
    { label: 'Middle School (6-8)', grades: ['6', '7', '8'] },
    { label: 'High School (9-12)', grades: ['9', '10', '11', '12'] }
]

function ProgramDropdown({ isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <div className="program-dropdown-two-panel">
            {/* Left Panel: Academic Preparation Program */}
            <div className="panel panel-left academic-prep">
                <div className="panel-header">
                    <div className="program-dot" style={{ background: '#2F80ED' }}></div>
                    <h3>Academic Preparation Program</h3>
                </div>
                <p className="panel-desc">Self-paced learning for practice and enrichment</p>

                <div className="grade-groups-list">
                    {gradeGroups.map(group => (
                        <div key={group.label} className="grade-group">
                            <span className="grade-group-label">{group.label}</span>
                            <div className="grade-pills">
                                {group.grades.map(g => (
                                    <Link
                                        key={g}
                                        to={`/academic-prep/grade/${g}`}
                                        className="grade-pill"
                                        onClick={onClose}
                                    >
                                        Gr {g}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <Link to="/academic-prep" className="panel-view-more" onClick={onClose}>
                    View More →
                </Link>
            </div>

            {/* Right Panel: Official Ontario Program */}
            <div className="panel panel-right official-ontario">
                <div className="panel-header">
                    <div className="program-dot" style={{ background: '#D4AF37' }}></div>
                    <h3>Official Ontario Program</h3>
                    <span className="featured-badge">Most Popular</span>
                </div>
                <p className="panel-desc">Earn official OSSD credits with live classes</p>

                <div className="grade-groups-list">
                    {gradeGroups.map(group => (
                        <div key={group.label} className="grade-group">
                            <span className="grade-group-label">{group.label}</span>
                            <div className="grade-pills">
                                {group.grades.map(g => (
                                    <Link
                                        key={g}
                                        to={`/official-ontario/grade/${g}`}
                                        className="grade-pill grade-pill-gold"
                                        onClick={onClose}
                                    >
                                        Gr {g}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <Link to="/official-ontario" className="panel-view-more" onClick={onClose}>
                    View More →
                </Link>
            </div>
        </div>
    )
}

export default ProgramDropdown
