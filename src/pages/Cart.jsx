import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { formatCurrency } from '../config/pricing'
import './Cart.css'

function Cart() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const {
        items,
        subtotal,
        discount,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        removeItem,
        clearCart,
        getItemCount,
    } = useCart()

    const [couponCode, setCouponCode] = useState('')
    const [couponError, setCouponError] = useState('')
    const [couponSuccess, setCouponSuccess] = useState('')

    const handleApplyCoupon = () => {
        setCouponError('')
        setCouponSuccess('')

        if (!couponCode.trim()) {
            setCouponError('Please enter a coupon code')
            return
        }

        const result = applyCoupon(couponCode.trim())
        if (result.success) {
            setCouponSuccess(`Coupon applied: ${result.coupon.description}`)
            setCouponCode('')
        } else {
            setCouponError(result.error)
        }
    }

    const handleRemoveCoupon = () => {
        removeCoupon()
        setCouponSuccess('')
    }

    const handleRemoveItem = (itemId) => {
        removeItem(itemId)
    }

    const mainItems = items.filter(item => !item.isBundled)
    const bundledItems = items.filter(item => item.isBundled)

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h1>{t('storefront.cart.emptyTitle')}</h1>
                        <p>{t('storefront.cart.emptySubtitle')}</p>
                        <div className="empty-cart-actions">
                            <Link to="/non-credit" className="btn btn-primary">
                                {t('storefront.cart.browseNonCredit')}
                            </Link>
                            <Link to="/credit" className="btn btn-secondary">
                                {t('storefront.cart.browseCredit')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1>{t('storefront.cart.title')}</h1>
                <p className="cart-subtitle">
                    {getItemCount()} {getItemCount() === 1 ? t('storefront.cart.course') : t('storefront.cart.courses')} {t('storefront.cart.inYourCart')}
                </p>

                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {mainItems.map(item => (
                            <div key={item.id} className="cart-item card">
                                <div className="item-badge-row">
                                    <span className={`storefront-badge ${item.storefront}`}>
                                        {item.storefront === 'credit' ? t('storefront.credit.labelFull') : t('storefront.nonCredit.label')}
                                    </span>
                                    <span className="item-grade">{t('storefront.grade.grade')} {item.grade}</span>
                                </div>

                                <div className="item-content">
                                    <div className="item-info">
                                        <h3>{item.title}</h3>
                                        <p className="item-code">{item.code}</p>
                                        <div className="item-meta">
                                            {item.storefront === 'credit' ? (
                                                <span>{t('storefront.cart.creditMeta')}</span>
                                            ) : (
                                                <span>{t('storefront.cart.nonCreditMeta')}</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="item-pricing">
                                        {item.listPrice > item.price && (
                                            <span className="item-list-price">
                                                {formatCurrency(item.listPrice)}
                                            </span>
                                        )}
                                        <span className="item-price">
                                            {formatCurrency(item.price)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(item.id)}
                                    aria-label={`${t('storefront.cart.remove')} ${item.title}`}
                                >
                                    {t('storefront.cart.remove')}
                                </button>

                                {/* Bundled Items */}
                                {bundledItems
                                    .filter(bi => bi.bundledWith === item.id)
                                    .map(bundled => (
                                        <div key={bundled.id} className="bundled-item">
                                            <div className="bundle-indicator">
                                                <span className="bundle-icon">🎁</span>
                                                <span className="bundle-label">{t('storefront.cart.bonusIncluded')}</span>
                                            </div>
                                            <div className="bundled-content">
                                                <div className="bundled-info">
                                                    <h4>{bundled.title}</h4>
                                                    <p>{bundled.bundleReason}</p>
                                                </div>
                                                <div className="bundled-pricing">
                                                    <span className="bundled-original">
                                                        {formatCurrency(bundled.originalPrice)}
                                                    </span>
                                                    <span className="bundled-free">{t('storefront.cart.free')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        ))}

                        {/* Upgrade Prompt */}
                        {mainItems.some(item => item.storefront === 'non-credit') && (
                            <div className="upgrade-prompt card">
                                <span className="upgrade-icon">💡</span>
                                <div className="upgrade-content">
                                    <h4>{t('storefront.cart.upgradeTitle')}</h4>
                                    <p>{t('storefront.cart.upgradeDesc')}</p>
                                </div>
                                <Link to="/credit" className="btn btn-outline btn-sm">
                                    {t('storefront.cart.viewCredit')}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary card">
                        <h2>{t('storefront.cart.orderSummary')}</h2>

                        {/* Coupon Section */}
                        <div className="coupon-section">
                            {appliedCoupon ? (
                                <div className="applied-coupon">
                                    <div className="coupon-info">
                                        <span className="coupon-tag">✓ {appliedCoupon.code}</span>
                                        <span className="coupon-desc">{appliedCoupon.description}</span>
                                    </div>
                                    <button
                                        className="remove-coupon-btn"
                                        onClick={handleRemoveCoupon}
                                    >
                                        {t('storefront.cart.remove')}
                                    </button>
                                </div>
                            ) : (
                                <div className="coupon-input-group">
                                    <input
                                        type="text"
                                        placeholder={t('storefront.cart.enterCoupon')}
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                    />
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={handleApplyCoupon}
                                    >
                                        {t('storefront.cart.apply')}
                                    </button>
                                </div>
                            )}
                            {couponError && <p className="coupon-error">{couponError}</p>}
                            {couponSuccess && <p className="coupon-success">{couponSuccess}</p>}
                        </div>

                        {/* Price Breakdown */}
                        <div className="price-breakdown">
                            <div className="price-row">
                                <span>{t('storefront.cart.subtotal')}</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="price-row discount">
                                    <span>{t('storefront.cart.discount')}</span>
                                    <span>-{formatCurrency(discount)}</span>
                                </div>
                            )}
                            {bundledItems.length > 0 && (
                                <div className="price-row bonus">
                                    <span>{t('storefront.cart.bonusCourses')}</span>
                                    <span>{t('storefront.cart.free')}</span>
                                </div>
                            )}
                            <div className="price-row total">
                                <span>{t('storefront.cart.total')}</span>
                                <span>{formatCurrency(total)} CAD</span>
                            </div>
                        </div>

                        {/* Checkout Button */}
                        <Link to="/checkout" className="btn btn-accent btn-lg btn-block">
                            {t('storefront.cart.proceedToCheckout')}
                        </Link>

                        <p className="secure-note">
                            🔒 {t('storefront.cart.secureCheckout')}
                        </p>

                        {/* Continue Shopping */}
                        <div className="continue-shopping">
                            <Link to="/non-credit">{t('storefront.cart.continueShopping')} →</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart
