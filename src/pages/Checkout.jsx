import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency } from '../config/pricing'
import supabase from '../services/supabaseClient'
import './Checkout.css'

function Checkout() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { items, subtotal, discount, total, appliedCoupon, clearCart } = useCart()
    const { user, signUp } = useAuth()

    const [currentStep, setCurrentStep] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [orderNumber, setOrderNumber] = useState('')
    const [paymentError, setPaymentError] = useState('')
    const [orderId, setOrderId] = useState(null)

    // Form state
    const [parentDetails, setParentDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        country: 'Canada',
        province: 'Ontario',
        createAccount: false,
        password: '',
    })

    const [studentDetails, setStudentDetails] = useState([{
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        currentGrade: '',
        previousSchool: '',
    }])

    const [paymentMethod, setPaymentMethod] = useState('card')
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: '',
    })

    const [agreements, setAgreements] = useState({
        terms: false,
        nonCreditAcknowledge: false,
    })

    const steps = [
        { id: 1, label: t('storefront.checkout.steps.cart'), icon: '🛒' },
        { id: 2, label: t('storefront.checkout.steps.details'), icon: '📝' },
        { id: 3, label: t('storefront.checkout.steps.payment'), icon: '💳' },
        { id: 4, label: t('storefront.checkout.steps.confirmation'), icon: '✓' },
    ]

    const mainItems = items.filter(item => !item.isBundled)
    const bundledItems = items.filter(item => item.isBundled)
    const hasNonCredit = items.some(item => item.storefront === 'non-credit' && !item.isBundled)

    const handleParentChange = (field, value) => {
        setParentDetails(prev => ({ ...prev, [field]: value }))
    }

    const handleStudentChange = (index, field, value) => {
        setStudentDetails(prev => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
    }

    const handleCardChange = (field, value) => {
        setCardDetails(prev => ({ ...prev, [field]: value }))
    }

    const validateStep2 = () => {
        const { firstName, lastName, email, phone } = parentDetails
        const student = studentDetails[0]
        return firstName && lastName && email && phone &&
               student.firstName && student.lastName
    }

    const validateStep3 = () => {
        if (paymentMethod === 'card') {
            const { number, expiry, cvv, name } = cardDetails
            return number && expiry && cvv && name && agreements.terms &&
                   (!hasNonCredit || agreements.nonCreditAcknowledge)
        }
        return agreements.terms && (!hasNonCredit || agreements.nonCreditAcknowledge)
    }

    const handleNext = () => {
        if (currentStep === 2 && !validateStep2()) {
            alert(t('checkout.fillFieldsError', 'Please fill in all required fields'))
            return
        }
        if (currentStep === 3 && !validateStep3()) {
            alert(t('checkout.completePaymentError', 'Please complete payment details and accept terms'))
            return
        }
        setCurrentStep(prev => Math.min(prev + 1, 4))
    }

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const handlePayment = async () => {
        setIsProcessing(true)
        setPaymentError('')

        try {
            // Step 1: If user checked "create account", register them first
            if (!user && parentDetails.createAccount && parentDetails.password) {
                try {
                    await signUp({
                        email: parentDetails.email,
                        password: parentDetails.password,
                        fullName: `${parentDetails.firstName} ${parentDetails.lastName}`,
                        phone: parentDetails.phone,
                        country: parentDetails.country,
                        province: parentDetails.province,
                    })
                } catch (signupErr) {
                    console.warn('Account creation during checkout failed:', signupErr.message)
                    // Continue with checkout even if signup fails
                }
            }

            // Step 2: Call process-payment Edge Function
            const { data, error } = await supabase.functions.invoke('process-payment', {
                body: {
                    cart_items: items.map(item => ({
                        code: item.code || item.courseCode,
                        title: item.title,
                        price: item.price,
                        is_bundled: item.isBundled || false,
                        bundle_reason: item.bundleReason || null,
                        storefront: item.storefront,
                    })),
                    parent_details: parentDetails,
                    student_details: studentDetails,
                    coupon_code: appliedCoupon?.code || null,
                    payment_method: paymentMethod,
                },
            })

            if (error) throw new Error(error.message)
            if (!data?.success) throw new Error(data?.error || 'Payment processing failed')

            setOrderId(data.order_id)
            setOrderNumber(data.order_number)

            // Step 3: Handle payment based on method
            if (data.requires_payment && paymentMethod === 'card') {
                // In production: use Stripe Elements with data.client_secret
                // to confirm the PaymentIntent on the frontend.
                // For now, we show success (webhook will handle the rest)
                console.log('[checkout] Stripe client_secret received:', data.client_secret ? '✓' : '✗')
                // TODO: Replace with stripe.confirmPayment({ clientSecret: data.client_secret })
            }

            // Step 4: If payment is not required (fully discounted), complete immediately
            if (!data.requires_payment) {
                // Trigger enrollment for free orders
                await supabase.functions.invoke('enroll-student', {
                    body: {
                        order_id: data.order_id,
                        students: studentDetails.map((s, i) => ({ ...s, index: i })),
                        courses: items.map(item => ({
                            course_code: item.code || item.courseCode,
                            student_index: 0,
                        })),
                    },
                })
            }

            setOrderComplete(true)
            setCurrentStep(4)
            clearCart()

        } catch (err) {
            console.error('Payment error:', err)
            setPaymentError(err.message || 'Payment processing failed. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const handleFlywire = () => {
        // In production, redirect to Flywire with order metadata
        alert(t('checkout.redirectFlywire', 'Redirecting to Flywire for international payment...'))
        handlePayment()
    }

    if (items.length === 0 && !orderComplete) {
        navigate('/cart')
        return null
    }

    return (
        <div className="checkout-page">
            <div className="container">
                {/* Progress Steps */}
                <div className="checkout-progress">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
                        >
                            <span className="step-icon">{currentStep > step.id ? '✓' : step.icon}</span>
                            <span className="step-label">{step.label}</span>
                            {index < steps.length - 1 && <div className="step-connector" />}
                        </div>
                    ))}
                </div>

                <div className="checkout-content">
                    {/* Step 2: Details */}
                    {currentStep === 2 && (
                        <div className="checkout-step">
                            <h2>{t('storefront.checkout.parentInfo')}</h2>
                            <p className="step-subtitle">{t('storefront.checkout.accountHolder')}</p>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('storefront.checkout.firstName')} *</label>
                                    <input
                                        type="text"
                                        value={parentDetails.firstName}
                                        onChange={(e) => handleParentChange('firstName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.lastName')} *</label>
                                    <input
                                        type="text"
                                        value={parentDetails.lastName}
                                        onChange={(e) => handleParentChange('lastName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.email')} *</label>
                                    <input
                                        type="email"
                                        value={parentDetails.email}
                                        onChange={(e) => handleParentChange('email', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.phone')} *</label>
                                    <input
                                        type="tel"
                                        value={parentDetails.phone}
                                        onChange={(e) => handleParentChange('phone', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.country')}</label>
                                    <select
                                        value={parentDetails.country}
                                        onChange={(e) => handleParentChange('country', e.target.value)}
                                    >
                                        <option value="Canada">Canada</option>
                                        <option value="United States">United States</option>
                                        <option value="Vietnam">Vietnam</option>
                                        <option value="Other">{t('storefront.checkout.other')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.province')}</label>
                                    <select
                                        value={parentDetails.province}
                                        onChange={(e) => handleParentChange('province', e.target.value)}
                                    >
                                        <option value="Ontario">Ontario</option>
                                        <option value="British Columbia">British Columbia</option>
                                        <option value="Alberta">Alberta</option>
                                        <option value="Quebec">Quebec</option>
                                        <option value="Other">{t('storefront.checkout.other')}</option>
                                    </select>
                                </div>
                            </div>

                            <h3>{t('storefront.checkout.studentInfo')}</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('storefront.checkout.studentFirstName')} *</label>
                                    <input
                                        type="text"
                                        value={studentDetails[0].firstName}
                                        onChange={(e) => handleStudentChange(0, 'firstName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.studentLastName')} *</label>
                                    <input
                                        type="text"
                                        value={studentDetails[0].lastName}
                                        onChange={(e) => handleStudentChange(0, 'lastName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.dateOfBirth')}</label>
                                    <input
                                        type="date"
                                        value={studentDetails[0].dateOfBirth}
                                        onChange={(e) => handleStudentChange(0, 'dateOfBirth', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.currentGrade')}</label>
                                    <select
                                        value={studentDetails[0].currentGrade}
                                        onChange={(e) => handleStudentChange(0, 'currentGrade', e.target.value)}
                                    >
                                        <option value="">{t('storefront.checkout.selectGrade')}</option>
                                        {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
                                            <option key={g} value={g}>{g === 'K' ? t('storefront.grade.kindergarten') : `${t('storefront.grade.grade')} ${g}`}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                        <>
                        {paymentError && (
                            <div className="payment-error" style={{ background: '#fff5f5', color: '#c53030', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #fed7d7' }}>
                                ⚠️ {paymentError}
                            </div>
                        )}
                        <div className="checkout-step">
                            <h2>{t('storefront.checkout.paymentMethod')}</h2>

                            <div className="payment-methods">
                                <label className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={() => setPaymentMethod('card')}
                                    />
                                    <span className="option-icon">💳</span>
                                    <span className="option-label">{t('storefront.checkout.creditDebitCard')}</span>
                                    <span className="option-cards">Visa, Mastercard</span>
                                </label>

                                <label className={`payment-option ${paymentMethod === 'flywire' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="flywire"
                                        checked={paymentMethod === 'flywire'}
                                        onChange={() => setPaymentMethod('flywire')}
                                    />
                                    <span className="option-icon">🌍</span>
                                    <span className="option-label">Flywire</span>
                                    <span className="option-cards">{t('storefront.checkout.flywireOptions')}</span>
                                </label>
                            </div>

                            {paymentMethod === 'card' && (
                                <div className="card-form">
                                    <div className="form-group full-width">
                                        <label>{t('storefront.checkout.cardNumber')} *</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardDetails.number}
                                            onChange={(e) => handleCardChange('number', e.target.value)}
                                            maxLength={19}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>{t('storefront.checkout.expiry')} *</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={cardDetails.expiry}
                                                onChange={(e) => handleCardChange('expiry', e.target.value)}
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>{t('storefront.checkout.cvv')} *</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={cardDetails.cvv}
                                                onChange={(e) => handleCardChange('cvv', e.target.value)}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>{t('storefront.checkout.nameOnCard')} *</label>
                                        <input
                                            type="text"
                                            placeholder="John Smith"
                                            value={cardDetails.name}
                                            onChange={(e) => handleCardChange('name', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {paymentMethod === 'flywire' && (
                                <div className="flywire-info">
                                    <p>{t('storefront.checkout.flywireRedirect')}</p>
                                    <ul>
                                        <li>{t('storefront.checkout.bankTransfer')}</li>
                                        <li>Alipay</li>
                                        <li>WeChat Pay</li>
                                        <li>{t('storefront.checkout.internationalCard')}</li>
                                    </ul>
                                </div>
                            )}

                            <div className="agreements">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={agreements.terms}
                                        onChange={(e) => setAgreements(prev => ({ ...prev, terms: e.target.checked }))}
                                    />
                                    {t('storefront.checkout.agreeTerms')} *
                                </label>

                                {hasNonCredit && (
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={agreements.nonCreditAcknowledge}
                                            onChange={(e) => setAgreements(prev => ({ ...prev, nonCreditAcknowledge: e.target.checked }))}
                                        />
                                        {t('storefront.checkout.acknowledgeNonCredit')} *
                                    </label>
                                )}
                            </div>

                            <p className="secure-note">🔒 {t('storefront.checkout.securePayment')}</p>
                        </div>
                        </>)
                    }

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && orderComplete && (
                        <div className="checkout-step confirmation-step">
                            <div className="success-icon">✓</div>
                            <h2>{t('storefront.checkout.paymentSuccess')}</h2>
                            <p className="order-number">{t('storefront.checkout.orderNumber')} #{orderNumber}</p>
                            <p className="confirmation-email">
                                {t('storefront.checkout.confirmationEmail')} {parentDetails.email}
                            </p>

                            <div className="next-steps card">
                                <h3>{t('storefront.checkout.whatsNext')}</h3>
                                {items.some(i => i.storefront === 'credit') && (
                                    <div className="next-section">
                                        <h4>{t('storefront.checkout.forCreditCourses')}</h4>
                                        <ul>
                                            <li>{t('storefront.checkout.creditStep1')}</li>
                                            <li>{t('storefront.checkout.creditStep2')}</li>
                                            <li>{t('storefront.checkout.creditStep3')}</li>
                                            <li>{t('storefront.checkout.creditStep4')}</li>
                                        </ul>
                                    </div>
                                )}
                                {items.some(i => i.storefront === 'non-credit' || i.isBundled) && (
                                    <div className="next-section">
                                        <h4>{t('storefront.checkout.forNonCreditCourses')}</h4>
                                        <ul>
                                            <li>{t('storefront.checkout.nonCreditStep1')}</li>
                                            <li>{t('storefront.checkout.nonCreditStep2')}</li>
                                            <li>{t('storefront.checkout.nonCreditStep3')}</li>
                                        </ul>
                                    </div>
                                )}

                                {/* V2: Upgrade note when student enrolled in Academic Prep */}
                                {items.some(i => i.storefront === 'non-credit' && !i.isBundled) && (
                                    <div className="next-section next-section--upgrade">
                                        <h4>💡 Flexible upgrade path</h4>
                                        <p>
                                            You can upgrade from the Academic Preparation Program to the Official Ontario Program
                                            at any time during the academic year. Previous coursework contributes to the Ontario student record upon upgrade.
                                            Contact admissions at <a href="mailto:contact@emcs.ca">contact@emcs.ca</a> when ready.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="confirmation-actions">
                                <Link to="/dashboard" className="btn btn-accent btn-lg">
                                    {t('storefront.checkout.goToDashboard')}
                                </Link>
                                <Link to="/non-credit" className="btn btn-secondary btn-lg">
                                    {t('storefront.checkout.browseMore')}
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Order Summary Sidebar */}
                    {currentStep < 4 && (
                        <div className="order-summary card">
                            <h3>{t('storefront.cart.orderSummary')}</h3>

                            <div className="summary-items">
                                {mainItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <span className="summary-item-name">{item.title}</span>
                                        <span className="summary-item-price">{formatCurrency(item.price)}</span>
                                    </div>
                                ))}
                                {bundledItems.map(item => (
                                    <div key={item.id} className="summary-item bonus">
                                        <span className="summary-item-name">🎁 {item.title}</span>
                                        <span className="summary-item-price">{t('storefront.cart.free')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>{t('storefront.cart.subtotal')}</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="summary-row discount">
                                        <span>{t('storefront.cart.discount')} ({appliedCoupon?.code})</span>
                                        <span>-{formatCurrency(discount)}</span>
                                    </div>
                                )}
                                <div className="summary-row total">
                                    <span>{t('storefront.cart.total')}</span>
                                    <span>{formatCurrency(total)} CAD</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                {currentStep < 4 && (
                    <div className="checkout-nav">
                        {currentStep === 1 ? (
                            <Link to="/cart" className="btn btn-secondary">
                                ← {t('storefront.checkout.backToCart')}
                            </Link>
                        ) : (
                            <button className="btn btn-secondary" onClick={handleBack}>
                                ← {t('storefront.checkout.back')}
                            </button>
                        )}

                        {currentStep < 3 ? (
                            <button className="btn btn-accent btn-lg" onClick={handleNext}>
                                {t('storefront.checkout.continue')} →
                            </button>
                        ) : (
                            <button
                                className="btn btn-accent btn-lg"
                                onClick={paymentMethod === 'flywire' ? handleFlywire : handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? t('storefront.checkout.processing') : `${t('storefront.checkout.pay')} ${formatCurrency(total)} CAD`}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Checkout
