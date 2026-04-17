// ============================================================
// EMCS: Authentication Context
// Manages user session, role-based routing, profile data
// ============================================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../services/supabaseClient'

const AuthContext = createContext(null)

// Role-based redirect map
const ROLE_ROUTES = {
  admin: '/admin/dashboard',
  teacher: '/teacher/dashboard',
  parent: '/portal/parent',
  student: '/portal/student',
  agent: '/portal/agent',
  school_admin: '/admin/dashboard',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile from profiles table
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Profile fetch error:', error)
        return null
      }
      return data
    } catch (err) {
      console.error('Profile fetch failed:', err)
      return null
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user) {
        fetchProfile(currentSession.user.id).then(setProfile)
      }

      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession)
        setUser(newSession?.user ?? null)

        if (newSession?.user) {
          const profileData = await fetchProfile(newSession.user.id)
          setProfile(profileData)
        } else {
          setProfile(null)
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  // ─── AUTH METHODS ──────────────────────────────────────

  const signUp = async ({ email, password, fullName, phone, country, province }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'parent',
        },
      },
    })

    if (error) throw error

    // Belt-and-suspenders: also call createProfile Edge Function
    if (data?.user) {
      try {
        await supabase.functions.invoke('createProfile', {
          body: {
            user_id: data.user.id,
            full_name: fullName,
            email,
            role: 'parent',
            phone,
            country,
            province,
          },
        })
      } catch (profileErr) {
        console.warn('createProfile edge function failed (trigger will handle it):', profileErr)
      }
    }

    return data
  }

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    if (error) throw error
  }

  // Get the appropriate redirect path for the user's role
  const getRoleRedirect = () => {
    const role = profile?.role || user?.user_metadata?.role || 'parent'
    return ROLE_ROUTES[role] || ROLE_ROUTES.parent
  }

  // Check if user has a specific role
  const hasRole = (role) => {
    return profile?.role === role
  }

  // Check if user is admin
  const isAdmin = () => hasRole('admin')

  const value = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    getRoleRedirect,
    hasRole,
    isAdmin,
    fetchProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
