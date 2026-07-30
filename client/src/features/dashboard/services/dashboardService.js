import api from '@/services/axios'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

export const getDashboardStatsRequest = async () => {
  const { data } = await api.get(API_ENDPOINTS.DASHBOARD.STATS)
  return data.data.stats
}

export const getDashboardRecentAuctionsRequest = async () => {
  const { data } = await api.get(API_ENDPOINTS.DASHBOARD.RECENT_AUCTIONS)
  return data.data.auctions
}

export const getDashboardRecentActivityRequest = async () => {
  const { data } = await api.get(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY)
  return data.data.activity
}
