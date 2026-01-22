import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from './LanguageToggle'
import './Header.css'

function Header() {
    const { t, i18n } = useTranslation()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [programsOpen, setProgramsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const location = useLocation()

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProgramsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close menus when route changes
    useEffect(() => {
        setProgramsOpen(false)
        setMobileMenuOpen(false)
    }, [location.pathname])

    const navLinks = [
        { path: '/about', label: t('nav.about') },
        { path: '/admissions/international', label: t('nav.international') },
        { path: '/ossd-requirements', label: t('nav.ossd') },
        { path: '/faq', label: t('nav.faq') },
        { path: '/contact', label: t('nav.contact') }
    ]

    return (
        <header className="header">
            <div className="header-container container">
                <Link to="/" className="logo">
                    <img src="/images/logo-shield.png" alt="EMCS Logo" className="logo-img" />
                    <span className="logo-text">EMCS</span>
                </Link>

                <nav className={`nav-main ${mobileMenuOpen ? 'active' : ''}`}>
                    {/* Programs Dropdown */}
                    <div className="nav-dropdown-wrapper" ref={dropdownRef}>
                        <button
                            className="nav-link nav-dropdown-trigger"
                            onClick={() => setProgramsOpen(!programsOpen)}
                            aria-expanded={programsOpen}
                        >
                            {t('nav.courses')}
                            <svg className={`dropdown-arrow ${programsOpen ? 'open' : ''}`} width="10" height="10" viewBox="0 0 10 10">
                                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                        </button>
                        {programsOpen && (
                            <div className="nav-dropdown">
                                <div className="dropdown-section">
                                    <Link
                                        to="/programs/elementary"
                                        className="dropdown-item storefront-item elementary"
                                        onClick={() => { setProgramsOpen(false); setMobileMenuOpen(false); }}
                                    >
                                        <span className="storefront-dot" style={{ background: '#27AE60' }}></span>
                                        <div>
                                            <span className="dropdown-item-title">{i18n.language === 'vi' ? 'Tiểu Học' : 'Elementary'}</span>
                                            <span className="dropdown-item-desc">{i18n.language === 'vi' ? 'Lớp 1-5 • Tự học & Có giáo viên' : 'Grades 1-5 • Self-Learning & Teacher-Led'}</span>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/credit"
                                        className="dropdown-item storefront-item credit"
                                        onClick={() => { setProgramsOpen(false); setMobileMenuOpen(false); }}
                                    >
                                        <span className="storefront-dot" style={{ background: '#D4AF37' }}></span>
                                        <div>
                                            <span className="dropdown-item-title">{i18n.language === 'vi' ? 'Có Tín Chỉ' : 'Credit Courses'}</span>
                                            <span className="dropdown-item-desc">{i18n.language === 'vi' ? 'Lớp 9-12 • Lớp học trực tiếp với giáo viên' : 'Grades 9-12 • Live classes with teacher'}</span>
                                        </div>
                                    </Link>
                                    <Link
                                        to="/non-credit"
                                        className="dropdown-item storefront-item non-credit"
                                        onClick={() => { setProgramsOpen(false); setMobileMenuOpen(false); }}
                                    >
                                        <span className="storefront-dot" style={{ background: '#2F80ED' }}></span>
                                        <div>
                                            <span className="dropdown-item-title">{i18n.language === 'vi' ? 'Thực Hành' : 'Practice Courses'}</span>
                                            <span className="dropdown-item-desc">{i18n.language === 'vi' ? 'Tất cả các lớp • Tự học theo tốc độ riêng' : 'All grades • Self-paced learning'}</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {navLinks.map(link => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="header-actions">
                    <LanguageToggle />
                    <Link to="/login" className="btn-login">{t('nav.login')}</Link>
                    <Link to="/register" className="btn btn-accent btn-sm">{t('nav.register')}</Link>
                </div>

                <button
                    className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {mobileMenuOpen && (
                <div className="mobile-menu">
                    {/* Storefront Links */}
                    <div className="mobile-storefronts">
                        <Link
                            to="/programs/elementary"
                            className="mobile-storefront-link"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ borderColor: '#27AE60' }}
                        >
                            <span className="storefront-icon">🏫</span>
                            <div>
                                <span className="storefront-name">{i18n.language === 'vi' ? 'Tiểu Học' : 'Elementary'}</span>
                                <span className="storefront-tagline">{i18n.language === 'vi' ? 'Lớp 1-5' : 'Grades 1-5'}</span>
                            </div>
                        </Link>
                        <Link
                            to="/credit"
                            className="mobile-storefront-link"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ borderColor: '#D4AF37' }}
                        >
                            <span className="storefront-icon">🎓</span>
                            <div>
                                <span className="storefront-name">{i18n.language === 'vi' ? 'Có Tín Chỉ' : 'Credit'}</span>
                                <span className="storefront-tagline">{i18n.language === 'vi' ? 'Lớp 9-12 Trực tiếp' : 'Grades 9-12 Live'}</span>
                            </div>
                        </Link>
                        <Link
                            to="/non-credit"
                            className="mobile-storefront-link"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ borderColor: '#2F80ED' }}
                        >
                            <span className="storefront-icon">🎬</span>
                            <div>
                                <span className="storefront-name">{i18n.language === 'vi' ? 'Thực Hành' : 'Practice'}</span>
                                <span className="storefront-tagline">{i18n.language === 'vi' ? 'Tất cả các lớp' : 'All Grades'}</span>
                            </div>
                        </Link>
                    </div>

                    <nav className="mobile-nav">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                className="mobile-nav-link"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    <div className="mobile-actions">
                        <LanguageToggle />
                        <Link to="/register" className="btn btn-accent" onClick={() => setMobileMenuOpen(false)}>
                            {t('nav.register')}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
