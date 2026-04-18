import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../config/pricing'
import {
    formatPortalDate,
    getProgressValue,
    isCreditStorefront,
    normalizeEnrollment,
    normalizeOrder,
} from '../../services/portalData'
import supabase from '../../services/supabaseClient'
import './PortalPages.css'

function ParentPortal() {
    const { t } = useTranslation()
    const { user, profile } = useAuth()

    const [children, setChildren] = useState([])
    const [orders, setOrders] = useState([])
    const [enrollments, setEnrollments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        async function fetchDashboard() {
            if (!user) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                // Fetch children
                const { data: childrenData, error: childErr } = await supabase
                    .from('students')
                    .select(`
                        id, first_name, last_name, date_of_birth,
                        current_grade, email, created_at
                    `)
                    .eq('parent_id', user.id)
                    .order('created_at', { ascending: false })

                if (childErr) throw childErr
                setChildren(childrenData || [])

                // Fetch enrollments for all children
                if (childrenData && childrenData.length > 0) {
                    const childIds = childrenData.map(c => c.id)
                    const { data: enrollData, error: enrollErr } = await supabase
                        .from('enrollments')
                        .select(`
                            id, status, enrolled_at, progress_pct, final_grade,
                            courses (id, title, code, grade, storefront),
                            students (id, first_name, last_name)
                        `)
                        .in('student_id', childIds)
                        .order('enrolled_at', { ascending: false })

                    if (enrollErr) throw enrollErr
                    setEnrollments((enrollData || []).map(normalizeEnrollment))
                } else {
                    setEnrollments([])
                }

                // Fetch orders
                const { data: orderData, error: orderErr } = await supabase
                    .from('orders')
                    .select(`
                        id, order_number, status, total,
                        payment_method, created_at,
                        order_items (id)
                    `)
                    .eq('parent_id', user.id)
                    .order('created_at', { ascending: false })

                if (orderErr) throw orderErr
                setOrders((orderData || []).map(normalizeOrder))

            } catch (err) {
                console.error('Failed to fetch dashboard:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [user])

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Parent'
    const activeEnrollments = enrollments.filter(e => e.status === 'active' || e.status === 'enrolled')
    const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0)

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': case 'enrolled': return 'active'
            case 'completed': return 'completed'
            case 'pending': return 'pending'
            case 'cancelled': return 'cancelled'
            default: return ''
        }
    }

    return (
        <div className="portal-page parent-portal">
            <div className="container">
                {/* Welcome Header */}
                <header className="portal-header">
                    <div className="portal-header-content">
                        <div className="portal-avatar">
                            <span className="portal-avatar-text">
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="portal-greeting">
                                {t('portal.parent.welcome', 'Welcome')}, {displayName.split(' ')[0]}! 👨‍👩‍👧‍👦
                            </h1>
                            <p className="portal-subtitle">
                                {t('portal.parent.subtitle', "Manage your children's education and enrollment")}
                            </p>
                        </div>
                    </div>
                    <div className="portal-header-stats">
                        <div className="stat-chip">
                            <span className="stat-chip-number">{children.length}</span>
                            <span className="stat-chip-label">{t('portal.parent.children', 'Children')}</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-chip-number">{activeEnrollments.length}</span>
                            <span className="stat-chip-label">{t('portal.parent.enrollments', 'Enrollments')}</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-chip-number">{orders.length}</span>
                            <span className="stat-chip-label">{t('portal.parent.orders', 'Orders')}</span>
                        </div>
                    </div>
                </header>

                {/* Navigation Tabs */}
                <div className="portal-tabs">
                    <button
                        className={`portal-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 {t('portal.parent.overview', 'Overview')}
                    </button>
                    <button
                        className={`portal-tab ${activeTab === 'children' ? 'active' : ''}`}
                        onClick={() => setActiveTab('children')}
                    >
                        👧 {t('portal.parent.myChildren', 'My Children')}
                    </button>
                    <button
                        className={`portal-tab ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        🧾 {t('portal.parent.orderHistory', 'Orders')}
                    </button>
                </div>

                {loading ? (
                    <div className="portal-loading">
                        <div className="portal-spinner" />
                        <p>{t('portal.loading', 'Loading your dashboard...')}</p>
                    </div>
                ) : error ? (
                    <div className="portal-error">
                        <p>⚠️ {error}</p>
                        <button onClick={() => window.location.reload()} className="btn btn-secondary">
                            {t('portal.retry', 'Try Again')}
                        </button>
                    </div>
                ) : (
                    <>
                        {/* ════════ Overview Tab ════════ */}
                        {activeTab === 'overview' && (
                            <>
                                {children.length === 0 && orders.length === 0 ? (
                                    <div className="portal-empty">
                                        <div className="portal-empty-icon">👨‍👩‍👧</div>
                                        <h2>{t('portal.parent.emptyTitle', 'Get Started')}</h2>
                                        <p>
                                            {t('portal.parent.emptyDesc', "You haven't enrolled any students yet. Browse our programs and start your child's Canadian education journey today.")}
                                        </p>
                                        <div className="portal-empty-actions">
                                            <Link to="/academic-prep" className="btn btn-accent btn-lg">
                                                {t('portal.parent.browseAcademic', 'Browse Academic Prep')}
                                            </Link>
                                            <Link to="/official-ontario" className="btn btn-secondary btn-lg">
                                                {t('portal.parent.browseCredit', 'Browse Credit Courses')}
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* Children Overview Cards */}
                                        {children.length > 0 && (
                                            <section className="portal-section">
                                                <h2 className="portal-section-title">
                                                    👧 {t('portal.parent.childrenOverview', 'Children Overview')}
                                                </h2>
                                                <div className="children-cards-grid">
                                                    {children.map(child => {
                                                        const childEnrollments = enrollments.filter(
                                                            e => e.students?.id === child.id
                                                        )
                                                        const activeCount = childEnrollments.filter(
                                                            e => e.status === 'active' || e.status === 'enrolled'
                                                        ).length
                                                        return (
                                                            <div key={child.id} className="child-card">
                                                                <div className="child-card-avatar">
                                                                    {child.first_name?.charAt(0) || '?'}
                                                                </div>
                                                                <div className="child-card-info">
                                                                    <h3>{child.first_name} {child.last_name}</h3>
                                                                    <p className="child-card-grade">
                                                                        {child.current_grade ? `Grade ${child.current_grade}` : t('portal.parent.gradeNotSet', 'Grade not set')}
                                                                    </p>
                                                                    <div className="child-card-stats">
                                                                        <span className="child-stat">
                                                                            📚 {activeCount} {t('portal.parent.activeCourses', 'active')}
                                                                        </span>
                                                                        <span className="child-stat">
                                                                            ✅ {childEnrollments.filter(e => e.status === 'completed').length} {t('portal.parent.completedCourses', 'completed')}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </section>
                                        )}

                                        {/* Recent Enrollments */}
                                        {enrollments.length > 0 && (
                                            <section className="portal-section">
                                                <h2 className="portal-section-title">
                                                    📖 {t('portal.parent.recentEnrollments', 'Recent Enrollments')}
                                                </h2>
                                                <div className="enrollments-table-wrapper">
                                                    <table className="portal-table">
                                                        <thead>
                                                            <tr>
                                                                <th>{t('portal.parent.student', 'Student')}</th>
                                                                <th>{t('portal.parent.course', 'Course')}</th>
                                                                <th>{t('portal.parent.status', 'Status')}</th>
                                                                <th>{t('portal.parent.progress', 'Progress')}</th>
                                                                <th>{t('portal.parent.enrolled', 'Enrolled')}</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {enrollments.slice(0, 10).map(enrollment => (
                                                                <tr key={enrollment.id}>
                                                                    <td>
                                                                        {enrollment.students?.first_name} {enrollment.students?.last_name}
                                                                    </td>
                                                                    <td>
                                                                        <div>
                                                                            <strong>{enrollment.courses?.course_code}</strong>
                                                                            <br />
                                                                            <span className="table-subtitle">{enrollment.courses?.title}</span>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <span className={`status-badge ${getStatusColor(enrollment.status)}`}>
                                                                            {enrollment.status}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <div className="progress-bar-small">
                                                                            <div className="progress-fill" style={{ width: `${getProgressValue(enrollment.progress)}%` }} />
                                                                        </div>
                                                                        <span className="progress-text">{getProgressValue(enrollment.progress)}%</span>
                                                                    </td>
                                                                    <td>{formatPortalDate(enrollment.enrollment_date)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </section>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {/* ════════ Children Tab ════════ */}
                        {activeTab === 'children' && (
                            <section className="portal-section">
                                {children.length === 0 ? (
                                    <div className="portal-empty">
                                        <div className="portal-empty-icon">👧</div>
                                        <h2>{t('portal.parent.noChildren', 'No Students Enrolled')}</h2>
                                        <p>{t('portal.parent.noChildrenDesc', 'Enroll a student by purchasing a course from our storefront.')}</p>
                                        <Link to="/academic-prep" className="btn btn-accent">
                                            {t('portal.parent.enrollNow', 'Enroll Now')}
                                        </Link>
                                    </div>
                                ) : (
                                    children.map(child => {
                                        const childEnrollments = enrollments.filter(
                                            e => e.students?.id === child.id
                                        )
                                        return (
                                            <div key={child.id} className="child-detail-section">
                                                <h3 className="child-detail-name">
                                                    {child.first_name} {child.last_name}
                                                    {child.current_grade && (
                                                        <span className="child-detail-grade">
                                                            Grade {child.current_grade}
                                                        </span>
                                                    )}
                                                </h3>
                                                {childEnrollments.length === 0 ? (
                                                    <p className="child-no-courses">
                                                        {t('portal.parent.noCourses', 'No courses enrolled yet.')}
                                                    </p>
                                                ) : (
                                                    <div className="course-cards-grid">
                                                        {childEnrollments.map(enrollment => (
                                                            <div key={enrollment.id} className="course-card">
                                                                <div className="course-card-header">
                                                                    <span className={`course-card-badge ${enrollment.courses?.storefront || 'academic-prep'}`}>
                                                                        {isCreditStorefront(enrollment.courses?.storefront) ? 'Credit' : 'Academic Prep'}
                                                                    </span>
                                                                    <span className={`course-card-status ${getStatusColor(enrollment.status)}`}>
                                                                        {enrollment.status}
                                                                    </span>
                                                                </div>
                                                                <h3 className="course-card-title">{enrollment.courses?.title}</h3>
                                                                <p className="course-card-code">{enrollment.courses?.course_code}</p>
                                                                <div className="progress-section">
                                                                    <div className="progress-header">
                                                                        <span>Progress</span>
                                                                        <span>{getProgressValue(enrollment.progress)}%</span>
                                                                    </div>
                                                                    <div className="progress-bar">
                                                                        <div className="progress-fill" style={{ width: `${getProgressValue(enrollment.progress)}%` }} />
                                                                    </div>
                                                                </div>
                                                                {enrollment.grade && (
                                                                    <p className="course-card-grade-result">
                                                                        Grade: <strong>{enrollment.grade}</strong>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })
                                )}
                            </section>
                        )}

                        {/* ════════ Orders Tab ════════ */}
                        {activeTab === 'orders' && (
                            <section className="portal-section">
                                {orders.length === 0 ? (
                                    <div className="portal-empty">
                                        <div className="portal-empty-icon">🧾</div>
                                        <h2>{t('portal.parent.noOrders', 'No Orders Yet')}</h2>
                                        <p>{t('portal.parent.noOrdersDesc', 'Your order history will appear here after your first purchase.')}</p>
                                        <Link to="/academic-prep" className="btn btn-accent">
                                            {t('portal.parent.startShopping', 'Start Shopping')}
                                        </Link>
                                    </div>
                                ) : (
                                    <>
                                        <div className="order-summary-bar">
                                            <span>{orders.length} {t('portal.parent.totalOrders', 'total orders')}</span>
                                            <span>{t('portal.parent.totalSpent', 'Total spent')}: <strong>{formatCurrency(totalSpent)}</strong></span>
                                        </div>
                                        <div className="enrollments-table-wrapper">
                                            <table className="portal-table">
                                                <thead>
                                                    <tr>
                                                        <th>{t('portal.parent.orderNumber', 'Order #')}</th>
                                                        <th>{t('portal.parent.date', 'Date')}</th>
                                                        <th>{t('portal.parent.amount', 'Amount')}</th>
                                                        <th>{t('portal.parent.payment', 'Payment')}</th>
                                                        <th>{t('portal.parent.status', 'Status')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map(order => (
                                                        <tr key={order.id}>
                                                            <td><strong>#{order.order_number}</strong></td>
                                                            <td>{formatPortalDate(order.created_at)}</td>
                                                            <td>{formatCurrency(order.total_amount)}</td>
                                                            <td>
                                                                <span className="payment-badge">
                                                                    {order.payment_method === 'free' ? '🎁 Free' :
                                                                     order.payment_method === 'card' ? '💳 Card' :
                                                                     order.payment_method === 'flywire' ? '🌍 Flywire' :
                                                                     order.payment_method || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <span className={`status-badge ${getStatusColor(order.status)}`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}
                            </section>
                        )}

                        {/* Quick Actions */}
                        <section className="portal-section">
                            <h2 className="portal-section-title">
                                ⚡ {t('portal.parent.quickActions', 'Quick Actions')}
                            </h2>
                            <div className="quick-actions-grid">
                                <Link to="/academic-prep" className="quick-action-card">
                                    <span className="quick-action-icon">📚</span>
                                    <span className="quick-action-label">{t('portal.parent.enrollMore', 'Enroll in More Courses')}</span>
                                </Link>
                                <a href="mailto:support@emcs.ca" className="quick-action-card">
                                    <span className="quick-action-icon">📧</span>
                                    <span className="quick-action-label">{t('portal.parent.contactSupport', 'Contact Support')}</span>
                                </a>
                                <Link to="/portal/student" className="quick-action-card">
                                    <span className="quick-action-icon">🎓</span>
                                    <span className="quick-action-label">{t('portal.parent.viewStudentPortal', 'Student Portal')}</span>
                                </Link>
                                <Link to="/faq" className="quick-action-card">
                                    <span className="quick-action-icon">❓</span>
                                    <span className="quick-action-label">{t('portal.parent.faq', 'FAQ')}</span>
                                </Link>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    )
}

export default ParentPortal
