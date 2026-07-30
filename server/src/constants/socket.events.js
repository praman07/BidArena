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

  // Bid Socket Events
  BID_PLACE: 'bid:place',
  BID_VALIDATED: 'bid:validated',
  BID_ACCEPTED: 'bid:accepted',
  BID_ERROR: 'bid:error',

  // Socket Broadcast Events
  BROADCAST_HIGHEST_BID: 'broadcast:highest_bid',
  BROADCAST_STATS: 'broadcast:stats',
  BROADCAST_BIDDER_COUNT: 'broadcast:bidder_count',
  BROADCAST_SPECTATORS: 'broadcast:spectators',
  BROADCAST_ROOM_UPDATE: 'broadcast:room_update',
  BROADCAST_AUCTION_STATE: 'broadcast:auction_state',
  BROADCAST_TIME_UPDATE: 'broadcast:time_update',
  BROADCAST_TIMER_ENDED: 'broadcast:timer_ended',
  BROADCAST_AUCTION_WINNER: 'broadcast:auction_winner',

  // Auction Engine Events
  AUCTION_STATE_UPDATE: 'auction:state_update',
  // Error Event
  ERROR: 'error',
}

module.exports = SOCKET_EVENTS

