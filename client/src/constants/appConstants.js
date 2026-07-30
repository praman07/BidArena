export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '')

export const AUTH_STORAGE_KEY = 'bidarena.auth.user'

export const APP_CONSTANTS = {
  APP_NAME: 'BidArena',
  DEFAULT_REDIRECT: '/dashboard',
  LOGIN_ROUTE: '/login',
}
