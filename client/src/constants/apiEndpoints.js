export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    GOOGLE: '/auth/google',
  },
  AUCTIONS: {
    CREATE: '/auctions',
    LIST: '/auctions',
    DETAIL: (id) => `/auctions/${id}`,
  },
}
