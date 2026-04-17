import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useStorefront } from '../context/StorefrontContext'
import LanguageToggle from './LanguageToggle'
import Logo from './Logo'
import './StorefrontHeader.css'

function StorefrontHeader() {
    const { t } = useTranslation()
    const location = useLocation()
    const { getItemCount } = useCart()
    const { currentStorefront, navigationConfig } = useStorefront()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeDropdown, setActiveDropdown] = useState(null)
    const dropdownRef = useRef(null)

    const { storefronts, secondaryLinks, utilityNav } = navigationConfig

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false)
        setActiveDropdown(null)
    }, [location.pathname])

    const itemCount = getItemCount()

    const renderStorefrontDropdown = (storefront, config) => {
        const isActive = activeDropdown === storefront
        const gradeGroups = config.gradeGroups

        return (
            <div className="storefront-nav-item" key={storefront}>
                <button
                    className={`storefront-btn ${currentStorefront === config.id ? 'active' : ''}`}
                    style={{
                        '--storefront-color': config.color.primary,
                        '--storefront-light': config.color.light,
                    }}
                    onClick={() => setActiveDropdown(isActive ? null : storefront)}
                    aria-expanded={isActive}
                >
                    {config.label}
                    <svg className={`dropdown-arrow ${isActive ? 'open' : ''}`} width="12" height="12" viewBox="0 0 12 12">
                        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                </button>

                {isActive && (
                    <div className="storefront-dropdown" ref={dropdownRef}>
                        <div className="dropdown-header">
                            <span
                                className="storefront-badge"
                                style={{ backgroundColor: config.color.primary, color: config.color.text }}
                            >
                                {config.label}
                            </span>
                            <p className="dropdown-desc">{config.description}</p>
                        </div>

                        {gradeGroups ? (
                            <div className="grade-groups">
                                {Object.entries(gradeGroups).map(([key, group]) => (
                                    <div className="grade-group" key={key}>
                                        <h4 className="group-label">{group.label}</h4>
                                        <div className="grade-links">
                                            {group.grades.map(grade => (
                                                <Link
                                                    key={grade}
                                                    to={`/${config.id}/grade/${grade}`}
                                                    className="grade-link"
                                                    onClick={() => setActiveDropdown(null)}
                                                >
                                                    {grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grade-links-flat">
                                {config.grades.map(grade => (
                                    <Link
                                        key={grade}
                                        to={`/${config.id}/grade/${grade}`}
                                        className="grade-link"
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        Grade {grade}
                                    </Link>
                                ))}
                            </div>
                        )}

                        <Link
                            to={`/${config.id}`}
                            className="view-all-link"
                            style={{ color: config.color.primary }}
                            onClick={() => setActiveDropdown(null)}
                        >
                            View All {config.label} Programs →
                        </Link>
                    </div>
                )}
            </div>
        )
    }

    const renderSecondaryLink = (link, index) => {
        if (link.dropdown) {
            const isActive = activeDropdown === `secondary-${index}`
            return (
                <div className="nav-item-dropdown" key={link.label}>
                    <button
                        className="nav-link-btn"
                        onClick={() => setActiveDropdown(isActive ? null : `secondary-${index}`)}
                        aria-expanded={isActive}
                    >
                        {link.label}
                        <svg className={`dropdown-arrow ${isActive ? 'open' : ''}`} width="12" height="12" viewBox="0 0 12 12">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        </svg>
                    </button>
                    {isActive && (
                        <div className="secondary-dropdown">
                            {link.dropdown.map(item => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className="dropdown-link"
                                    onClick={() => setActiveDropdown(null)}
                                >
                                    <span className="dropdown-link-label">{item.label}</span>
                                    {item.description && (
                                        <span className="dropdown-link-desc">{item.description}</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )
        }

        return (
            <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
                {link.label}
            </NavLink>
        )
    }

    return (
        <header className="storefront-header">
            <div className="header-container container">
                {/* Logo */}
                <Link to="/" className="logo" aria-label="EMCS home">
                    <Logo variant="full" />
                </Link>

                {/* Main Navigation */}
                <nav className="main-nav">
                    {/* Storefront Dropdowns */}
                    <div className="storefront-nav">
                        {renderStorefrontDropdown('nonCredit', storefronts.nonCredit)}
                        {renderStorefrontDropdown('credit', storefronts.credit)}
                    </div>

                    {/* Secondary Links */}
                    <div className="secondary-nav">
                        {secondaryLinks.map((link, index) => renderSecondaryLink(link, index))}
                    </div>
                </nav>

                {/* Utility Nav */}
                <div className="utility-nav">
                    <LanguageToggle />

                    <Link to="/cart" className="cart-btn" aria-label={`Cart with ${itemCount} items`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                    </Link>

                    <Link to="/login" className="btn-login">{t('nav.login')}</Link>
                    <Link to="/register" className="btn btn-accent btn-sm">{t('nav.register')}</Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu">
                    {/* Storefront Tabs */}
                    <div className="mobile-storefront-tabs">
                        <Link
                            to="/non-credit"
                            className="mobile-storefront-tab"
                            style={{ borderColor: storefronts.nonCredit.color.primary }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {storefronts.nonCredit.label}
                        </Link>
                        <Link
                            to="/credit"
                            className="mobile-storefront-tab"
                            style={{ borderColor: storefronts.credit.color.primary }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {storefronts.credit.label}
                        </Link>
                    </div>

                    {/* Mobile Nav Links */}
                    <nav className="mobile-nav">
                        {secondaryLinks.map(link => (
                            link.dropdown ? (
                                <div key={link.label} className="mobile-nav-group">
                                    <span className="mobile-nav-group-label">{link.label}</span>
                                    {link.dropdown.map(item => (
                                        <NavLink
                                            key={item.href}
                                            to={item.href}
                                            className="mobile-nav-link mobile-nav-link-sub"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.label}
                                        </NavLink>
                                    ))}
                                </div>
                            ) : (
                                <NavLink
                                    key={link.href}
                                    to={link.href}
                                    className="mobile-nav-link"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </NavLink>
                            )
                        ))}
                    </nav>

                    {/* Mobile Actions */}
                    <div className="mobile-actions">
                        <LanguageToggle />
                        <Link
                            to="/cart"
                            className="mobile-cart-link"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Cart {itemCount > 0 && `(${itemCount})`}
                        </Link>
                        <Link
                            to="/register"
                            className="btn btn-accent"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {t('nav.register')}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

export default StorefrontHeader
