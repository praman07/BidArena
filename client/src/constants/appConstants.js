export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '')

/** Prefer explicit socket URL; fall back to HTTP server origin. */
export const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || SERVER_BASE_URL

export const AUTH_STORAGE_KEY = 'bidarena.auth.user'

export const APP_CONSTANTS = {
  APP_NAME: 'BidArena',
  DEFAULT_REDIRECT: '/dashboard',
  LOGIN_ROUTE: '/login',
}
