import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './auth-context'
import {
  getCurrentUserRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../services/auth.api'
import {
  clearAuthUser,
  getStoredUser,
  setAuthUser,
} from '../utils/authStorage'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const [isInitializing, setIsInitializing] = useState(true)

  const applyUser = useCallback((nextUser) => {
    setUser(nextUser)
    if (nextUser) {
      setAuthUser(nextUser)
    } else {
      clearAuthUser()
    }
  }, [])

  // Persistent login: the cookie is HttpOnly, so the session is verified
  // server-side on every app load.
  useEffect(() => {
    let cancelled = false

    const restoreSession = async () => {
      try {
        const currentUser = await getCurrentUserRequest()
        if (!cancelled) applyUser(currentUser)
      } catch {
        if (!cancelled) applyUser(null)
      } finally {
        if (!cancelled) setIsInitializing(false)
      }
    }

    restoreSession()
    return () => {
      cancelled = true
    }
  }, [applyUser])

  const login = useCallback(
    async (credentials) => {
      const loggedInUser = await loginRequest(credentials)
      applyUser(loggedInUser)
      return loggedInUser
    },
    [applyUser]
  )

  const registerAccount = useCallback(
    async (payload) => {
      const createdUser = await registerRequest(payload)
      applyUser(createdUser)
      return createdUser
    },
    [applyUser]
  )

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } finally {
      applyUser(null)
    }
  }, [applyUser])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isInitializing,
      login,
      register: registerAccount,
      logout,
    }),
    [user, isInitializing, login, registerAccount, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
