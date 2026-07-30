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

  // Error Event
  ERROR: 'error',
}

module.exports = SOCKET_EVENTS
