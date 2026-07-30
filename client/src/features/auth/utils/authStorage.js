import { AUTH_STORAGE_KEY } from '@/constants/appConstants'

/**
 * Caches the public user object so the UI can render immediately on reload.
 * The session itself lives in an HttpOnly cookie and is always re-verified
 * against `GET /auth/me`.
 */
export const getStoredUser = () => {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const setAuthUser = (user) => {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
  } catch {
    // Storage unavailable (private mode / quota) — cache is optional.
  }
}

export const clearAuthUser = () => {
  try {
    window.localStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    // Ignore storage failures.
  }
}
