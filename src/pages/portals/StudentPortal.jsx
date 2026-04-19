import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import {
    formatPortalDate,
    getDocumentTypeLabel,
    getProgressValue,
    isCreditStorefront,
    normalizeEnrollment,
} from '../../services/portalData'
import supabase from '../../services/supabaseClient'
import './PortalPages.css'

function StudentPortal() {
    const { t } = useTranslation()
    const { user, profile } = useAuth()
    const viewerRole = profile?.role || user?.user_metadata?.role

    const [enrollments, setEnrollments] = useState([])
    const [uploadedDocuments, setUploadedDocuments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function fetchEnrollments() {
            if (!user) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                // If user is a student, get their enrollments directly
                // If user is a parent, get enrollments for their children
                let query

                if (viewerRole === 'student') {
                    // Direct student — find their student record, then enrollments
                    const { data: studentRecord } = await supabase
                        .from('students')
                        .select('id')
                        .eq('email', user.email)
                        .maybeSingle()

                    if (studentRecord) {
                        const { data: documentsData, error: documentsError } = await supabase
                            .from('student_documents')
                            .select('id, document_type, file_name, status, created_at, student_id')
                            .eq('student_id', studentRecord.id)
                            .order('created_at', { ascending: false })

                        if (documentsError) throw documentsError
                        setUploadedDocuments(documentsData || [])

                        query = supabase
                            .from('enrollments')
                            .select(`
                                id,
                                status,
                                enrolled_at,
                                final_grade,
                                progress_pct,
                                courses (
                                    id, title, code, grade,
                                    storefront, description
                                ),
                                students (
                                    id, first_name, last_name
                                )
                            `)
                            .eq('student_id', studentRecord.id)
                            .order('enrolled_at', { ascending: false })
                    } else {
                        setEnrollments([])
                        setUploadedDocuments([])
                    }
                } else {
                    // Parent — get all children's enrollments
                    const { data: children } = await supabase
                        .from('students')
                        .select('id')
                        .eq('parent_id', user.id)

                    if (children && children.length > 0) {
                        const childIds = children.map(c => c.id)
                        const { data: documentsData, error: documentsError } = await supabase
                            .from('student_documents')
                            .select(`
                                id,
                                document_type,
                                file_name,
                                status,
                                created_at,
                                student_id,
                                students (
                                    first_name,
                                    last_name
                                )
                            `)
                            .in('student_id', childIds)
                            .order('created_at', { ascending: false })

                        if (documentsError) throw documentsError
                        setUploadedDocuments(documentsData || [])

                        query = supabase
                            .from('enrollments')
                            .select(`
                                id,
                                status,
                                enrolled_at,
                                final_grade,
                                progress_pct,
                                courses (
                                    id, title, code, grade,
                                    storefront, description
                                ),
                                students (
                                    id, first_name, last_name
                                )
                            `)
                            .in('student_id', childIds)
                            .order('enrolled_at', { ascending: false })
                    } else {
                        setEnrollments([])
                        setUploadedDocuments([])
                    }
                }

                if (query) {
                    const { data, error: fetchErr } = await query
                    if (fetchErr) throw fetchErr
                    setEnrollments((data || []).map(normalizeEnrollment))
                }
            } catch (err) {
                console.error('Failed to fetch enrollments:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchEnrollments()
    }, [user, viewerRole])

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'
    const activeEnrollments = enrollments.filter(e => e.status === 'active' || e.status === 'enrolled')
    const completedEnrollments = enrollments.filter(e => e.status === 'completed')

    return (
        <div className="portal-page student-portal">
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
                                {t('portal.student.welcome', 'Welcome back')}, {displayName.split(' ')[0]}! 📚
                            </h1>
                            <p className="portal-subtitle">
                                {t('portal.student.subtitle', 'Track your courses and learning progress')}
                            </p>
                        </div>
                    </div>
                    <div className="portal-header-stats">
                        <div className="stat-chip">
                            <span className="stat-chip-number">{activeEnrollments.length}</span>
                            <span className="stat-chip-label">{t('portal.student.activeCourses', 'Active')}</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-chip-number">{completedEnrollments.length}</span>
                            <span className="stat-chip-label">{t('portal.student.completed', 'Completed')}</span>
                        </div>
                    </div>
                </header>

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
                ) : enrollments.length === 0 ? (
                    /* Empty State */
                    <div className="portal-empty">
                        <div className="portal-empty-icon">🎓</div>
                        <h2>{t('portal.student.emptyTitle', 'No Courses Yet')}</h2>
                        <p>
                            {t('portal.student.emptyDesc', "You haven't been enrolled in any courses yet. Browse our programs to get started on your Canadian education journey.")}
                        </p>
                        <div className="portal-empty-actions">
                            <Link to="/academic-prep" className="btn btn-accent btn-lg">
                                {t('portal.student.browseAcademic', 'Browse Academic Prep')}
                            </Link>
                            <Link to="/official-ontario" className="btn btn-secondary btn-lg">
                                {t('portal.student.browseCredit', 'Browse Credit Courses')}
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Active Courses */}
                        {activeEnrollments.length > 0 && (
                            <section className="portal-section">
                                <h2 className="portal-section-title">
                                    📖 {t('portal.student.activeCourses', 'Active Courses')}
                                </h2>
                                <div className="course-cards-grid">
                                    {activeEnrollments.map(enrollment => (
                                        <div key={enrollment.id} className="course-card">
                                            <div className="course-card-header">
                                                <span className={`course-card-badge ${enrollment.courses?.storefront || 'academic-prep'}`}>
                                                    {isCreditStorefront(enrollment.courses?.storefront)
                                                        ? t('portal.student.creditCourse', 'Credit')
                                                        : t('portal.student.nonCreditCourse', 'Academic Prep')}
                                                </span>
                                                <span className="course-card-status active">
                                                    {t('portal.student.active', 'Active')}
                                                </span>
                                            </div>

                                            <h3 className="course-card-title">
                                                {enrollment.courses?.title || 'Course'}
                                            </h3>
                                            <p className="course-card-code">
                                                {enrollment.courses?.course_code}
                                                {enrollment.courses?.grade_level && (
                                                    <span> • Grade {enrollment.courses.grade_level}</span>
                                                )}
                                            </p>

                                            {enrollment.students && (
                                                <p className="course-card-student">
                                                    👤 {enrollment.students.first_name} {enrollment.students.last_name}
                                                </p>
                                            )}

                                            {/* Progress Bar */}
                                            <div className="progress-section">
                                                <div className="progress-header">
                                                    <span>{t('portal.student.progress', 'Progress')}</span>
                                                    <span>{getProgressValue(enrollment.progress)}%</span>
                                                </div>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${getProgressValue(enrollment.progress)}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="course-card-footer">
                                                <span className="course-card-date">
                                                    {t('portal.student.enrolledOn', 'Enrolled')}: {formatPortalDate(enrollment.enrollment_date)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Completed Courses */}
                        {completedEnrollments.length > 0 && (
                            <section className="portal-section">
                                <h2 className="portal-section-title">
                                    ✅ {t('portal.student.completedCourses', 'Completed Courses')}
                                </h2>
                                <div className="course-cards-grid">
                                    {completedEnrollments.map(enrollment => (
                                        <div key={enrollment.id} className="course-card course-card--completed">
                                            <div className="course-card-header">
                                                <span className={`course-card-badge ${enrollment.courses?.storefront || 'academic-prep'}`}>
                                                    {isCreditStorefront(enrollment.courses?.storefront) ? 'Credit' : 'Academic Prep'}
                                                </span>
                                                <span className="course-card-status completed">
                                                    {t('portal.student.complete', 'Complete')} ✓
                                                </span>
                                            </div>
                                            <h3 className="course-card-title">{enrollment.courses?.title || 'Course'}</h3>
                                            <p className="course-card-code">{enrollment.courses?.course_code}</p>
                                            {enrollment.grade && (
                                                <p className="course-card-grade-result">
                                                    {t('portal.student.finalGrade', 'Final Grade')}: <strong>{enrollment.grade}</strong>
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Quick Actions */}
                        {uploadedDocuments.length > 0 && (
                            <section className="portal-section">
                                <h2 className="portal-section-title">
                                    📄 Uploaded Documents
                                </h2>
                                <div className="admin-doc-grid">
                                    {uploadedDocuments.map((document) => (
                                        <article key={document.id} className="admin-doc-card">
                                            <div className="admin-doc-header">
                                                <h3>{document.file_name}</h3>
                                                <span className={`status-badge ${document.status === 'linked' ? 'active' : 'pending'}`}>
                                                    {document.status}
                                                </span>
                                            </div>
                                            {document.students && (
                                                <p>{document.students.first_name} {document.students.last_name}</p>
                                            )}
                                            <div className="admin-doc-meta">
                                                <span>{getDocumentTypeLabel(document.document_type)}</span>
                                                <span>{formatPortalDate(document.created_at)}</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="portal-section">
                            <h2 className="portal-section-title">
                                ⚡ {t('portal.student.quickActions', 'Quick Actions')}
                            </h2>
                            <div className="quick-actions-grid">
                                <Link to="/academic-prep" className="quick-action-card">
                                    <span className="quick-action-icon">📚</span>
                                    <span className="quick-action-label">{t('portal.student.browseCourses', 'Browse Courses')}</span>
                                </Link>
                                <a href="mailto:support@emcs.ca" className="quick-action-card">
                                    <span className="quick-action-icon">📧</span>
                                    <span className="quick-action-label">{t('portal.student.contactTeacher', 'Contact Teacher')}</span>
                                </a>
                                <Link to="/schedule" className="quick-action-card">
                                    <span className="quick-action-icon">📅</span>
                                    <span className="quick-action-label">{t('portal.student.viewSchedule', 'View Schedule')}</span>
                                </Link>
                                <Link to="/student-support" className="quick-action-card">
                                    <span className="quick-action-icon">🆘</span>
                                    <span className="quick-action-label">{t('portal.student.getHelp', 'Get Help')}</span>
                                </Link>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    )
}

export default StudentPortal
