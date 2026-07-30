import api from '@/services/axios'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { SERVER_BASE_URL, API_BASE_URL } from '@/constants/appConstants'

export const registerRequest = async ({ username, email, password }) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
    username,
    email,
    password,
  })
  return data.data.user
}

export const loginRequest = async ({ email, password }) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password })
  return data.data.user
}

export const logoutRequest = async () => {
  await api.post(API_ENDPOINTS.AUTH.LOGOUT)
}

export const getCurrentUserRequest = async () => {
  const { data } = await api.get(API_ENDPOINTS.AUTH.ME)
  return data.data.user
}

/** Full-page redirect — the OAuth consent screen cannot be loaded via XHR. */
export const startGoogleLogin = () => {
  window.location.assign(`${API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE}`)
}

export { SERVER_BASE_URL }
