import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchMe, login as loginRequest, logout as logoutRequest, refreshAccessToken, signup as signupRequest } from '../services/authService'
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setTokens } from '../lib/tokenStorage'
import type { AuthResponse, User } from '../types/auth'

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (payload: { email: string; full_name: string; password: string; password_confirm: string }) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function saveSession(tokens: AuthResponse) {
  setTokens(tokens.access, tokens.refresh)
}

function clearSession() {
  clearTokens()
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const handleSessionExpired = () => {
      clearSession()
      setUser(null)
      setIsLoading(false)
    }

    window.addEventListener('findit-auth-expired', handleSessionExpired)

    const bootstrap = async () => {
      const access = getAccessToken()
      const refresh = getRefreshToken()

      if (!access || !refresh) {
        setIsLoading(false)
        return
      }

      try {
        const profile = await fetchMe()
        if (!cancelled) {
          setUser(profile)
        }
      } catch {
        try {
          const newAccess = await refreshAccessToken(refresh)
            setAccessToken(newAccess)
          const profile = await fetchMe()
          if (!cancelled) {
            setUser(profile)
          }
        } catch {
          clearSession()
          if (!cancelled) {
            setUser(null)
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
      window.removeEventListener('findit-auth-expired', handleSessionExpired)
    }
  }, [])

  const applySession = (data: AuthResponse) => {
    saveSession(data)
    setUser(data.user)
  }

  const login = async (email: string, password: string) => {
    const data = await loginRequest({ email, password })
    applySession(data)
  }

  const signup = async (payload: { email: string; full_name: string; password: string; password_confirm: string }) => {
    const data = await signupRequest(payload)
    applySession(data)
  }

  const logout = async () => {
    const refresh = getRefreshToken()
    try {
      if (refresh) {
        await logoutRequest(refresh)
      }
    } finally {
      clearSession()
      setUser(null)
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      signup,
      logout,
    }),
    [isLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
