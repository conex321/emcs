// ============================================================
// EMCS: Auth Callback — Handle PKCE code exchange
// ============================================================
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../../services/supabaseClient'
import { useAuth } from '../../context/AuthContext'

export default function AuthCallback() {
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { getRoleRedirect } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          window.location.search
        )

        if (exchangeError) {
          setError(exchangeError.message)
          return
        }

        // Redirect based on role after a brief delay for profile fetch
        setTimeout(() => {
          navigate(getRoleRedirect(), { replace: true })
        }, 500)
      } catch (err) {
        setError(err.message || 'Authentication callback failed')
      }
    }

    handleCallback()
  }, [navigate, getRoleRedirect])

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Authentication Error</h2>
        <p style={{ color: '#c53030' }}>{error}</p>
        <a href="/auth">Return to login</a>
      </div>
    )
  }

  return (
    <div style={{ padding: '3rem', textAlign: 'center', color: '#666' }}>
      <p>Completing sign in...</p>
    </div>
  )
}
