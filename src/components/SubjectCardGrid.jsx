import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import './SubjectCardGrid.css'

/**
 * SubjectCardGrid Component
 * Displays courses organized by subject cards (TVO Learn style)
 * Used in single-course pricing view on grade pages
 */

function SubjectCardGrid({ grade, courses, program = 'academic-prep' }) {
    const { t } = useTranslation()
    const { addItem } = useCart()

    const SUBJECT_CONFIG = [
        {
            key: 'Mathematics',
            name: t('subjects.math.name', 'Mathematics'),
            icon: '🔢',
            color: '#6366F1',
            description: t('subjects.math.desc', 'Number sense, operations, algebra, and problem-solving')
        },
        {
            key: 'Language',
            name: t('subjects.language.name', 'Language'),
            icon: '📖',
            color: '#F59E0B',
            description: t('subjects.language.desc', 'Reading, writing, speaking, and listening skills')
        },
        {
            key: 'Science & Technology',
            name: t('subjects.science.name', 'Science & Technology'),
            icon: '🔬',
            color: '#10B981',
            description: t('subjects.science.desc', 'Life systems, matter and energy, structures and mechanisms')
        },
        {
            key: 'Social Studies',
            name: t('subjects.social.name', 'Social Studies'),
            icon: '🌍',
            color: '#8B5CF6',
            description: t('subjects.social.desc', 'Heritage, communities, and citizenship')
        },
        {
            key: 'The Arts',
            name: t('subjects.arts.name', 'The Arts'),
            icon: '🎨',
            color: '#EC4899',
            description: t('subjects.arts.desc', 'Visual arts, music, drama, and dance')
        },
        {
            key: 'Health & Physical Education',
            name: t('subjects.health.name', 'Health & Physical Education'),
            icon: '💪',
            color: '#EF4444',
            description: t('subjects.health.desc', 'Active living, movement skills, and healthy choices')
        }
    ]

    // Group courses by subject
    const coursesBySubject = SUBJECT_CONFIG.map(subject => {
        const course = courses.find(c =>
            c.subject === subject.key &&
            c.grade === String(grade) &&
            c.program === program
        )
        return {
            ...subject,
            course
        }
    })

    const handleAddToCart = (course) => {
        const pricing = course.product?.pricing || {}
        const item = {
            id: course.code,
            code: course.code,
            title: course.title,
            grade: course.grade,
            subject: course.subject,
            storefront: course.storefront || program,
            price: pricing.salePrice || pricing.basePrice || pricing.perCourse || 0,
            listPrice: pricing.listPrice || 0,
        }
        addItem(item)
    }

    return (
        <div className="subject-card-grid">
            {coursesBySubject.map(({ key, name, icon, color, description, course }) => (
                <div
                    key={key}
                    className="subject-card"
                    style={{ '--subject-color': color }}
                >
                    <div
                        className="subject-header"
                        style={{ background: color }}
                    >
                        <span className="subject-icon">{icon}</span>
                        <h3>{name}</h3>
                    </div>

                    <div className="subject-body">
                        <p className="subject-description">{description}</p>

                        {course ? (
                            <>
                                <div className="course-info">
                                    <p className="course-title">{course.title}</p>

                                    {/* Pricing Display */}
                                    <div className="course-pricing">
                                        {program === 'academic-prep' ? (
                                            <>
                                                {course.product?.pricing?.listPrice && (
                                                    <span className="list-price">
                                                        ${course.product.pricing.listPrice}
                                                    </span>
                                                )}
                                                <span className="sale-price">
                                                    ${course.product?.pricing?.salePrice || course.product?.pricing?.basePrice}
                                                </span>
                                                {course.product?.pricing?.listPrice > course.product?.pricing?.salePrice && (
                                                    <span className="discount-badge">{t('subjects.discountBadge', '50% OFF')}</span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="price">
                                                ${course.product?.pricing?.perCourse}
                                            </span>
                                        )}
                                    </div>

                                    {/* Delivery Method */}
                                    <p className="delivery-method">
                                        {program === 'academic-prep'
                                            ? `📹 ${t('subjects.selfPacedVideo', 'Self-paced video')}`
                                            : `🎥 ${t('subjects.liveClasses', 'Live classes')}`}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="card-actions">
                                    <button
                                        className={`btn btn-sm ${program === 'academic-prep' ? 'btn-primary' : 'btn-accent'}`}
                                        onClick={() => handleAddToCart(course)}
                                    >
                                        {t('subjects.enroll', 'Enroll')}
                                    </button>
                                    <Link
                                        to={`/${program}/course/${course.code}`}
                                        className="btn btn-sm btn-outline"
                                    >
                                        {t('subjects.details', 'Details')}
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="no-course">
                                <p>{t('subjects.comingSoon', 'Course coming soon')}</p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default SubjectCardGrid
