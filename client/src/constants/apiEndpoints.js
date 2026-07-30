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
    MY: '/auctions/my',
    DETAIL: (id) => `/auctions/${id}`,
    UPDATE: (id) => `/auctions/${id}`,
    DELETE: (id) => `/auctions/${id}`,
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_AUCTIONS: '/dashboard/recent-auctions',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
  },
}
