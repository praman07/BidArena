import axios from 'axios'
import { API_BASE_URL } from '@/constants/appConstants'
import { clearAuthUser } from '@/features/auth/utils/authStorage'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

/** Routes that must not trigger the global 401 session cleanup. */
const SILENT_401_PATHS = ['/auth/me', '/auth/login', '/auth/register']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const url = error.config?.url || ''

    if (status === 401 && !SILENT_401_PATHS.some((path) => url.includes(path))) {
      clearAuthUser()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }

    const message =
      error.response?.data?.message ||
      (error.code === 'ERR_NETWORK'
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

export default api
