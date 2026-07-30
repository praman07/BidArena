import { useCallback, useEffect, useRef, useState } from 'react'
import { SOCKET_EVENTS } from '@/constants/socketEvents'
import {
  connectSocket,
  joinAuctionRoom,
  leaveAuctionRoom,
  placeBid as emitPlaceBid,
  getSocket,
} from '@/services/socket'

function formatBidTime(value) {
  if (!value) return 'Just now'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Just now'
  const diffMs = Date.now() - date.getTime()
  if (diffMs < 60_000) return 'Just now'
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)} min ago`
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function normalizeBids(bids = []) {
  return bids.map((bid, index) => ({
    id: bid.id || bid.bidId || `${bid.amount}-${index}`,
    user: bid.user?.username || bid.user || 'Bidder',
    amount: bid.amount,
    time:
      typeof bid.time === 'string' && bid.time.includes('ago')
        ? bid.time
        : formatBidTime(bid.time || bid.createdAt),
    status: bid.status || (index === 0 ? 'Leading' : 'Outbid'),
  }))
}

const initialLive = {
  connected: false,
  joined: false,
  status: null,
  currentBid: 0,
  bidIncrement: 1,
  highestBidder: null,
  participants: 0,
  remainingSeconds: 0,
  bids: [],
  auction: null,
  winner: null,
  ended: false,
  lastError: null,
  lastSuccessBid: null,
}

/**
 * Subscribes to a live auction room and keeps UI state in sync with Socket.IO.
 */
export default function useAuctionSocket(auctionId, { enabled = true } = {}) {
  const [live, setLive] = useState(initialLive)
  const auctionIdRef = useRef(auctionId)
  const joiningRef = useRef(false)
  const pendingBidRef = useRef(false)

  useEffect(() => {
    auctionIdRef.current = auctionId
  }, [auctionId])

  const applyJoined = useCallback((payload) => {
    if (payload.auctionId !== auctionIdRef.current) return
    joiningRef.current = false
    setLive((prev) => ({
      ...prev,
      connected: true,
      joined: true,
      status: payload.status || payload.auction?.status || prev.status,
      currentBid: payload.currentBid ?? payload.auction?.currentBid ?? prev.currentBid,
      bidIncrement: payload.bidIncrement ?? payload.auction?.bidIncrement ?? prev.bidIncrement,
      highestBidder: payload.highestBidder ?? payload.auction?.highestBidder ?? null,
      participants: payload.participants ?? payload.auction?.participantCount ?? 0,
      remainingSeconds: payload.remainingSeconds ?? 0,
      bids: normalizeBids(payload.bids || []),
      auction: payload.auction || prev.auction,
      ended: (payload.status || payload.auction?.status) === 'ENDED',
      lastError: null,
    }))
  }, [])

  useEffect(() => {
    if (!enabled || !auctionId) return undefined

    setLive(initialLive)
    const socket = connectSocket()

    const requestJoin = () => {
      if (joiningRef.current) return
      joiningRef.current = true
      joinAuctionRoom(auctionId)
    }

    const onConnect = () => {
      setLive((prev) => ({ ...prev, connected: true, lastError: null }))
      requestJoin()
    }

    const onDisconnect = () => {
      joiningRef.current = false
      setLive((prev) => ({ ...prev, connected: false, joined: false }))
    }

    const onConnectError = (error) => {
      joiningRef.current = false
      setLive((prev) => ({
        ...prev,
        connected: false,
        lastError: error.message || 'Could not connect to live auction',
      }))
    }

    const onJoined = (payload) => applyJoined(payload)

    const onBidPlaced = (payload) => {
      if (payload.auctionId !== auctionIdRef.current) return
      const successToast = pendingBidRef.current
        ? {
            amount: payload.currentBid ?? payload.bid?.amount,
            id: payload.bid?.id || `${Date.now()}`,
          }
        : null
      pendingBidRef.current = false

      setLive((prev) => ({
        ...prev,
        currentBid: payload.currentBid ?? prev.currentBid,
        highestBidder: payload.highestBidder ?? prev.highestBidder,
        participants: payload.participants ?? prev.participants,
        status: payload.status || prev.status,
        bids: payload.bids ? normalizeBids(payload.bids) : prev.bids,
        lastError: null,
        lastSuccessBid: successToast || prev.lastSuccessBid,
      }))
    }

    const onUpdated = (payload) => {
      if (payload.auctionId !== auctionIdRef.current) return
      setLive((prev) => ({
        ...prev,
        currentBid: payload.currentBid ?? prev.currentBid,
        highestBidder: payload.highestBidder ?? prev.highestBidder,
        participants: payload.participants ?? prev.participants,
        status: payload.status || prev.status,
        remainingSeconds:
          payload.remainingSeconds !== undefined
            ? payload.remainingSeconds
            : prev.remainingSeconds,
        bids: payload.bids ? normalizeBids(payload.bids) : prev.bids,
        ended: payload.status === 'ENDED' ? true : prev.ended,
      }))
    }

    const onCountdown = (payload) => {
      if (payload.auctionId !== auctionIdRef.current) return
      setLive((prev) => ({
        ...prev,
        remainingSeconds: payload.remainingSeconds ?? 0,
      }))
    }

    const onEnded = (payload) => {
      if (payload.auctionId !== auctionIdRef.current) return
      setLive((prev) => ({
        ...prev,
        ended: true,
        status: 'ENDED',
        remainingSeconds: 0,
        auction: payload.auction || prev.auction,
      }))
    }

    const onWinner = (payload) => {
      if (payload.auctionId !== auctionIdRef.current) return
      setLive((prev) => ({
        ...prev,
        ended: true,
        status: 'ENDED',
        remainingSeconds: 0,
        winner: {
          winner: payload.winner,
          winningAmount: payload.winningAmount ?? payload.amount ?? 0,
          message: payload.message,
        },
      }))
    }

    const onBidError = (payload) => {
      pendingBidRef.current = false
      setLive((prev) => ({
        ...prev,
        lastError: payload?.message || 'Bid rejected',
      }))
    }

    socket.on(SOCKET_EVENTS.CONNECT, onConnect)
    socket.on(SOCKET_EVENTS.DISCONNECT, onDisconnect)
    socket.on(SOCKET_EVENTS.CONNECT_ERROR, onConnectError)
    socket.on(SOCKET_EVENTS.AUCTION_JOINED, onJoined)
    socket.on(SOCKET_EVENTS.BID_PLACED, onBidPlaced)
    socket.on(SOCKET_EVENTS.AUCTION_UPDATED, onUpdated)
    socket.on(SOCKET_EVENTS.COUNTDOWN_UPDATED, onCountdown)
    socket.on(SOCKET_EVENTS.AUCTION_ENDED, onEnded)
    socket.on(SOCKET_EVENTS.WINNER_ANNOUNCED, onWinner)
    socket.on(SOCKET_EVENTS.BID_ERROR, onBidError)

    if (socket.connected) {
      onConnect()
    }

    return () => {
      joiningRef.current = false
      pendingBidRef.current = false
      leaveAuctionRoom(auctionId)
      socket.off(SOCKET_EVENTS.CONNECT, onConnect)
      socket.off(SOCKET_EVENTS.DISCONNECT, onDisconnect)
      socket.off(SOCKET_EVENTS.CONNECT_ERROR, onConnectError)
      socket.off(SOCKET_EVENTS.AUCTION_JOINED, onJoined)
      socket.off(SOCKET_EVENTS.BID_PLACED, onBidPlaced)
      socket.off(SOCKET_EVENTS.AUCTION_UPDATED, onUpdated)
      socket.off(SOCKET_EVENTS.COUNTDOWN_UPDATED, onCountdown)
      socket.off(SOCKET_EVENTS.AUCTION_ENDED, onEnded)
      socket.off(SOCKET_EVENTS.WINNER_ANNOUNCED, onWinner)
      socket.off(SOCKET_EVENTS.BID_ERROR, onBidError)
    }
  }, [auctionId, enabled, applyJoined])

  const placeBid = useCallback(
    (amount) => {
      if (!auctionId) return
      pendingBidRef.current = true
      setLive((prev) => ({ ...prev, lastError: null, lastSuccessBid: null }))
      emitPlaceBid(auctionId, amount)
    },
    [auctionId]
  )

  const clearError = useCallback(() => {
    setLive((prev) => ({ ...prev, lastError: null }))
  }, [])

  const clearSuccess = useCallback(() => {
    setLive((prev) => ({ ...prev, lastSuccessBid: null }))
  }, [])

  const dismissWinner = useCallback(() => {
    setLive((prev) => ({ ...prev, winner: null }))
  }, [])

  return {
    live,
    placeBid,
    clearError,
    clearSuccess,
    dismissWinner,
    socket: getSocket(),
  }
}
