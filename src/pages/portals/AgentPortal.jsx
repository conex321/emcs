import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, AGENT_CONFIG } from '../../config/pricing'
import {
    formatPortalDate,
    isCreditStorefront,
    normalizeOrder,
} from '../../services/portalData'
import supabase from '../../services/supabaseClient'
import './PortalPages.css'

function AgentPortal() {
    const { t } = useTranslation()
    const { user, profile } = useAuth()

    const [agentProfile, setAgentProfile] = useState(null)
    const [stats, setStats] = useState({ totalReferrals: 0, totalCommissions: 0, activeStudents: 0 })
    const [referrals, setReferrals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [activeTab, setActiveTab] = useState('overview')
    const [copySuccess, setCopySuccess] = useState(false)

    const fallbackAgentCode = `AGENT-${user?.id?.substring(0, 6)?.toUpperCase() || '000000'}`
    const agentCode = agentProfile?.agent_code || profile?.agent_code || fallbackAgentCode
    const referralLink = `${window.location.origin}/register?agent=${agentCode}`
    const creditCommissionRate = Number(agentProfile?.commission_rate_credit ?? AGENT_CONFIG.creditCommission)
    const nonCreditCommissionRate = Number(agentProfile?.commission_rate_noncredit ?? AGENT_CONFIG.nonCreditCommission)

    useEffect(() => {
        async function fetchAgentData() {
            if (!user) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const { data: agentData, error: agentErr } = await supabase
                    .from('agents')
                    .select(`
                        id,
                        agent_code,
                        company_name,
                        contact_name,
                        commission_rate_credit,
                        commission_rate_noncredit,
                        total_referrals,
                        total_commission_earned,
                        is_active
                    `)
                    .eq('profile_id', user.id)
                    .maybeSingle()

                if (agentErr) throw agentErr

                setAgentProfile(agentData)

                const resolvedAgentCode = agentData?.agent_code || fallbackAgentCode
                const activeCreditRate = Number(agentData?.commission_rate_credit ?? AGENT_CONFIG.creditCommission)
                const activeNonCreditRate = Number(agentData?.commission_rate_noncredit ?? AGENT_CONFIG.nonCreditCommission)
                const estimateCommission = (order) => {
                    const orderItems = Array.isArray(order.order_items) ? order.order_items : []

                    return orderItems.reduce((sum, item) => {
                        if (item.is_bundled) {
                            return sum
                        }

                        return sum + (
                            isCreditStorefront(item.courses?.storefront)
                                ? activeCreditRate
                                : activeNonCreditRate
                        )
                    }, 0)
                }

                const { data: orderData, error: orderErr } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        order_number,
                        total,
                        status,
                        created_at,
                        payment_method,
                        order_items (
                            id,
                            is_bundled,
                            course_code,
                            courses (
                                storefront
                            )
                        )
                    `)
                    .eq('agent_code', resolvedAgentCode)
                    .order('created_at', { ascending: false })

                if (!orderErr) {
                    const normalizedOrders = (orderData || [])
                        .map(normalizeOrder)
                        .map(order => ({
                            ...order,
                            estimated_commission: estimateCommission(order),
                        }))

                    setReferrals(normalizedOrders)
                    setStats({
                        totalReferrals: normalizedOrders.length,
                        totalCommissions: normalizedOrders.reduce((sum, order) => sum + order.estimated_commission, 0),
                        activeStudents: normalizedOrders.filter(
                            order => order.status === 'completed' || order.status === 'paid' || order.status === 'processing'
                        ).length,
                    })

                    return
                }

                if (!agentData?.id) {
                    setReferrals([])
                    setStats({ totalReferrals: 0, totalCommissions: 0, activeStudents: 0 })
                    return
                }

                console.warn('Agent orders query failed, falling back to commissions:', orderErr.message)

                const { data: commissionsData, error: commissionsErr } = await supabase
                    .from('commissions')
                    .select('id, order_id, amount, status, created_at, items')
                    .eq('agent_id', agentData.id)
                    .order('created_at', { ascending: false })

                if (commissionsErr) throw commissionsErr

                const normalizedCommissions = (commissionsData || []).map((commission) => ({
                    id: commission.id,
                    order_number: commission.order_id
                        ? commission.order_id.slice(0, 8).toUpperCase()
                        : `COM-${commission.id.slice(0, 6).toUpperCase()}`,
                    total_amount: Number(commission.amount || 0),
                    estimated_commission: Number(commission.amount || 0),
                    status: commission.status,
                    created_at: commission.created_at,
                    payment_method: 'commission',
                    items_count: Array.isArray(commission.items) ? commission.items.length : 0,
                }))

                setReferrals(normalizedCommissions)
                setStats({
                    totalReferrals: normalizedCommissions.length,
                    totalCommissions: normalizedCommissions.reduce((sum, commission) => sum + commission.estimated_commission, 0),
                    activeStudents: normalizedCommissions.filter(
                        commission => commission.status === 'approved' || commission.status === 'paid' || commission.status === 'pending'
                    ).length,
                })
            } catch (err) {
                console.error('Failed to fetch agent data:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAgentData()
    }, [fallbackAgentCode, user])

    const displayName = agentProfile?.contact_name || profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Agent'

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        } catch {
            const textarea = document.createElement('textarea')
            textarea.value = referralLink
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        }
    }

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(agentCode)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        } catch {
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
            case 'paid':
            case 'approved':
                return 'completed'
            case 'pending':
                return 'pending'
            case 'cancelled':
                return 'cancelled'
            default:
                return 'active'
        }
    }

    return (
        <div className="portal-page agent-portal">
            <div className="container">
                <header className="portal-header">
                    <div className="portal-header-content">
                        <div className="portal-avatar agent-avatar">
                            <span className="portal-avatar-text">
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h1 className="portal-greeting">
                                {t('portal.agent.welcome', 'Partner Dashboard')} 🤝
                            </h1>
                            <p className="portal-subtitle">
                                {displayName} • {t('portal.agent.code', 'Agent Code')}: <strong>{agentCode}</strong>
                            </p>
                        </div>
                    </div>
                    <div className="portal-header-stats">
                        <div className="stat-chip agent-stat">
                            <span className="stat-chip-number">{stats.totalReferrals}</span>
                            <span className="stat-chip-label">{t('portal.agent.referrals', 'Referrals')}</span>
                        </div>
                        <div className="stat-chip agent-stat">
                            <span className="stat-chip-number">{stats.activeStudents}</span>
                            <span className="stat-chip-label">{t('portal.agent.enrolled', 'Enrolled')}</span>
                        </div>
                        <div className="stat-chip agent-stat highlight">
                            <span className="stat-chip-number">{formatCurrency(stats.totalCommissions)}</span>
                            <span className="stat-chip-label">{t('portal.agent.earned', 'Earned')}</span>
                        </div>
                    </div>
                </header>

                <div className="referral-card">
                    <div className="referral-card-content">
                        <h3>{t('portal.agent.shareLinkTitle', 'Your Referral Link')}</h3>
                        <p>{t('portal.agent.shareLinkDesc', 'Share this link with prospective students. Any enrollments through this link will be attributed to your account.')}</p>
                        {!agentProfile && (
                            <p className="referral-status-note">
                                Your agent profile is not linked in Supabase yet. The portal is ready, but this code stays provisional until an `agents` record is attached to this login.
                            </p>
                        )}
                        <div className="referral-link-row">
                            <code className="referral-link">{referralLink}</code>
                            <button className="btn btn-accent btn-sm" onClick={handleCopyLink}>
                                {copySuccess ? '✓ Copied!' : '📋 Copy Link'}
                            </button>
                        </div>
                        <div className="referral-code-row">
                            <span>{t('portal.agent.orShareCode', 'Or share your code')}:</span>
                            <code className="agent-code-display" onClick={handleCopyCode}>
                                {agentCode}
                            </code>
                        </div>
                    </div>
                    <div className="referral-card-sidebar">
                        <div className="commission-info">
                            <h4>{t('portal.agent.commissionRates', 'Commission Rates')}</h4>
                            <div className="commission-rate">
                                <span>{t('portal.agent.creditRate', 'Credit Course')}</span>
                                <strong>{formatCurrency(creditCommissionRate)} / {t('portal.agent.perStudent', 'student')}</strong>
                            </div>
                            <div className="commission-rate">
                                <span>{t('portal.agent.nonCreditRate', 'Academic Prep')}</span>
                                <strong>{formatCurrency(nonCreditCommissionRate)} / {t('portal.agent.perStudent', 'student')}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="portal-tabs">
                    <button
                        className={`portal-tab ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📊 {t('portal.agent.overview', 'Overview')}
                    </button>
                    <button
                        className={`portal-tab ${activeTab === 'referrals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('referrals')}
                    >
                        👥 {t('portal.agent.myReferrals', 'Referrals')}
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
                        {activeTab === 'overview' && (
                            <>
                                {referrals.length === 0 ? (
                                    <div className="portal-empty">
                                        <div className="portal-empty-icon">🚀</div>
                                        <h2>{t('portal.agent.emptyTitle', 'Start Referring')}</h2>
                                        <p>
                                            {t('portal.agent.emptyDesc', "Share your referral link above with prospective students and parents. You'll earn a commission for every enrollment that comes through your link.")}
                                        </p>
                                        <div className="getting-started-steps">
                                            <div className="gs-step">
                                                <span className="gs-step-num">1</span>
                                                <div>
                                                    <strong>{t('portal.agent.step1Title', 'Share Your Link')}</strong>
                                                    <p>{t('portal.agent.step1Desc', 'Send your referral link or agent code to families interested in Canadian education.')}</p>
                                                </div>
                                            </div>
                                            <div className="gs-step">
                                                <span className="gs-step-num">2</span>
                                                <div>
                                                    <strong>{t('portal.agent.step2Title', 'Student Enrolls')}</strong>
                                                    <p>{t('portal.agent.step2Desc', 'When they register and purchase courses using your code, the referral is tracked automatically.')}</p>
                                                </div>
                                            </div>
                                            <div className="gs-step">
                                                <span className="gs-step-num">3</span>
                                                <div>
                                                    <strong>{t('portal.agent.step3Title', 'Earn Commission')}</strong>
                                                    <p>{t('portal.agent.step3Desc', `Earn ${formatCurrency(creditCommissionRate)} per credit student and ${formatCurrency(nonCreditCommissionRate)} per academic prep student.`)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="agent-stats-grid">
                                        <div className="agent-stat-card">
                                            <div className="agent-stat-icon">👥</div>
                                            <div className="agent-stat-value">{stats.totalReferrals}</div>
                                            <div className="agent-stat-label">{t('portal.agent.totalReferrals', 'Total Referrals')}</div>
                                        </div>
                                        <div className="agent-stat-card">
                                            <div className="agent-stat-icon">✅</div>
                                            <div className="agent-stat-value">{stats.activeStudents}</div>
                                            <div className="agent-stat-label">{t('portal.agent.enrolledStudents', 'Enrolled Students')}</div>
                                        </div>
                                        <div className="agent-stat-card highlight">
                                            <div className="agent-stat-icon">💰</div>
                                            <div className="agent-stat-value">{formatCurrency(stats.totalCommissions)}</div>
                                            <div className="agent-stat-label">{t('portal.agent.totalEarned', 'Total Earned')}</div>
                                        </div>
                                        <div className="agent-stat-card">
                                            <div className="agent-stat-icon">📅</div>
                                            <div className="agent-stat-value">{AGENT_CONFIG.payoutSchedule}</div>
                                            <div className="agent-stat-label">{t('portal.agent.payoutSchedule', 'Payout Schedule')}</div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'referrals' && (
                            <section className="portal-section">
                                {referrals.length === 0 ? (
                                    <div className="portal-empty">
                                        <div className="portal-empty-icon">👥</div>
                                        <h2>{t('portal.agent.noReferrals', 'No Referrals Yet')}</h2>
                                        <p>{t('portal.agent.noReferralsDesc', 'Referrals will appear here once students enroll using your agent code.')}</p>
                                    </div>
                                ) : (
                                    <div className="enrollments-table-wrapper">
                                        <table className="portal-table">
                                            <thead>
                                                <tr>
                                                    <th>{t('portal.agent.orderNum', 'Order #')}</th>
                                                    <th>{t('portal.agent.date', 'Date')}</th>
                                                    <th>{t('portal.agent.amount', 'Amount')}</th>
                                                    <th>{t('portal.agent.estCommission', 'Est. Commission')}</th>
                                                    <th>{t('portal.agent.status', 'Status')}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {referrals.map(order => (
                                                    <tr key={order.id}>
                                                        <td><strong>#{order.order_number}</strong></td>
                                                        <td>{formatPortalDate(order.created_at)}</td>
                                                        <td>{formatCurrency(order.total_amount)}</td>
                                                        <td className="commission-cell">
                                                            {formatCurrency(order.estimated_commission || 0)}
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
                                )}
                            </section>
                        )}

                        <section className="portal-section">
                            <h2 className="portal-section-title">
                                ⚡ {t('portal.agent.quickActions', 'Quick Actions')}
                            </h2>
                            <div className="quick-actions-grid">
                                <button className="quick-action-card" onClick={handleCopyLink}>
                                    <span className="quick-action-icon">🔗</span>
                                    <span className="quick-action-label">{t('portal.agent.copyLink', 'Copy Referral Link')}</span>
                                </button>
                                <a href="mailto:partners@emcs.ca" className="quick-action-card">
                                    <span className="quick-action-icon">📧</span>
                                    <span className="quick-action-label">{t('portal.agent.contactPartner', 'Contact Partner Support')}</span>
                                </a>
                                <Link to="/compare" className="quick-action-card">
                                    <span className="quick-action-icon">📊</span>
                                    <span className="quick-action-label">{t('portal.agent.viewPrograms', 'View Programs')}</span>
                                </Link>
                                <Link to="/tuition" className="quick-action-card">
                                    <span className="quick-action-icon">💰</span>
                                    <span className="quick-action-label">{t('portal.agent.viewPricing', 'View Pricing')}</span>
                                </Link>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    )
}

export default AgentPortal
