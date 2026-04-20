// ============================================================
// EMCS: Auth Page — Login / Register / Forgot Password
// ============================================================
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './AuthPage.css'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { signIn, signUp, resetPassword, getRoleRedirect } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: 'Canada',
    province: 'Ontario',
  })

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const signInResult = await signIn({ email: loginForm.email, password: loginForm.password })
      const from = location.state?.from?.pathname
      navigate(from || signInResult?.redirect || getRoleRedirect(), { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      await signUp({
        email: registerForm.email,
        password: registerForm.password,
        fullName: registerForm.fullName,
        phone: registerForm.phone,
        country: registerForm.country,
        province: registerForm.province,
      })
      setSuccess('Registration successful! Please check your email to verify your account.')
      setMode('login')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(forgotEmail)
      setSuccess('Password reset email sent. Please check your inbox.')
      setMode('login')
    } catch (err) {
      setError(err.message || 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left side — Branding */}
        <div className="auth-branding">
          <div className="auth-branding-content">
            <h1>Toronto EMCS</h1>
            <p>Ontario-accredited online education for students worldwide</p>
            <div className="auth-features">
              <div className="auth-feature">
                <span className="auth-feature-icon">🎓</span>
                <span>OSSD Credits & Diploma</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">🌍</span>
                <span>Study from anywhere</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">📚</span>
                <span>Ontario Certified Teachers</span>
              </div>
              <div className="auth-feature">
                <span className="auth-feature-icon">⏰</span>
                <span>Self-paced learning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side — Forms */}
        <div className="auth-form-panel">
          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); setSuccess('') }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); setSuccess('') }}
            >
              Create Account
            </button>
          </div>

          {/* Error / Success messages */}
          {error && <div className="auth-message auth-error">{error}</div>}
          {success && <div className="auth-message auth-success">{success}</div>}

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-field">
                <label htmlFor="login-email">Email Address</label>
                <input
                  id="login-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <button
                type="button"
                className="auth-link"
                onClick={() => { setMode('forgot'); setError('') }}
              >
                Forgot your password?
              </button>
            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {mode === 'register' && (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-field">
                <label htmlFor="reg-name">Full Name</label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                />
              </div>

              <div className="auth-field">
                <label htmlFor="reg-email">Email Address</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </div>

              <div className="auth-field-row">
                <div className="auth-field">
                  <label htmlFor="reg-password">Password</label>
                  <input
                    id="reg-password"
                    type="password"
                    required
                    minLength={6}
                    placeholder="Min 6 characters"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="reg-confirm">Confirm Password</label>
                  <input
                    id="reg-confirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="reg-phone">Phone Number</label>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="+1 555 123 4567"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                />
              </div>

              <div className="auth-field-row">
                <div className="auth-field">
                  <label htmlFor="reg-country">Country</label>
                  <select
                    id="reg-country"
                    value={registerForm.country}
                    onChange={(e) => setRegisterForm({ ...registerForm, country: e.target.value })}
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
                <div className="auth-field">
                  <label htmlFor="reg-province">Province/State</label>
                  <select
                    id="reg-province"
                    value={registerForm.province}
                    onChange={(e) => setRegisterForm({ ...registerForm, province: e.target.value })}
                  >
                    <option value="Ontario">Ontario</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Alberta">Alberta</option>
                    <option value="Quebec">Quebec</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}

          {/* ── FORGOT PASSWORD ── */}
          {mode === 'forgot' && (
            <form className="auth-form" onSubmit={handleForgotPassword}>
              <p className="auth-forgot-text">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div className="auth-field">
                <label htmlFor="forgot-email">Email Address</label>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                type="button"
                className="auth-link"
                onClick={() => { setMode('login'); setError('') }}
              >
                ← Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
