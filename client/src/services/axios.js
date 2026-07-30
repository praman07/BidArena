import axios from 'axios'
import { API_BASE_URL } from '@/constants/appConstants'
import { clearAuthUser } from '@/features/auth/utils/authStorage'

const SESSION_EXPIRED_KEY = 'bidarena.session.expired'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

/** Routes that must not trigger the global 401 session cleanup. */
const SILENT_401_PATHS = ['/auth/me', '/auth/login', '/auth/register']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''

    if (status === 401 && !SILENT_401_PATHS.some((path) => url.includes(path))) {
      try {
        sessionStorage.setItem(SESSION_EXPIRED_KEY, '1')
      } catch {
        // ignore storage failures
      }
      clearAuthUser()

      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    const message =
      error.response?.data?.message ||
      (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED'
        ? 'Cannot reach the server. Please try again.'
        : 'Something went wrong. Please try again.')

    return Promise.reject(
      Object.assign(error, {
        message,
        details: error.response?.data?.details ?? null,
        status: status ?? null,
      })
    )
  }
)

export const SESSION_EXPIRED_FLAG = SESSION_EXPIRED_KEY

export default api
