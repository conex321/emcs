import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './LoginPortalDropdown.css'

function LoginPortalDropdown({ isOpen, onClose }) {
    const { t } = useTranslation()

    if (!isOpen) return null

    const portals = [
        {
            label: t('nav.studentPortal', 'Student Portal'),
            desc: 'Access your LMS and courses',
            href: '/portal/student',
            icon: '🎓'
        },
        {
            label: t('nav.parentPortal', 'Parent Portal'),
            desc: 'Enrollment and student progress',
            href: '/portal/parent',
            icon: '👨‍👩‍👧'
        },
        {
            label: t('nav.agentPortal', 'Agent / School Portal'),
            desc: 'Partner enrollment forms',
            href: '/portal/agent',
            icon: '🏢'
        }
    ]

    return (
        <div className="login-portal-dropdown">
            {portals.map(p => (
                <Link key={p.href} to={p.href} className="portal-link" onClick={onClose}>
                    <span className="portal-icon">{p.icon}</span>
                    <div className="portal-info">
                        <span className="portal-name">{p.label}</span>
                        <span className="portal-desc">{p.desc}</span>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default LoginPortalDropdown
