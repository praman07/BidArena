/**
 * Legacy Domain B sockets entry — proxies to Domain A live Socket.IO server
 * so auction-engine BroadcastManager and older imports keep working.
 */
const { initSocketServer, getIO } = require('../socket/socketServer')

const initSocket = (server) => initSocketServer(server)

module.exports = { initSocket, getIO }
