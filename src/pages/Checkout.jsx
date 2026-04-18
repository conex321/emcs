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
    const { user, profile, signUp, getRoleRedirect } = useAuth()

    const [currentStep, setCurrentStep] = useState(1)
    const [isProcessing, setIsProcessing] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [orderNumber, setOrderNumber] = useState('')
    const [paymentError, setPaymentError] = useState('')
    const [orderId, setOrderId] = useState(null)

    // Form state
    const [parentDetails, setParentDetails] = useState({
        firstName: user?.user_metadata?.full_name?.split(' ')[0] || '',
        lastName: user?.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: profile?.phone || '',
        country: profile?.country || 'Canada',
        province: profile?.province || 'Ontario',
        createAccount: false,
        password: '',
    })

    const [studentDetails, setStudentDetails] = useState([{
        firstName: '',
        lastName: '',
        email: '',
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
        { id: 1, label: t('storefront.checkout.steps.cart', 'Review'), icon: '🛒' },
        { id: 2, label: t('storefront.checkout.steps.details', 'Details'), icon: '📝' },
        { id: 3, label: t('storefront.checkout.steps.payment', 'Payment'), icon: '💳' },
        { id: 4, label: t('storefront.checkout.steps.confirmation', 'Done'), icon: '✓' },
    ]

    const mainItems = items.filter(item => !item.isBundled)
    const bundledItems = items.filter(item => item.isBundled)
    const hasNonCredit = items.some(item =>
        (item.storefront === 'non-credit' || item.storefront === 'academic-prep') && !item.isBundled
    )

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
        if (total === 0) {
            // Free order — only need terms agreement
            return agreements.terms && (!hasNonCredit || agreements.nonCreditAcknowledge)
        }
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
                    payment_method: total === 0 ? 'free' : paymentMethod,
                },
            })

            if (error) throw new Error(error.message)
            if (!data?.success) throw new Error(data?.error || 'Payment processing failed')

            setOrderId(data.order_id)
            setOrderNumber(data.order_number)

            // Step 3: Handle payment based on method
            if (data.requires_payment && paymentMethod === 'card') {
                // Stripe is not yet configured — show a clear message
                if (!data.client_secret) {
                    throw new Error(
                        'Stripe payment processing is not yet configured. Please contact support or use an alternative payment method.'
                    )
                }
                // When Stripe is configured, this is where stripe.confirmPayment() goes
                console.log('[checkout] Stripe client_secret received:', data.client_secret ? '✓' : '✗')
                // TODO: stripe.confirmPayment({ clientSecret: data.client_secret })
                // For now, if we got a client_secret but can't process it, inform the user
                throw new Error(
                    'Card payment requires Stripe integration which is being configured. Your order has been saved — please contact support to complete payment.'
                )
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

    // Redirect to cart if empty and not on confirmation
    if (items.length === 0 && !orderComplete) {
        navigate('/cart')
        return null
    }

    // Determine portal redirect for confirmation page
    const portalRedirect = getRoleRedirect ? getRoleRedirect() : '/portal/parent'

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
                    {/* ════════════ Step 1: Cart Review ════════════ */}
                    {currentStep === 1 && (
                        <div className="checkout-step">
                            <h2>{t('storefront.checkout.reviewOrder', 'Review Your Order')}</h2>
                            <p className="step-subtitle">
                                {t('storefront.checkout.reviewSubtitle', 'Confirm your courses before proceeding to checkout.')}
                            </p>

                            <div className="review-items">
                                {mainItems.map(item => (
                                    <div key={item.id} className="review-item">
                                        <div className="review-item-badge">
                                            <span className={`storefront-badge ${item.storefront}`}>
                                                {item.storefront === 'credit' || item.storefront === 'official-ontario'
                                                    ? t('storefront.credit.labelFull', 'Official Ontario')
                                                    : t('storefront.nonCredit.label', 'Academic Prep')}
                                            </span>
                                            <span className="review-item-grade">
                                                {t('storefront.grade.grade', 'Grade')} {item.grade}
                                            </span>
                                        </div>
                                        <div className="review-item-details">
                                            <h3>{item.title}</h3>
                                            <p className="review-item-code">{item.code || item.courseCode}</p>
                                        </div>
                                        <div className="review-item-price">
                                            {item.listPrice > item.price && (
                                                <span className="review-item-list-price">
                                                    {formatCurrency(item.listPrice)}
                                                </span>
                                            )}
                                            <span className="review-item-current-price">
                                                {formatCurrency(item.price)}
                                            </span>
                                        </div>

                                        {/* Bundled items under this course */}
                                        {bundledItems
                                            .filter(bi => bi.bundledWith === item.id)
                                            .map(bundled => (
                                                <div key={bundled.id} className="review-bundled-item">
                                                    <span className="review-bundle-badge">🎁 {t('storefront.cart.bonusIncluded', 'Bonus Included')}</span>
                                                    <span className="review-bundle-title">{bundled.title}</span>
                                                    <span className="review-bundle-free">{t('storefront.cart.free', 'FREE')}</span>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ))}
                            </div>

                            {/* Coupon display */}
                            {appliedCoupon && (
                                <div className="review-coupon">
                                    <span className="review-coupon-tag">🏷️ {appliedCoupon.code}</span>
                                    <span className="review-coupon-desc">{appliedCoupon.description}</span>
                                    <span className="review-coupon-amount">-{formatCurrency(discount)}</span>
                                </div>
                            )}

                            {/* Free order notice */}
                            {total === 0 && items.length > 0 && (
                                <div className="free-order-notice">
                                    <span className="free-order-icon">🎉</span>
                                    <div>
                                        <strong>{t('storefront.checkout.freeOrder', 'This order is free!')}</strong>
                                        <p>{t('storefront.checkout.freeOrderDesc', 'No payment required. Complete your details to finish enrollment.')}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ════════════ Step 2: Details ════════════ */}
                    {currentStep === 2 && (
                        <div className="checkout-step">
                            <h2>{t('storefront.checkout.parentInfo', 'Parent / Guardian Information')}</h2>
                            <p className="step-subtitle">{t('storefront.checkout.accountHolder', 'This is the account holder for billing and communication.')}</p>

                            {/* Pre-fill notice for logged-in users */}
                            {user && (
                                <div className="prefill-notice">
                                    ✅ {t('storefront.checkout.loggedInAs', 'Logged in as')} <strong>{user.email}</strong>
                                </div>
                            )}

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('storefront.checkout.firstName', 'First Name')} *</label>
                                    <input
                                        type="text"
                                        value={parentDetails.firstName}
                                        onChange={(e) => handleParentChange('firstName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.lastName', 'Last Name')} *</label>
                                    <input
                                        type="text"
                                        value={parentDetails.lastName}
                                        onChange={(e) => handleParentChange('lastName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.email', 'Email')} *</label>
                                    <input
                                        type="email"
                                        value={parentDetails.email}
                                        onChange={(e) => handleParentChange('email', e.target.value)}
                                        required
                                        disabled={!!user}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.phone', 'Phone')} *</label>
                                    <input
                                        type="tel"
                                        value={parentDetails.phone}
                                        onChange={(e) => handleParentChange('phone', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.country', 'Country')}</label>
                                    <select
                                        value={parentDetails.country}
                                        onChange={(e) => handleParentChange('country', e.target.value)}
                                    >
                                        <option value="Canada">Canada</option>
                                        <option value="United States">United States</option>
                                        <option value="Vietnam">Vietnam</option>
                                        <option value="China">China</option>
                                        <option value="India">India</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Other">{t('storefront.checkout.other', 'Other')}</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.province', 'Province / State')}</label>
                                    <select
                                        value={parentDetails.province}
                                        onChange={(e) => handleParentChange('province', e.target.value)}
                                    >
                                        <option value="Ontario">Ontario</option>
                                        <option value="British Columbia">British Columbia</option>
                                        <option value="Alberta">Alberta</option>
                                        <option value="Quebec">Quebec</option>
                                        <option value="Other">{t('storefront.checkout.other', 'Other')}</option>
                                    </select>
                                </div>
                            </div>

                            {/* Account creation for guest users */}
                            {!user && (
                                <div className="account-creation-section">
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={parentDetails.createAccount}
                                            onChange={(e) => handleParentChange('createAccount', e.target.checked)}
                                        />
                                        {t('storefront.checkout.createAccount', 'Create an account to track your orders and enrollments')}
                                    </label>
                                    {parentDetails.createAccount && (
                                        <div className="form-group" style={{ marginTop: '1rem' }}>
                                            <label>{t('storefront.checkout.password', 'Password')} *</label>
                                            <input
                                                type="password"
                                                value={parentDetails.password}
                                                onChange={(e) => handleParentChange('password', e.target.value)}
                                                placeholder={t('storefront.checkout.passwordPlaceholder', 'Min 8 characters')}
                                                minLength={8}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <h3 className="section-title">{t('storefront.checkout.studentInfo', 'Student Information')}</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('storefront.checkout.studentFirstName', 'Student First Name')} *</label>
                                    <input
                                        type="text"
                                        value={studentDetails[0].firstName}
                                        onChange={(e) => handleStudentChange(0, 'firstName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.studentLastName', 'Student Last Name')} *</label>
                                    <input
                                        type="text"
                                        value={studentDetails[0].lastName}
                                        onChange={(e) => handleStudentChange(0, 'lastName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.studentEmail', 'Student Email')}</label>
                                    <input
                                        type="email"
                                        value={studentDetails[0].email}
                                        onChange={(e) => handleStudentChange(0, 'email', e.target.value)}
                                        placeholder={t('storefront.checkout.studentEmailPlaceholder', 'Optional, for future student login')}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.dateOfBirth', 'Date of Birth')}</label>
                                    <input
                                        type="date"
                                        value={studentDetails[0].dateOfBirth}
                                        onChange={(e) => handleStudentChange(0, 'dateOfBirth', e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('storefront.checkout.currentGrade', 'Current Grade')}</label>
                                    <select
                                        value={studentDetails[0].currentGrade}
                                        onChange={(e) => handleStudentChange(0, 'currentGrade', e.target.value)}
                                    >
                                        <option value="">{t('storefront.checkout.selectGrade', 'Select Grade')}</option>
                                        {['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'].map(g => (
                                            <option key={g} value={g}>{g === 'K' ? t('storefront.grade.kindergarten', 'Kindergarten') : `${t('storefront.grade.grade', 'Grade')} ${g}`}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>{t('storefront.checkout.previousSchool', 'Previous School')}</label>
                                    <input
                                        type="text"
                                        value={studentDetails[0].previousSchool}
                                        onChange={(e) => handleStudentChange(0, 'previousSchool', e.target.value)}
                                        placeholder={t('storefront.checkout.previousSchoolPlaceholder', 'Name of current or previous school')}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ════════════ Step 3: Payment ════════════ */}
                    {currentStep === 3 && (
                        <>
                        {paymentError && (
                            <div className="payment-error">
                                ⚠️ {paymentError}
                            </div>
                        )}
                        <div className="checkout-step">
                            {/* Free order: skip payment form */}
                            {total === 0 ? (
                                <div className="free-order-payment">
                                    <div className="free-order-icon-large">🎉</div>
                                    <h2>{t('storefront.checkout.noPaymentRequired', 'No Payment Required')}</h2>
                                    <p className="free-order-desc">
                                        {t('storefront.checkout.freeOrderPaymentDesc', 'Your order total is $0. Simply agree to the terms below and submit to complete your enrollment.')}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2>{t('storefront.checkout.paymentMethod', 'Payment Method')}</h2>

                                    {/* Stripe configuration notice */}
                                    <div className="stripe-notice">
                                        <span className="stripe-notice-icon">🔧</span>
                                        <div>
                                            <strong>{t('storefront.checkout.paymentSetup', 'Payment Processing Setup')}</strong>
                                            <p>{t('storefront.checkout.paymentSetupDesc', 'Secure card payment via Stripe is being finalized. Your order details will be saved. For immediate processing, please contact us.')}</p>
                                        </div>
                                    </div>

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
                                            <span className="option-label">{t('storefront.checkout.creditDebitCard', 'Credit / Debit Card')}</span>
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
                                            <span className="option-cards">{t('storefront.checkout.flywireOptions', 'Bank transfer, Alipay, WeChat')}</span>
                                        </label>
                                    </div>

                                    {paymentMethod === 'card' && (
                                        <div className="card-form">
                                            <div className="form-group full-width">
                                                <label>{t('storefront.checkout.cardNumber', 'Card Number')} *</label>
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
                                                    <label>{t('storefront.checkout.expiry', 'Expiry')} *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={cardDetails.expiry}
                                                        onChange={(e) => handleCardChange('expiry', e.target.value)}
                                                        maxLength={5}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>{t('storefront.checkout.cvv', 'CVV')} *</label>
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
                                                <label>{t('storefront.checkout.nameOnCard', 'Name on Card')} *</label>
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
                                            <p>{t('storefront.checkout.flywireRedirect', 'You will be redirected to Flywire to complete payment:')}</p>
                                            <ul>
                                                <li>{t('storefront.checkout.bankTransfer', 'Bank Transfer')}</li>
                                                <li>Alipay</li>
                                                <li>WeChat Pay</li>
                                                <li>{t('storefront.checkout.internationalCard', 'International Credit Card')}</li>
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}

                            <div className="agreements">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={agreements.terms}
                                        onChange={(e) => setAgreements(prev => ({ ...prev, terms: e.target.checked }))}
                                    />
                                    {t('storefront.checkout.agreeTerms', 'I agree to the Terms of Service and Privacy Policy')} *
                                </label>

                                {hasNonCredit && (
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={agreements.nonCreditAcknowledge}
                                            onChange={(e) => setAgreements(prev => ({ ...prev, nonCreditAcknowledge: e.target.checked }))}
                                        />
                                        {t('storefront.checkout.acknowledgeNonCredit', 'I understand that Academic Prep courses do not grant OSSD credits')} *
                                    </label>
                                )}
                            </div>

                            <p className="secure-note">🔒 {t('storefront.checkout.securePayment', 'Your information is protected with 256-bit SSL encryption')}</p>
                        </div>
                        </>)
                    }

                    {/* ════════════ Step 4: Confirmation ════════════ */}
                    {currentStep === 4 && orderComplete && (
                        <div className="checkout-step confirmation-step">
                            <div className="success-checkmark">
                                <div className="success-icon">✓</div>
                            </div>
                            <h2>{t('storefront.checkout.paymentSuccess', 'Enrollment Complete!')}</h2>
                            <p className="order-number">{t('storefront.checkout.orderNumber', 'Order')} #{orderNumber}</p>
                            <p className="confirmation-email">
                                {t('storefront.checkout.confirmationEmail', 'A confirmation email has been sent to')} {parentDetails.email}
                            </p>

                            <div className="next-steps card">
                                <h3>{t('storefront.checkout.whatsNext', "What's Next?")}</h3>

                                <div className="next-steps-timeline">
                                    <div className="timeline-item">
                                        <div className="timeline-icon">📧</div>
                                        <div className="timeline-content">
                                            <strong>{t('storefront.checkout.step1Next', 'Check Your Email')}</strong>
                                            <p>{t('storefront.checkout.step1NextDesc', 'You will receive a confirmation email with your order details and login credentials within 24-48 hours.')}</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-icon">🔑</div>
                                        <div className="timeline-content">
                                            <strong>{t('storefront.checkout.step2Next', 'Access Your Portal')}</strong>
                                            <p>{t('storefront.checkout.step2NextDesc', 'Use your credentials to log into the student and parent portals.')}</p>
                                        </div>
                                    </div>
                                    <div className="timeline-item">
                                        <div className="timeline-icon">📚</div>
                                        <div className="timeline-content">
                                            <strong>{t('storefront.checkout.step3Next', 'Start Learning')}</strong>
                                            <p>{t('storefront.checkout.step3NextDesc', 'Access your courses through the learning management system and begin your Canadian education journey.')}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Upgrade note for Academic Prep */}
                                {hasNonCredit && (
                                    <div className="next-section next-section--upgrade">
                                        <h4>💡 {t('storefront.checkout.upgradeTitle', 'Flexible Upgrade Path')}</h4>
                                        <p>
                                            {t('storefront.checkout.upgradeDesc', 'You can upgrade from the Academic Preparation Program to the Official Ontario Program at any time during the academic year. Previous coursework contributes to the Ontario student record upon upgrade.')}
                                            {' '}<a href="mailto:contact@emcs.ca">contact@emcs.ca</a>
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="confirmation-actions">
                                {user ? (
                                    <Link to={portalRedirect} className="btn btn-accent btn-lg">
                                        {t('storefront.checkout.goToPortal', 'Go to Your Portal')} →
                                    </Link>
                                ) : (
                                    <Link to="/auth" className="btn btn-accent btn-lg">
                                        {t('storefront.checkout.signInToAccess', 'Sign In to Access Portal')} →
                                    </Link>
                                )}
                                <Link to="/academic-prep" className="btn btn-secondary btn-lg">
                                    {t('storefront.checkout.browseMore', 'Browse More Courses')}
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* ════════════ Order Summary Sidebar ════════════ */}
                    {currentStep < 4 && (
                        <div className="order-summary card">
                            <h3>{t('storefront.cart.orderSummary', 'Order Summary')}</h3>

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
                                        <span className="summary-item-price">{t('storefront.cart.free', 'FREE')}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="summary-totals">
                                <div className="summary-row">
                                    <span>{t('storefront.cart.subtotal', 'Subtotal')}</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="summary-row discount">
                                        <span>{t('storefront.cart.discount', 'Discount')} ({appliedCoupon?.code})</span>
                                        <span>-{formatCurrency(discount)}</span>
                                    </div>
                                )}
                                <div className="summary-row total">
                                    <span>{t('storefront.cart.total', 'Total')}</span>
                                    <span>{formatCurrency(total)} CAD</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ════════════ Navigation ════════════ */}
                {currentStep < 4 && (
                    <div className="checkout-nav">
                        {currentStep === 1 ? (
                            <Link to="/cart" className="btn btn-secondary">
                                ← {t('storefront.checkout.backToCart', 'Back to Cart')}
                            </Link>
                        ) : (
                            <button className="btn btn-secondary" onClick={handleBack}>
                                ← {t('storefront.checkout.back', 'Back')}
                            </button>
                        )}

                        {currentStep < 3 ? (
                            <button className="btn btn-accent btn-lg" onClick={handleNext}>
                                {t('storefront.checkout.continue', 'Continue')} →
                            </button>
                        ) : (
                            <button
                                className="btn btn-accent btn-lg"
                                onClick={paymentMethod === 'flywire' ? handleFlywire : handlePayment}
                                disabled={isProcessing || !validateStep3()}
                            >
                                {isProcessing
                                    ? t('storefront.checkout.processing', 'Processing...')
                                    : total === 0
                                        ? t('storefront.checkout.completeEnrollment', 'Complete Enrollment')
                                        : `${t('storefront.checkout.pay', 'Pay')} ${formatCurrency(total)} CAD`
                                }
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Checkout
