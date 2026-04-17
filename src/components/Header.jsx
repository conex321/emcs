import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import LanguageToggle from './LanguageToggle'
import ProgramDropdown from './ProgramDropdown'
import CoursesDropdown from './CoursesDropdown'
import LoginPortalDropdown from './LoginPortalDropdown'
import Logo from './Logo'
import './Header.css'

function Header() {
    const { t } = useTranslation()
    const { items } = useCart()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null) // 'programs' | 'courses' | 'login' | null
    const programsRef = useRef(null)
    const coursesRef = useRef(null)
    const loginRef = useRef(null)
    const location = useLocation()

    // Calculate cart item count
    const cartItemCount = items.filter(item => !item.isBundled).length

    // Close dropdown when clicking outside any dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            const refs = [programsRef, coursesRef, loginRef]
            const clickedInsideAny = refs.some(
                ref => ref.current && ref.current.contains(event.target)
            )
            if (!clickedInsideAny) {
                setActiveDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close all menus when route changes
    useEffect(() => {
        setActiveDropdown(null)
        setMobileMenuOpen(false)
    }, [location.pathname])

    function toggleDropdown(name) {
        setActiveDropdown(prev => prev === name ? null : name)
    }

    const navLinks = [
        { path: '/about', label: t('nav.about') },
        { path: '/admissions/international', label: t('nav.international') },
        { path: '/ossd-requirements', label: t('nav.ossd') },
        { path: '/faq', label: t('nav.faq') },
        { path: '/contact', label: t('nav.contact') }
    ]

    const DropdownArrow = ({ isOpen }) => (
        <svg className={`dropdown-arrow ${isOpen ? 'open' : ''}`} width="10" height="10" viewBox="0 0 10 10">
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
    )

    return (
        <header className="header">
            <div className="header-container container">
                <Link to="/" className="logo" aria-label="EMCS home">
                    <Logo variant="full" />
                </Link>

                <nav className={`nav-main ${mobileMenuOpen ? 'active' : ''}`}>
                    {/* Program Dropdown - Two Panel */}
                    <div className="nav-dropdown-wrapper" ref={programsRef}>
                        <button
                            className="nav-link nav-dropdown-trigger"
                            onClick={() => toggleDropdown('programs')}
                            aria-expanded={activeDropdown === 'programs'}
                        >
                            {t('nav.program', 'Program')}
                            <DropdownArrow isOpen={activeDropdown === 'programs'} />
                        </button>
                        <ProgramDropdown
                            isOpen={activeDropdown === 'programs'}
                            onClose={() => setActiveDropdown(null)}
                        />
                    </div>

                    {/* Courses Dropdown */}
                    <div className="nav-dropdown-wrapper" ref={coursesRef}>
                        <button
                            className="nav-link nav-dropdown-trigger"
                            onClick={() => toggleDropdown('courses')}
                            aria-expanded={activeDropdown === 'courses'}
                        >
                            {t('nav.courses', 'Courses')}
                            <DropdownArrow isOpen={activeDropdown === 'courses'} />
                        </button>
                        <CoursesDropdown
                            isOpen={activeDropdown === 'courses'}
                            onClose={() => setActiveDropdown(null)}
                        />
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
                    {/* Login Portal Dropdown */}
                    <div className="nav-dropdown-wrapper" ref={loginRef}>
                        <button
                            className="btn-login nav-dropdown-trigger"
                            onClick={() => toggleDropdown('login')}
                            aria-expanded={activeDropdown === 'login'}
                        >
                            {t('nav.login', 'Login')}
                            <DropdownArrow isOpen={activeDropdown === 'login'} />
                        </button>
                        <LoginPortalDropdown
                            isOpen={activeDropdown === 'login'}
                            onClose={() => setActiveDropdown(null)}
                        />
                    </div>

                    {/* Shopping Cart */}
                    <Link to="/cart" className="cart-link">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"/>
                            <circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        {cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </Link>

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
                    {/* Program Links */}
                    <div className="mobile-storefronts">
                        <Link
                            to="/academic-prep"
                            className="mobile-storefront-link"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ borderColor: '#2F80ED' }}
                        >
                            <span className="storefront-icon">📚</span>
                            <div>
                                <span className="storefront-name">{t('programs.academicPrep.shortName', 'Academic Prep')}</span>
                                <span className="storefront-tagline">{t('nav.gradesRange', 'Grades 1-12')}</span>
                            </div>
                        </Link>
                        <Link
                            to="/official-ontario"
                            className="mobile-storefront-link"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ borderColor: '#D4AF37' }}
                        >
                            <span className="storefront-icon">🎓</span>
                            <div>
                                <span className="storefront-name">{t('programs.officialOntario.shortName', 'Official Ontario')}</span>
                                <span className="storefront-tagline">{t('nav.gradesRange', 'Grades 1-12')}</span>
                            </div>
                        </Link>
                    </div>

                    {/* Browse by Grade */}
                    <div className="mobile-grades-section">
                        <span className="mobile-section-label">{t('nav.browseByGrade', 'Browse by Grade')}</span>
                        <div className="mobile-grade-pills">
                            {['1','2','3','4','5','6','7','8','9','10','11','12'].map(g => (
                                <Link
                                    key={g}
                                    to={`/grade/${g}`}
                                    className="mobile-grade-pill"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {t('nav.gradeAbbrev', 'Gr')} {g}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* V2 program pages */}
                    <div className="mobile-v2-programs">
                        <span className="mobile-section-label">{t('nav.program', 'Program')}</span>
                        <Link to="/programs/elementary" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            {t('nav.primaryFoundation', 'Primary Foundation (Grades 1–5)')}
                        </Link>
                        <Link to="/programs/middle-school" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            {t('nav.middleSchoolFoundation', 'Middle School Foundation')}
                        </Link>
                        <Link to="/programs/high-school" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            {t('nav.highSchoolPathways', 'High School Pathways')}
                        </Link>
                        <Link to="/tuition" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            {t('nav.tuitionPage', 'Tuition & Fees')}
                        </Link>
                        <Link to="/schedule" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            {t('nav.academicCalendar', 'Academic Calendar')}
                        </Link>
                        <Link to="/compare" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                            {t('nav.compareProgramsLink', 'Compare Programs')}
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

                    {/* Portal Links */}
                    <div className="mobile-portals">
                        <span className="mobile-section-label">{t('nav.loginPortals', 'Login Portals')}</span>
                        <Link to="/portal/student" className="mobile-portal-link" onClick={() => setMobileMenuOpen(false)}>
                            🎓 {t('nav.studentPortal', 'Student Portal')}
                        </Link>
                        <Link to="/portal/parent" className="mobile-portal-link" onClick={() => setMobileMenuOpen(false)}>
                            👨‍👩‍👧 {t('nav.parentPortal', 'Parent Portal')}
                        </Link>
                        <Link to="/portal/agent" className="mobile-portal-link" onClick={() => setMobileMenuOpen(false)}>
                            🏢 {t('nav.agentPortal', 'Agent / School Portal')}
                        </Link>
                    </div>

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
