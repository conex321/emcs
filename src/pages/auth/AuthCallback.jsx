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
  const { resolveRoleRedirect } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        let authUser = null

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            setError(exchangeError.message)
            return
          }

          authUser = data?.user ?? null
        } else {
          const { data: { session } } = await supabase.auth.getSession()
          authUser = session?.user ?? null
        }

        if (!authUser) {
          setError('Authentication session could not be established.')
          return
        }

        const redirect = await resolveRoleRedirect(authUser)
        navigate(redirect, { replace: true })
      } catch (err) {
        setError(err.message || 'Authentication callback failed')
      }
    }

    handleCallback()
  }, [navigate, resolveRoleRedirect])

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
