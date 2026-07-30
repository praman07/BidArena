/**
 * Socket.IO Event Constants
 * Domain B: Real-Time Engine Foundation
 */

const SOCKET_EVENTS = {
  // Connection Events
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',

  // Room Events
  JOIN_ROOM: 'room:join',
  LEAVE_ROOM: 'room:leave',
  ROOM_JOINED: 'room:joined',
  ROOM_LEFT: 'room:left',

  // Auction Room Events
  AUCTION_JOIN: 'auction:join',
  AUCTION_LEAVE: 'auction:leave',
  AUCTION_JOINED: 'auction:joined',
  AUCTION_LEFT: 'auction:left',
  AUCTION_USER_JOINED: 'auction:user_joined',
  AUCTION_USER_LEFT: 'auction:user_left',
  AUCTION_ROOM_STATS: 'auction:room_stats',

  // Error Event
  ERROR: 'error',
}

module.exports = SOCKET_EVENTS

