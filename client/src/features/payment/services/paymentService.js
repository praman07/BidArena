import api from '@/services/axios'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'

export const createPaymentOrderRequest = async (auctionId) => {
  const { data } = await api.post(API_ENDPOINTS.PAYMENT.CREATE_ORDER, { auctionId })
  return data.data
}

export const verifyPaymentRequest = async (payload) => {
  const { data } = await api.post(API_ENDPOINTS.PAYMENT.VERIFY, payload)
  return data.data
}

export const markPaymentFailedRequest = async (auctionId) => {
  const { data } = await api.post(API_ENDPOINTS.PAYMENT.FAILED, { auctionId })
  return data.data
}

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

export const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }
    if (window.Razorpay) {
      resolve(true)
      return
    }

    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      existing.addEventListener('error', () => resolve(false))
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

/**
 * Opens Razorpay Checkout for an auction winner payment.
 * Resolves with verify payload on success; rejects on cancel/failure.
 */
export const openRazorpayCheckout = ({
  orderId,
  amount,
  currency,
  keyId,
  auction,
  user,
}) =>
  new Promise(async (resolve, reject) => {
    const ready = await loadRazorpayScript()
    if (!ready || !window.Razorpay) {
      reject(new Error('Unable to load Razorpay Checkout. Please try again.'))
      return
    }

    const options = {
      key: keyId,
      amount,
      currency: currency || 'INR',
      name: 'BidArena',
      description: 'Auction Winner Payment',
      image: auction?.images?.[0] || undefined,
      order_id: orderId,
      prefill: {
        name: user?.username || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: {
        color: '#0a0a0a',
      },
      handler(response) {
        resolve(response)
      },
      modal: {
        ondismiss() {
          reject(new Error('Payment cancelled'))
        },
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      reject(
        new Error(
          response?.error?.description ||
            response?.error?.reason ||
            'Payment failed. Please try again.'
        )
      )
    })
    rzp.open()
  })
