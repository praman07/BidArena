import { io } from 'socket.io-client'
import { SOCKET_URL } from '@/constants/appConstants'
import { SOCKET_EVENTS } from '@/constants/socketEvents'

let socket = null

/**
 * Returns a singleton Socket.IO client (cookie auth via withCredentials).
 */
export const getSocket = () => {
  if (socket) return socket

  socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 12,
    reconnectionDelay: 800,
    reconnectionDelayMax: 5000,
  })

  return socket
}

export const connectSocket = () => {
  const client = getSocket()
  if (!client.connected) {
    client.connect()
  }
  return client
}

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export const joinAuctionRoom = (auctionId) => {
  if (!auctionId) return null
  const client = connectSocket()
  client.emit(SOCKET_EVENTS.JOIN_AUCTION, { auctionId })
  return client
}

export const leaveAuctionRoom = (auctionId) => {
  if (!socket || !auctionId) return
  socket.emit(SOCKET_EVENTS.LEAVE_AUCTION, { auctionId })
}

export const placeBid = (auctionId, amount) => {
  if (!auctionId) return null
  const client = connectSocket()
  client.emit(SOCKET_EVENTS.PLACE_BID, { auctionId, amount: Number(amount) })
  return client
}

export const joinMarketplace = () => {
  const client = connectSocket()
  client.emit(SOCKET_EVENTS.JOIN_MARKETPLACE)
  return client
}

export const leaveMarketplace = () => {
  if (!socket) return
  socket.emit(SOCKET_EVENTS.LEAVE_MARKETPLACE)
}

export default getSocket
