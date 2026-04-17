import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { courses as coursesEn } from '../data/courses'
import { GRADE_LEVEL_PRICING } from '../config/pricing'
import './Register.css'

function getGradeBandKey(grade) {
    const n = Number(grade)
    if (!n) return null
    if (n >= 1 && n <= 5) return '1-5'
    if (n >= 6 && n <= 8) return '6-8'
    if (n >= 9 && n <= 12) return '9-12'
    return null
}

function buildCourseItem(course) {
    const pricing = course.product?.pricing || {}
    return {
        id: course.code,
        code: course.code,
        title: course.title,
        grade: course.grade,
        subject: course.subject,
        storefront: course.storefront || 'credit',
        price: pricing.salePrice || pricing.basePrice || pricing.perCourse || pricing.listPrice || 0,
        listPrice: pricing.listPrice || 0,
        product: course.product,
    }
}

function buildProgramItem({ program, grade }) {
    const bandKey = getGradeBandKey(grade)
    if (!bandKey) return null
    const band = GRADE_LEVEL_PRICING[bandKey]
    if (!band) return null

    if (program === 'academic-prep') {
        return {
            id: `academic-prep-grade${grade}`,
            code: `AP-G${grade}`,
            title: `Academic Prep — Grade ${grade} (Full Year)`,
            grade: String(grade),
            storefront: 'non-credit',
            price: band.academicPrep.fullYear,
            listPrice: band.academicPrep.listPrice * 6 + band.registration,
        }
    }
    if (program === 'official-ontario') {
        return {
            id: `official-ontario-grade${grade}`,
            code: `OO-G${grade}`,
            title: `Official Ontario Program — Grade ${grade} (Full Year)`,
            grade: String(grade),
            storefront: 'credit',
            price: band.officialOntario.fullYear,
            listPrice: band.officialOntario.fullYear,
        }
    }
    return null
}

function Register() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { addItem, items: cartItems } = useCart()
    const { signUp } = useAuth()

    const courseParam = searchParams.get('course')
    const programParam = searchParams.get('program')
    const gradeParam = searchParams.get('grade')

    const preselected = useMemo(() => {
        if (courseParam && coursesEn[courseParam]) {
            return buildCourseItem(coursesEn[courseParam])
        }
        if (programParam && gradeParam) {
            return buildProgramItem({ program: programParam, grade: gradeParam })
        }
        return null
    }, [courseParam, programParam, gradeParam])

    // Add preselected item to cart on mount (once)
    useEffect(() => {
        if (preselected && !cartItems.find(i => i.id === preselected.id)) {
            addItem(preselected, Object.values(coursesEn))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preselected?.id])

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        country: 'Canada',
        province: 'Ontario',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (form.password !== form.confirmPassword) {
            setError(t('register.errors.passwordMismatch', 'Passwords do not match'))
            return
        }
        if (form.password.length < 6) {
            setError(t('register.errors.passwordShort', 'Password must be at least 6 characters'))
            return
        }

        setLoading(true)
        try {
            await signUp({
                email: form.email,
                password: form.password,
                fullName: form.fullName,
                phone: form.phone,
                country: form.country,
                province: form.province,
            })
            navigate('/checkout')
        } catch (err) {
            setError(err.message || t('register.errors.generic', 'Registration failed. Please try again.'))
        } finally {
            setLoading(false)
        }
    }

    const activeCartItems = cartItems.filter(i => !i.isBundled)

    return (
        <div className="register-page">
            <section className="register-hero">
                <div className="container">
                    <h1>{t('register.title', 'Create your EMCS account')}</h1>
                    <p>{t('register.subtitle', 'One step closer to enrolling with Toronto EMCS.')}</p>
                </div>
            </section>

            <section className="register-content section">
                <div className="container register-grid">
                    <div className="register-summary card">
                        <h2>{t('register.summary.title', 'Your enrollment')}</h2>
                        {preselected && (
                            <div className="register-preselect">
                                <p className="register-preselect-label">{t('register.summary.preselected', 'Selected for you')}</p>
                                <p className="register-preselect-title">{preselected.title}</p>
                                {preselected.price > 0 && (
                                    <p className="register-preselect-price">${preselected.price.toLocaleString()} CAD</p>
                                )}
                            </div>
                        )}

                        {activeCartItems.length > 0 ? (
                            <>
                                <p className="register-cart-label">{t('register.summary.inCart', 'In your cart')}</p>
                                <ul className="register-cart-list">
                                    {activeCartItems.map(item => (
                                        <li key={item.id}>
                                            <span>{item.title}</span>
                                            {item.price > 0 && <span>${item.price.toLocaleString()}</span>}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="register-empty">
                                <p>{t('register.summary.empty', 'No courses selected yet.')}</p>
                                <Link to="/courses" className="btn btn-outline btn-sm">
                                    {t('register.summary.browse', 'Browse courses')}
                                </Link>
                            </div>
                        )}

                        <div className="register-help">
                            <p>{t('register.help.existing', 'Already have an account?')}</p>
                            <Link to="/auth" className="auth-link">{t('register.help.signIn', 'Sign in')}</Link>
                        </div>
                    </div>

                    <form className="register-form card" onSubmit={handleSubmit}>
                        <h2>{t('register.form.title', 'Parent / guardian details')}</h2>

                        {error && <div className="register-error">{error}</div>}

                        <div className="field">
                            <label htmlFor="reg-name">{t('register.form.name', 'Full name')}</label>
                            <input
                                id="reg-name"
                                type="text"
                                required
                                value={form.fullName}
                                onChange={e => setForm({ ...form, fullName: e.target.value })}
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="reg-email">{t('register.form.email', 'Email address')}</label>
                            <input
                                id="reg-email"
                                type="email"
                                required
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                            />
                        </div>

                        <div className="field-row">
                            <div className="field">
                                <label htmlFor="reg-password">{t('register.form.password', 'Password')}</label>
                                <input
                                    id="reg-password"
                                    type="password"
                                    required
                                    minLength={6}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="reg-confirm">{t('register.form.confirm', 'Confirm password')}</label>
                                <input
                                    id="reg-confirm"
                                    type="password"
                                    required
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="reg-phone">{t('register.form.phone', 'Phone (optional)')}</label>
                            <input
                                id="reg-phone"
                                type="tel"
                                value={form.phone}
                                onChange={e => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>

                        <div className="field-row">
                            <div className="field">
                                <label htmlFor="reg-country">{t('register.form.country', 'Country')}</label>
                                <select
                                    id="reg-country"
                                    value={form.country}
                                    onChange={e => setForm({ ...form, country: e.target.value })}
                                >
                                    <option value="Canada">Canada</option>
                                    <option value="China">China</option>
                                    <option value="India">India</option>
                                    <option value="Nigeria">Nigeria</option>
                                    <option value="Vietnam">Vietnam</option>
                                    <option value="South Korea">South Korea</option>
                                    <option value="Brazil">Brazil</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="field">
                                <label htmlFor="reg-province">{t('register.form.province', 'Province / state')}</label>
                                <input
                                    id="reg-province"
                                    type="text"
                                    value={form.province}
                                    onChange={e => setForm({ ...form, province: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                            {loading
                                ? t('register.form.submitting', 'Creating account…')
                                : t('register.form.submit', 'Create account & continue to checkout')}
                        </button>

                        <p className="register-disclaimer">
                            {t('register.form.disclaimer', 'By creating an account you agree to our Terms of Service and Privacy Policy.')}
                        </p>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default Register
