// ============================================================
// EMCS: Authentication Context
// Manages user session, role-based routing, profile data
// ============================================================
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
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

const getRouteForRole = (role) => ROLE_ROUTES[role] || ROLE_ROUTES.parent

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
        .maybeSingle()

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
    let isMounted = true

    const syncAuthState = async (nextSession) => {
      if (!isMounted) return

      setLoading(true)
      setSession(nextSession)
      setUser(nextSession?.user ?? null)

      if (!nextSession?.user) {
        setProfile(null)
        setLoading(false)
        return
      }

      const profileData = await fetchProfile(nextSession.user.id)
      if (!isMounted) return

      setProfile(profileData)
      setLoading(false)
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      void syncAuthState(currentSession)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        await syncAuthState(newSession)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
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

    const profileData = data?.user ? await fetchProfile(data.user.id) : null
    if (profileData) {
      setProfile(profileData)
    }

    return {
      ...data,
      profile: profileData,
      redirect: getRouteForRole(profileData?.role || data?.user?.user_metadata?.role || 'parent'),
    }
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
    return getRouteForRole(role)
  }

  const resolveRoleRedirect = async (authUser = user) => {
    if (!authUser) {
      return ROLE_ROUTES.parent
    }

    const profileData = await fetchProfile(authUser.id)
    const resolvedRole = profileData?.role || authUser?.user_metadata?.role || 'parent'

    if (profileData) {
      setProfile(profileData)
    }

    return getRouteForRole(resolvedRole)
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
    resolveRoleRedirect,
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
