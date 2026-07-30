import api from '@/services/axios'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

const appendBoolean = (formData, key, value) => {
  formData.append(key, value ? 'true' : 'false')
}

/**
 * Creates an auction with multipart image upload.
 * Maps Create Auction form fields to the API contract.
 */
export const createAuctionRequest = async ({ formValues, imageFiles, saveAsDraft = false }) => {
  const formData = new FormData()

  formData.append('title', formValues.productName.trim())
  formData.append('description', formValues.detailedDescription.trim())
  formData.append('shortDescription', formValues.shortDescription?.trim() || '')
  formData.append('category', formValues.category)
  formData.append('brand', formValues.brand?.trim() || '')
  formData.append('condition', formValues.condition)
  formData.append('startingBid', String(formValues.startingPrice))
  formData.append('reservePrice', String(formValues.reservePrice))
  formData.append('bidIncrement', String(formValues.bidIncrement))
  formData.append('startTime', new Date(formValues.startDate).toISOString())
  formData.append('endTime', new Date(formValues.endDate).toISOString())
  formData.append('timezone', formValues.timezone || 'UTC')
  appendBoolean(formData, 'shippingAvailable', formValues.shippingAvailable)
  appendBoolean(formData, 'pickupAvailable', formValues.pickupAvailable)
  formData.append('shippingCost', String(formValues.shippingCost ?? 0))
  formData.append('location', formValues.location.trim())
  formData.append('privateNotes', formValues.privateNotes?.trim() || '')
  appendBoolean(formData, 'acceptTerms', formValues.acceptTerms)
  appendBoolean(formData, 'saveAsDraft', saveAsDraft)

  imageFiles.forEach((file) => {
    formData.append('images', file)
  })

  const { data } = await api.post(API_ENDPOINTS.AUCTIONS.CREATE, formData, {
    headers: { 'Content-Type': undefined },
  })

  return data.data.auction
}

export const getAuctionsRequest = async ({ page = 1, limit = 100 } = {}) => {
  const { data } = await api.get(API_ENDPOINTS.AUCTIONS.LIST, {
    params: { page, limit },
  })
  return data.data
}

export const getAuctionByIdRequest = async (id) => {
  const { data } = await api.get(API_ENDPOINTS.AUCTIONS.DETAIL(id))
  return data.data
}

export const getMyAuctionsRequest = async () => {
  const { data } = await api.get(API_ENDPOINTS.AUCTIONS.MY)
  return data.data.auctions
}

export const deleteAuctionRequest = async (id) => {
  const { data } = await api.delete(API_ENDPOINTS.AUCTIONS.DELETE(id))
  return data.data
}

/**
 * Updates an auction owned by the authenticated user.
 * Maps Create/Edit form fields to the API contract.
 */
export const updateAuctionRequest = async ({ id, formValues }) => {
  const payload = {
    title: formValues.productName.trim(),
    description: formValues.detailedDescription.trim(),
    shortDescription: formValues.shortDescription?.trim() || '',
    category: formValues.category,
    brand: formValues.brand?.trim() || '',
    condition: formValues.condition,
    startingBid: Number(formValues.startingPrice),
    reservePrice: Number(formValues.reservePrice),
    bidIncrement: Number(formValues.bidIncrement),
    startTime: new Date(formValues.startDate).toISOString(),
    endTime: new Date(formValues.endDate).toISOString(),
    timezone: formValues.timezone || 'UTC',
    shippingAvailable: Boolean(formValues.shippingAvailable),
    pickupAvailable: Boolean(formValues.pickupAvailable),
    shippingCost: Number(formValues.shippingCost ?? 0),
    location: formValues.location.trim(),
    privateNotes: formValues.privateNotes?.trim() || '',
  }

  const { data } = await api.patch(API_ENDPOINTS.AUCTIONS.UPDATE(id), payload)
  return data.data.auction
}
