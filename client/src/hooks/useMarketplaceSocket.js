import { useEffect, useRef } from 'react'
import { SOCKET_EVENTS } from '@/constants/socketEvents'
import { connectSocket, joinMarketplace, leaveMarketplace } from '@/services/socket'

/**
 * Subscribes to marketplace-wide auction updates (create / bid / end / winner).
 * Used by Browse, My Auctions, and Dashboard for live refresh without redesign.
 */
export default function useMarketplaceSocket({ enabled = true, onUpdate } = {}) {
  const onUpdateRef = useRef(onUpdate)

  useEffect(() => {
    onUpdateRef.current = onUpdate
  }, [onUpdate])

  useEffect(() => {
    if (!enabled) return undefined

    const socket = connectSocket()

    const handleUpdate = (payload) => {
      onUpdateRef.current?.(payload)
    }

    const onConnect = () => {
      joinMarketplace()
    }

    socket.on(SOCKET_EVENTS.CONNECT, onConnect)
    socket.on(SOCKET_EVENTS.MARKETPLACE_UPDATED, handleUpdate)

    if (socket.connected) {
      onConnect()
    } else {
      socket.connect()
    }

    return () => {
      leaveMarketplace()
      socket.off(SOCKET_EVENTS.CONNECT, onConnect)
      socket.off(SOCKET_EVENTS.MARKETPLACE_UPDATED, handleUpdate)
    }
  }, [enabled])
}
