import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui/useToast'
import useAuth from '@/features/auth/hooks/useAuth'
import {
  createPaymentOrderRequest,
  markPaymentFailedRequest,
  openRazorpayCheckout,
  verifyPaymentRequest,
} from '../services/paymentService'

/**
 * Winner payment flow: create order → Razorpay checkout → verify signature.
 */
export default function useAuctionPayment({ auctionId, onPaid, onFailed } = {}) {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)

  const startPayment = useCallback(async () => {
    if (!auctionId) return
    setPaying(true)
    try {
      const order = await createPaymentOrderRequest(auctionId)
      const checkout = await openRazorpayCheckout({
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        keyId: order.keyId,
        auction: order.auction,
        user,
      })

      const verified = await verifyPaymentRequest({
        auctionId,
        razorpay_order_id: checkout.razorpay_order_id,
        razorpay_payment_id: checkout.razorpay_payment_id,
        razorpay_signature: checkout.razorpay_signature,
      })

      toast.success('Payment completed successfully')
      onPaid?.(verified.auction)
      navigate('/dashboard')
    } catch (error) {
      const cancelled = /cancel/i.test(error?.message || '')
      try {
        const failed = await markPaymentFailedRequest(auctionId)
        onFailed?.(failed.auction)
      } catch {
        onFailed?.(null)
      }

      if (cancelled) {
        toast.error('Payment cancelled. You can retry anytime.')
      } else {
        toast.error(error.message || 'Payment failed. Please try again.')
      }
    } finally {
      setPaying(false)
    }
  }, [auctionId, navigate, onFailed, onPaid, toast, user])

  return { paying, startPayment }
}
