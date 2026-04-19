import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../config/pricing'
import { formatPortalDate, getDocumentTypeLabel, normalizeEnrollment, normalizeOrder } from '../../services/portalData'
import supabase from '../../services/supabaseClient'
import '../portals/PortalPages.css'

function generateTempPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let password = 'EMCS-'

    while (password.length < 14) {
        password += chars[Math.floor(Math.random() * chars.length)]
    }

    return `${password}!`
}

function getStatusClass(status) {
    switch (status) {
        case 'active':
        case 'paid':
        case 'processing':
        case 'sent':
            return 'active'
        case 'completed':
        case 'published':
            return 'completed'
        case 'failed':
        case 'cancelled':
        case 'bounced':
            return 'cancelled'
        default:
            return 'pending'
    }
}

function getStudentFullName(student) {
    return `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Unnamed student'
}

function AdminDashboard() {
    const { user, profile } = useAuth()
    const activeRole = profile?.role || user?.user_metadata?.role || 'admin'

    const [activeTab, setActiveTab] = useState('overview')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [warnings, setWarnings] = useState([])
    const [students, setStudents] = useState([])
    const [enrollments, setEnrollments] = useState([])
    const [orders, setOrders] = useState([])
    const [profiles, setProfiles] = useState([])
    const [reportCards, setReportCards] = useState([])
    const [studentDocuments, setStudentDocuments] = useState([])
    const [emailLog, setEmailLog] = useState([])
    const [auditLog, setAuditLog] = useState([])
    const [refreshKey, setRefreshKey] = useState(0)
    const [message, setMessage] = useState(null)
    const [busyActions, setBusyActions] = useState({})
    const [accountPasswords, setAccountPasswords] = useState({})
    const [createForm, setCreateForm] = useState({
        fullName: '',
        email: '',
        role: 'student',
        password: '',
        phone: '',
    })

    useEffect(() => {
        if (!message) {
            return undefined
        }

        const timeoutId = window.setTimeout(() => setMessage(null), 6000)
        return () => window.clearTimeout(timeoutId)
    }, [message])

    useEffect(() => {
        let isMounted = true

        async function loadDashboard() {
            if (!user) {
                if (isMounted) {
                    setLoading(false)
                }
                return
            }

            setLoading(true)
            setError('')
            setWarnings([])

            const nextWarnings = []

            try {
                const [
                    studentsResult,
                    enrollmentsResult,
                    ordersResult,
                    profilesResult,
                    reportCardsResult,
                    studentDocumentsResult,
                    emailLogResult,
                    auditLogResult,
                ] = await Promise.all([
                    supabase
                        .from('students')
                        .select(`
                            id,
                            parent_id,
                            first_name,
                            last_name,
                            email,
                            current_grade,
                            previous_school,
                            is_active,
                            moodle_user_id,
                            moodle_username,
                            moodle_credentials_generated,
                            registration_email_sent,
                            receipt_email_sent,
                            created_at,
                            parent:parent_id (
                                full_name,
                                email
                            )
                        `)
                        .order('created_at', { ascending: false })
                        .limit(50),
                    supabase
                        .from('enrollments')
                        .select(`
                            id,
                            student_id,
                            order_item_id,
                            status,
                            enrolled_at,
                            progress_pct,
                            final_grade,
                            courses (
                                id,
                                title,
                                code,
                                grade,
                                storefront
                            ),
                            students (
                                id,
                                first_name,
                                last_name
                            )
                        `)
                        .order('enrolled_at', { ascending: false })
                        .limit(100),
                    supabase
                        .from('orders')
                        .select(`
                            id,
                            order_number,
                            status,
                            total,
                            payment_method,
                            coupon_code,
                            agent_code,
                            created_at,
                            parent_details,
                            order_items (
                                id,
                                student_id,
                                course_code,
                                course_title,
                                price
                            )
                        `)
                        .order('created_at', { ascending: false })
                        .limit(50),
                    supabase
                        .from('profiles')
                        .select('id, full_name, email, role, created_at')
                        .order('created_at', { ascending: false })
                        .limit(200),
                    supabase
                        .from('report_cards')
                        .select(`
                            id,
                            student_id,
                            term,
                            academic_year,
                            file_name,
                            file_path,
                            file_type,
                            uploaded_at,
                            is_published,
                            students (
                                first_name,
                                last_name
                            )
                        `)
                        .order('uploaded_at', { ascending: false })
                        .limit(50),
                    supabase
                        .from('student_documents')
                        .select(`
                            id,
                            student_id,
                            document_type,
                            file_name,
                            file_path,
                            status,
                            created_at,
                            student_first_name,
                            student_last_name,
                            students (
                                first_name,
                                last_name
                            )
                        `)
                        .order('created_at', { ascending: false })
                        .limit(100),
                    supabase
                        .from('email_log')
                        .select('id, recipient, template, subject, status, error_message, metadata, sent_at')
                        .order('sent_at', { ascending: false })
                        .limit(50),
                    supabase
                        .from('audit_log')
                        .select(`
                            id,
                            action,
                            target_type,
                            target_id,
                            created_at,
                            new_values,
                            actor:actor_id (
                                full_name,
                                email
                            )
                        `)
                        .order('created_at', { ascending: false })
                        .limit(30),
                ])

                const coreErrors = [
                    studentsResult.error,
                    enrollmentsResult.error,
                    ordersResult.error,
                    profilesResult.error,
                ].filter(Boolean)

                if (coreErrors.length > 0) {
                    throw coreErrors[0]
                }

                if (reportCardsResult.error) {
                    nextWarnings.push(`Report cards could not be loaded: ${reportCardsResult.error.message}`)
                }

                if (studentDocumentsResult.error) {
                    nextWarnings.push(`Student documents could not be loaded: ${studentDocumentsResult.error.message}`)
                }

                if (emailLogResult.error) {
                    nextWarnings.push(`Email activity could not be loaded: ${emailLogResult.error.message}`)
                }

                if (auditLogResult.error) {
                    nextWarnings.push(`Audit history could not be loaded: ${auditLogResult.error.message}`)
                }

                if (!isMounted) {
                    return
                }

                setStudents(studentsResult.data || [])
                setEnrollments((enrollmentsResult.data || []).map(normalizeEnrollment))
                setOrders((ordersResult.data || []).map(normalizeOrder))
                setProfiles(profilesResult.data || [])
                setReportCards(reportCardsResult.data || [])
                setStudentDocuments(studentDocumentsResult.data || [])
                setEmailLog(emailLogResult.data || [])
                setAuditLog(auditLogResult.data || [])
                setWarnings(nextWarnings)
            } catch (err) {
                console.error('Failed to load admin dashboard:', err)

                if (!isMounted) {
                    return
                }

                setError(err.message || 'Unable to load the admin dashboard.')
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        loadDashboard()

        return () => {
            isMounted = false
        }
    }, [refreshKey, user])

    const profileByEmail = profiles.reduce((map, item) => {
        const key = item.email?.trim()?.toLowerCase()
        if (!key) {
            return map
        }

        if (!map[key]) {
            map[key] = []
        }

        map[key].push(item)
        return map
    }, {})

    const registrationRows = students.map((student) => {
        const studentEnrollments = enrollments.filter((enrollment) => {
            const normalizedStudentId = enrollment.students?.id || enrollment.student_id
            return normalizedStudentId === student.id
        })
        const studentOrders = orders.filter((order) =>
            order.order_items.some((item) => item.student_id === student.id)
        )
        const latestOrder = studentOrders[0] || null
        const portalAccount = student.email
            ? (profileByEmail[student.email.trim().toLowerCase()] || []).find((item) => item.role === 'student')
            : null
        const needsApproval = !student.is_active
            || studentEnrollments.some((enrollment) => enrollment.status === 'pending')
            || !student.registration_email_sent
        const uploadedDocumentCount = studentDocuments.filter((document) => document.student_id === student.id).length

        return {
            ...student,
            latestOrder,
            studentEnrollments,
            portalAccount,
            uploadedDocumentCount,
            needsApproval,
        }
    })

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const activeEnrollments = enrollments.filter((item) => item.status === 'active')
    const pendingReviews = registrationRows.filter((item) => item.needsApproval)
    const failedEmails = emailLog.filter((entry) => entry.status === 'failed' || entry.status === 'bounced')
    const docsAvailable = reportCards.length + studentDocuments.length

    const setBusy = (key, value) => {
        setBusyActions((prev) => ({ ...prev, [key]: value }))
    }

    const refreshDashboard = () => setRefreshKey((value) => value + 1)

    const invokeManageUser = async (payload) => {
        const { data, error } = await supabase.functions.invoke('manage-user', {
            body: payload,
        })

        if (error) {
            let message = error.message || 'Manage-user request failed.'

            if (error.context) {
                try {
                    const details = await error.context.json()
                    message = details?.error || details?.message || message
                } catch {
                    // Ignore JSON parsing failures and keep the original message.
                }
            }

            throw new Error(message)
        }

        if (data?.error) {
            throw new Error(data.error)
        }

        return data
    }

    const fallbackApproveStudent = async (studentId) => {
        const { error: studentError } = await supabase
            .from('students')
            .update({ is_active: true })
            .eq('id', studentId)

        if (studentError) {
            throw studentError
        }

        const { error: enrollmentError } = await supabase
            .from('enrollments')
            .update({ status: 'active' })
            .eq('student_id', studentId)
            .eq('status', 'pending')

        if (enrollmentError) {
            throw enrollmentError
        }
    }

    const fallbackSendRegistrationEmail = async (studentId, orderId) => {
        const { data, error } = await supabase.functions.invoke('send-registration-email', {
            body: {
                student_id: studentId,
                order_id: orderId || null,
            },
        })

        if (error) {
            throw error
        }

        if (data?.error) {
            throw new Error(data.error)
        }

        return data
    }

    const handleApproveStudent = async (student) => {
        const key = `approve:${student.id}`
        setBusy(key, true)

        try {
            try {
                await invokeManageUser({
                    action: 'approve_student',
                    student_id: student.id,
                })
            } catch (err) {
                const message = String(err.message || '')

                if (message.includes('Unauthorized') || message.includes('Admin access required')) {
                    throw err
                }

                await fallbackApproveStudent(student.id)
            }

            setMessage({
                type: 'success',
                text: `${getStudentFullName(student)} is approved and ready for active enrollment.`,
            })
            refreshDashboard()
        } catch (err) {
            console.error('Approve student failed:', err)
            setMessage({
                type: 'error',
                text: err.message || 'Student approval failed.',
            })
        } finally {
            setBusy(key, false)
        }
    }

    const handleSendRegistrationEmail = async (student) => {
        const key = `email:${student.id}`
        setBusy(key, true)

        try {
            const latestOrderId = student.latestOrder?.id || null

            try {
                await invokeManageUser({
                    action: 'send_registration_email',
                    student_id: student.id,
                    order_id: latestOrderId,
                })
            } catch (err) {
                const message = String(err.message || '')

                if (message.includes('Unauthorized') || message.includes('Admin access required')) {
                    throw err
                }

                await fallbackSendRegistrationEmail(student.id, latestOrderId)
            }

            setMessage({
                type: 'success',
                text: `Registration email sent to ${student.email || 'the parent contact'} for ${getStudentFullName(student)}.`,
            })
            refreshDashboard()
        } catch (err) {
            console.error('Send registration email failed:', err)
            setMessage({
                type: 'error',
                text: err.message || 'Registration email failed.',
            })
        } finally {
            setBusy(key, false)
        }
    }

    const handleCreatePortalAccount = async (student) => {
        const key = `account:${student.id}`
        setBusy(key, true)

        try {
            if (!student.email) {
                throw new Error('Student email is required before a portal account can be created.')
            }

            const generatedPassword = generateTempPassword()
            await invokeManageUser({
                action: 'create',
                email: student.email,
                password: generatedPassword,
                full_name: getStudentFullName(student),
                role: 'student',
            })

            setAccountPasswords((prev) => ({
                ...prev,
                [student.id]: generatedPassword,
            }))
            setMessage({
                type: 'success',
                text: `Student portal account created for ${student.email}. Temporary password is shown below.`,
            })
            refreshDashboard()
        } catch (err) {
            console.error('Create student portal account failed:', err)
            setMessage({
                type: 'error',
                text: err.message || 'Student portal account creation failed.',
            })
        } finally {
            setBusy(key, false)
        }
    }

    const handleCreateAccount = async (event) => {
        event.preventDefault()

        const key = 'account:create'
        setBusy(key, true)

        try {
            const password = createForm.password.trim() || generateTempPassword()
            await invokeManageUser({
                action: 'create',
                email: createForm.email.trim(),
                password,
                full_name: createForm.fullName.trim(),
                role: createForm.role,
                phone: createForm.phone.trim() || null,
            })

            setMessage({
                type: 'success',
                text: `Account created for ${createForm.email.trim()}. Temporary password: ${password}`,
            })
            setCreateForm({
                fullName: '',
                email: '',
                role: 'student',
                password: '',
                phone: '',
            })
            refreshDashboard()
        } catch (err) {
            console.error('Create account failed:', err)
            setMessage({
                type: 'error',
                text: err.message || 'Account creation failed.',
            })
        } finally {
            setBusy(key, false)
        }
    }

    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'

    return (
        <div className="portal-page admin-portal">
            <div className="container">
                <header className="portal-header">
                    <div className="portal-header-content">
                        <div className="portal-avatar admin-avatar">
                            <span className="portal-avatar-text">
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="portal-greeting">Admin Dashboard</h1>
                            <p className="portal-subtitle">
                                {displayName} • {activeRole === 'school_admin' ? 'School Admin' : 'Platform Admin'}
                            </p>
                        </div>
                    </div>
                    <div className="portal-header-stats">
                        <div className="stat-chip">
                            <span className="stat-chip-number">{students.length}</span>
                            <span className="stat-chip-label">Students</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-chip-number">{activeEnrollments.length}</span>
                            <span className="stat-chip-label">Active</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-chip-number">{pendingReviews.length}</span>
                            <span className="stat-chip-label">Needs Review</span>
                        </div>
                        <div className="stat-chip">
                            <span className="stat-chip-number">{formatCurrency(totalRevenue)}</span>
                            <span className="stat-chip-label">Revenue</span>
                        </div>
                    </div>
                </header>

                {activeRole === 'school_admin' && (
                    <div className="admin-notice admin-notice--warning">
                        School-level scoping is not modeled in the current database yet, so this dashboard still surfaces platform-wide records.
                    </div>
                )}

                {message && (
                    <div className={`admin-notice ${message.type === 'error' ? 'admin-notice--error' : 'admin-notice--success'}`}>
                        {message.text}
                    </div>
                )}

                {warnings.length > 0 && (
                    <div className="admin-notice admin-notice--warning">
                        {warnings.join(' ')}
                    </div>
                )}

                <div className="portal-tabs">
                    <button
                        className={`portal-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={`portal-tab ${activeTab === 'registrations' ? 'active' : ''}`}
                        onClick={() => setActiveTab('registrations')}
                    >
                        Registrations
                    </button>
                    <button
                        className={`portal-tab ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        Documents
                    </button>
                    <button
                        className={`portal-tab ${activeTab === 'accounts' ? 'active' : ''}`}
                        onClick={() => setActiveTab('accounts')}
                    >
                        Accounts & Email
                    </button>
                </div>

                {loading ? (
                    <div className="portal-loading">
                        <div className="portal-spinner" />
                        <p>Loading the admin dashboard...</p>
                    </div>
                ) : error ? (
                    <div className="portal-error">
                        <p>⚠️ {error}</p>
                        <button onClick={refreshDashboard} className="btn btn-secondary">
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        {activeTab === 'overview' && (
                            <>
                                <section className="portal-section">
                                    <div className="admin-stats-grid">
                                        <div className="admin-stat-card">
                                            <span className="admin-stat-label">Recent Orders</span>
                                            <strong className="admin-stat-value">{orders.length}</strong>
                                            <span className="admin-stat-meta">Most recent 50 orders</span>
                                        </div>
                                        <div className="admin-stat-card">
                                            <span className="admin-stat-label">Documents</span>
                                            <strong className="admin-stat-value">{docsAvailable}</strong>
                                            <span className="admin-stat-meta">Registration proofs + report cards</span>
                                        </div>
                                        <div className="admin-stat-card">
                                            <span className="admin-stat-label">Failed Emails</span>
                                            <strong className="admin-stat-value">{failedEmails.length}</strong>
                                            <span className="admin-stat-meta">Needs follow-up</span>
                                        </div>
                                        <div className="admin-stat-card">
                                            <span className="admin-stat-label">Portal Accounts</span>
                                            <strong className="admin-stat-value">
                                                {profiles.filter((item) => item.role === 'student').length}
                                            </strong>
                                            <span className="admin-stat-meta">Student logins created</span>
                                        </div>
                                    </div>
                                </section>

                                <section className="portal-section">
                                    <h2 className="portal-section-title">Latest Registrations</h2>
                                    {registrationRows.length === 0 ? (
                                        <div className="portal-empty">
                                            <div className="portal-empty-icon">🧾</div>
                                            <h2>No registrations yet</h2>
                                            <p>The dashboard is wired, but there are no student registrations in Supabase to review yet.</p>
                                        </div>
                                    ) : (
                                        <div className="enrollments-table-wrapper">
                                            <table className="portal-table">
                                                <thead>
                                                    <tr>
                                                        <th>Student</th>
                                                        <th>Parent</th>
                                                        <th>Courses</th>
                                                        <th>Status</th>
                                                        <th>Account</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {registrationRows.slice(0, 10).map((student) => (
                                                        <tr key={student.id}>
                                                            <td>
                                                                <strong>{getStudentFullName(student)}</strong>
                                                                <div className="table-subtitle">
                                                                    {student.email || 'No student email'}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {student.parent?.full_name || 'Unknown parent'}
                                                                <div className="table-subtitle">
                                                                    {student.parent?.email || student.latestOrder?.parent_details?.email || 'No parent email'}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {student.studentEnrollments.length > 0
                                                                    ? student.studentEnrollments.map((enrollment) => enrollment.courses?.course_code || enrollment.courses?.title).join(', ')
                                                                    : 'Enrollment pending'}
                                                            </td>
                                                            <td>
                                                                <span className={`status-badge ${student.needsApproval ? 'pending' : 'active'}`}>
                                                                    {student.needsApproval ? 'Review needed' : 'Ready'}
                                                                </span>
                                                                <div className="table-subtitle">
                                                                    Registered {formatPortalDate(student.created_at)}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className={`status-badge ${student.portalAccount ? 'active' : 'pending'}`}>
                                                                    {student.portalAccount ? student.portalAccount.role : 'Not created'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>

                                <section className="portal-section">
                                    <h2 className="portal-section-title">Operational Shortcuts</h2>
                                    <div className="quick-actions-grid admin-actions-grid">
                                        <Link to="/portal/parent" className="quick-action-card">
                                            <span className="quick-action-icon">👨‍👩‍👧</span>
                                            <span className="quick-action-label">Parent Portal</span>
                                        </Link>
                                        <Link to="/portal/student" className="quick-action-card">
                                            <span className="quick-action-icon">🎓</span>
                                            <span className="quick-action-label">Student Portal</span>
                                        </Link>
                                        <Link to="/cart" className="quick-action-card">
                                            <span className="quick-action-icon">🛒</span>
                                            <span className="quick-action-label">Storefront Checkout</span>
                                        </Link>
                                        <Link to="/contact" className="quick-action-card">
                                            <span className="quick-action-icon">✉️</span>
                                            <span className="quick-action-label">Support</span>
                                        </Link>
                                    </div>
                                </section>
                            </>
                        )}

                        {activeTab === 'registrations' && (
                            <section className="portal-section">
                                <h2 className="portal-section-title">Student Registrations</h2>
                                {registrationRows.length === 0 ? (
                                    <div className="portal-empty">
                                        <div className="portal-empty-icon">🎓</div>
                                        <h2>No student registrations found</h2>
                                        <p>Create a checkout order first, then this table will show the registration, the linked courses, and the admin actions.</p>
                                    </div>
                                ) : (
                                    <div className="admin-registration-list">
                                        {registrationRows.map((student) => (
                                            <article key={student.id} className="admin-registration-card">
                                                <div className="admin-registration-main">
                                                    <div className="admin-registration-header">
                                                        <div>
                                                            <h3>{getStudentFullName(student)}</h3>
                                                            <p>
                                                                {student.current_grade ? `Grade ${student.current_grade}` : 'Grade not set'}
                                                                {student.previous_school ? ` • ${student.previous_school}` : ''}
                                                            </p>
                                                        </div>
                                                        <span className={`status-badge ${student.needsApproval ? 'pending' : 'active'}`}>
                                                            {student.needsApproval ? 'Needs review' : 'Approved'}
                                                        </span>
                                                    </div>

                                                    <div className="admin-registration-meta">
                                                        <div>
                                                            <strong>Parent</strong>
                                                            <span>{student.parent?.full_name || 'Unknown parent'}</span>
                                                        </div>
                                                        <div>
                                                            <strong>Student Email</strong>
                                                            <span>{student.email || 'Missing email'}</span>
                                                        </div>
                                                        <div>
                                                            <strong>Latest Order</strong>
                                                            <span>{student.latestOrder?.order_number || 'No order linked'}</span>
                                                        </div>
                                                        <div>
                                                            <strong>Registered</strong>
                                                            <span>{formatPortalDate(student.created_at)}</span>
                                                        </div>
                                                        <div>
                                                            <strong>Documents</strong>
                                                            <span>{student.uploadedDocumentCount} uploaded</span>
                                                        </div>
                                                    </div>

                                                    <div className="admin-registration-flags">
                                                        <span className={`status-badge ${student.is_active ? 'active' : 'pending'}`}>
                                                            {student.is_active ? 'Student active' : 'Inactive'}
                                                        </span>
                                                        <span className={`status-badge ${student.registration_email_sent ? 'active' : 'pending'}`}>
                                                            {student.registration_email_sent ? 'Email sent' : 'Email pending'}
                                                        </span>
                                                        <span className={`status-badge ${student.moodle_credentials_generated ? 'active' : 'pending'}`}>
                                                            {student.moodle_credentials_generated ? 'Credentials ready' : 'Credentials pending'}
                                                        </span>
                                                        <span className={`status-badge ${student.portalAccount ? 'active' : 'pending'}`}>
                                                            {student.portalAccount ? 'Portal account ready' : 'Portal account missing'}
                                                        </span>
                                                    </div>

                                                    <div className="admin-course-list">
                                                        {student.studentEnrollments.length > 0 ? (
                                                            student.studentEnrollments.map((enrollment) => (
                                                                <div key={enrollment.id} className="admin-course-item">
                                                                    <div>
                                                                        <strong>{enrollment.courses?.title || enrollment.courses?.course_code || 'Course'}</strong>
                                                                        <div className="table-subtitle">
                                                                            {enrollment.courses?.course_code || 'No code'} • {enrollment.status}
                                                                        </div>
                                                                    </div>
                                                                    <span className={`status-badge ${getStatusClass(enrollment.status)}`}>
                                                                        {enrollment.status}
                                                                    </span>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <p className="child-no-courses">No enrollments are linked to this student yet.</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="admin-registration-actions">
                                                    <button
                                                        className="btn btn-accent btn-sm"
                                                        onClick={() => handleApproveStudent(student)}
                                                        disabled={Boolean(busyActions[`approve:${student.id}`])}
                                                    >
                                                        {busyActions[`approve:${student.id}`] ? 'Approving...' : 'Approve'}
                                                    </button>
                                                    <button
                                                        className="btn btn-secondary btn-sm"
                                                        onClick={() => handleSendRegistrationEmail(student)}
                                                        disabled={Boolean(busyActions[`email:${student.id}`])}
                                                    >
                                                        {busyActions[`email:${student.id}`] ? 'Sending...' : 'Email Student'}
                                                    </button>
                                                    <button
                                                        className="btn btn-outline btn-sm"
                                                        onClick={() => handleCreatePortalAccount(student)}
                                                        disabled={Boolean(student.portalAccount) || Boolean(busyActions[`account:${student.id}`])}
                                                    >
                                                        {student.portalAccount
                                                            ? 'Portal Account Ready'
                                                            : busyActions[`account:${student.id}`]
                                                                ? 'Creating...'
                                                                : 'Create Portal Account'}
                                                    </button>
                                                    {accountPasswords[student.id] && (
                                                        <div className="admin-temp-password">
                                                            Temporary password: <code>{accountPasswords[student.id]}</code>
                                                        </div>
                                                    )}
                                                </div>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {activeTab === 'documents' && (
                            <section className="portal-section">
                                <h2 className="portal-section-title">Documents</h2>
                                {studentDocuments.length === 0 && reportCards.length === 0 ? (
                                    <div className="portal-empty">
                                        <div className="portal-empty-icon">📄</div>
                                        <h2>No documents stored yet</h2>
                                        <p>Uploaded registration proofs and report card metadata will appear here once files are saved.</p>
                                    </div>
                                ) : (
                                    <>
                                        {studentDocuments.length > 0 && (
                                            <section className="portal-section">
                                                <h3 className="portal-section-title">Registration Proof Documents</h3>
                                                <div className="admin-doc-grid">
                                                    {studentDocuments.map((doc) => (
                                                        <article key={doc.id} className="admin-doc-card">
                                                            <div className="admin-doc-header">
                                                                <h3>{doc.file_name}</h3>
                                                                <span className={`status-badge ${getStatusClass(doc.status)}`}>
                                                                    {doc.status}
                                                                </span>
                                                            </div>
                                                            <p>
                                                                {(doc.students?.first_name || doc.students?.last_name)
                                                                    ? `${doc.students?.first_name || ''} ${doc.students?.last_name || ''}`.trim()
                                                                    : `${doc.student_first_name || ''} ${doc.student_last_name || ''}`.trim() || 'Student record'}
                                                            </p>
                                                            <div className="admin-doc-meta">
                                                                <span>{getDocumentTypeLabel(doc.document_type)}</span>
                                                                <span>{formatPortalDate(doc.created_at)}</span>
                                                            </div>
                                                            <code className="admin-doc-path">{doc.file_path}</code>
                                                        </article>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {reportCards.length > 0 && (
                                            <section className="portal-section">
                                                <h3 className="portal-section-title">Report Cards</h3>
                                                <div className="admin-doc-grid">
                                                    {reportCards.map((doc) => (
                                                        <article key={doc.id} className="admin-doc-card">
                                                            <div className="admin-doc-header">
                                                                <h3>{doc.file_name}</h3>
                                                                <span className={`status-badge ${doc.is_published ? 'completed' : 'pending'}`}>
                                                                    {doc.is_published ? 'Published' : 'Draft'}
                                                                </span>
                                                            </div>
                                                            <p>
                                                                {(doc.students?.first_name || doc.students?.last_name)
                                                                    ? `${doc.students?.first_name || ''} ${doc.students?.last_name || ''}`.trim()
                                                                    : 'Student record'}
                                                            </p>
                                                            <div className="admin-doc-meta">
                                                                <span>{doc.term}{doc.academic_year ? ` • ${doc.academic_year}` : ''}</span>
                                                                <span>{String(doc.file_type || 'file').toUpperCase()}</span>
                                                                <span>{formatPortalDate(doc.uploaded_at)}</span>
                                                            </div>
                                                            <code className="admin-doc-path">{doc.file_path}</code>
                                                        </article>
                                                    ))}
                                                </div>
                                            </section>
                                        )}
                                    </>
                                )}
                            </section>
                        )}

                        {activeTab === 'accounts' && (
                            <>
                                <section className="portal-section">
                                    <h2 className="portal-section-title">Create Account</h2>
                                    <form className="admin-account-form" onSubmit={handleCreateAccount}>
                                        <label>
                                            <span>Full Name</span>
                                            <input
                                                type="text"
                                                value={createForm.fullName}
                                                onChange={(event) => setCreateForm((prev) => ({ ...prev, fullName: event.target.value }))}
                                                required
                                            />
                                        </label>
                                        <label>
                                            <span>Email</span>
                                            <input
                                                type="email"
                                                value={createForm.email}
                                                onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                                                required
                                            />
                                        </label>
                                        <label>
                                            <span>Role</span>
                                            <select
                                                value={createForm.role}
                                                onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value }))}
                                            >
                                                <option value="student">Student</option>
                                                <option value="parent">Parent</option>
                                                <option value="agent">Agent</option>
                                                <option value="teacher">Teacher</option>
                                                <option value="school_admin">School Admin</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </label>
                                        <label>
                                            <span>Phone</span>
                                            <input
                                                type="text"
                                                value={createForm.phone}
                                                onChange={(event) => setCreateForm((prev) => ({ ...prev, phone: event.target.value }))}
                                            />
                                        </label>
                                        <label className="admin-account-form__wide">
                                            <span>Password</span>
                                            <input
                                                type="text"
                                                value={createForm.password}
                                                onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                                                placeholder="Leave blank to auto-generate"
                                            />
                                        </label>
                                        <div className="admin-account-form__wide admin-account-form__actions">
                                            <button
                                                type="submit"
                                                className="btn btn-accent"
                                                disabled={Boolean(busyActions['account:create'])}
                                            >
                                                {busyActions['account:create'] ? 'Creating...' : 'Create Account'}
                                            </button>
                                        </div>
                                    </form>
                                </section>

                                <section className="portal-section">
                                    <h2 className="portal-section-title">Recent Email Activity</h2>
                                    {emailLog.length === 0 ? (
                                        <div className="portal-empty">
                                            <div className="portal-empty-icon">✉️</div>
                                            <h2>No email log entries yet</h2>
                                            <p>Once transactional emails are sent, their delivery status will appear here.</p>
                                        </div>
                                    ) : (
                                        <div className="enrollments-table-wrapper">
                                            <table className="portal-table">
                                                <thead>
                                                    <tr>
                                                        <th>Recipient</th>
                                                        <th>Template</th>
                                                        <th>Status</th>
                                                        <th>Sent</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {emailLog.slice(0, 15).map((entry) => (
                                                        <tr key={entry.id}>
                                                            <td>
                                                                {entry.recipient}
                                                                {entry.subject && (
                                                                    <div className="table-subtitle">{entry.subject}</div>
                                                                )}
                                                            </td>
                                                            <td>{entry.template}</td>
                                                            <td>
                                                                <span className={`status-badge ${getStatusClass(entry.status)}`}>
                                                                    {entry.status}
                                                                </span>
                                                                {entry.error_message && (
                                                                    <div className="table-subtitle">{entry.error_message}</div>
                                                                )}
                                                            </td>
                                                            <td>{formatPortalDate(entry.sent_at)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>

                                <section className="portal-section">
                                    <h2 className="portal-section-title">Recent Audit History</h2>
                                    {auditLog.length === 0 ? (
                                        <div className="portal-empty">
                                            <div className="portal-empty-icon">🧭</div>
                                            <h2>No audit entries yet</h2>
                                            <p>Admin actions such as account creation and approvals will appear here once they are performed.</p>
                                        </div>
                                    ) : (
                                        <div className="enrollments-table-wrapper">
                                            <table className="portal-table">
                                                <thead>
                                                    <tr>
                                                        <th>Action</th>
                                                        <th>Actor</th>
                                                        <th>Target</th>
                                                        <th>Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {auditLog.slice(0, 15).map((entry) => (
                                                        <tr key={entry.id}>
                                                            <td>{entry.action}</td>
                                                            <td>
                                                                {entry.actor?.full_name || entry.actor?.email || 'System'}
                                                            </td>
                                                            <td>
                                                                {entry.target_type || 'record'}
                                                                <div className="table-subtitle">{entry.target_id || '—'}</div>
                                                            </td>
                                                            <td>{formatPortalDate(entry.created_at)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </section>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard
