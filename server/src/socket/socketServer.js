const { Server } = require('socket.io')
const corsOptions = require('../config/cors')
const env = require('../config/env')
const { AUTH_COOKIE_NAME, verifyToken } = require('../utils/generateToken')
const authService = require('../services/auth.service')
const registerAuctionSocket = require('./auctionSocket')

let io = null

const parseCookies = (header = '') => {
  const cookies = {}
  String(header)
    .split(';')
    .forEach((part) => {
      const idx = part.indexOf('=')
      if (idx === -1) return
      const key = part.slice(0, idx).trim()
      const value = part.slice(idx + 1).trim()
      if (!key) return
      try {
        cookies[key] = decodeURIComponent(value)
      } catch {
        cookies[key] = value
      }
    })
  return cookies
}

const extractSocketToken = (socket) => {
  const fromAuth = socket.handshake?.auth?.token
  if (fromAuth) return fromAuth

  const header = socket.handshake?.headers?.authorization
  if (header?.startsWith('Bearer ')) return header.slice(7)

  const cookies = parseCookies(socket.handshake?.headers?.cookie)
  return cookies[AUTH_COOKIE_NAME] || null
}

/**
 * Initializes Socket.IO on the HTTP server with JWT auth.
 */
const initSocketServer = (httpServer) => {
  const origins = require('../config/cors').allowedOrigins || [env.CLIENT_URL]

  io = new Server(httpServer, {
    cors: {
      origin: origins,
      credentials: true,
      methods: corsOptions.methods,
    },
  })

  io.use(async (socket, next) => {
    try {
      const token = extractSocketToken(socket)
      if (!token) {
        return next(new Error('Authentication required'))
      }

      let payload
      try {
        payload = verifyToken(token)
      } catch {
        return next(new Error('Session expired or invalid'))
      }

      const user = await authService.getUserById(payload.sub)
      socket.user = {
        id: user._id.toString(),
        username: user.username,
        avatar: user.avatar,
        role: user.role,
      }
      socket.data.joinedAuctions = new Set()
      return next()
    } catch (error) {
      return next(error)
    }
  })

  io.on('connection', (socket) => {
    if (!env.isProduction) {
      console.log(`[Socket] Connected ${socket.id} as ${socket.user?.username}`)
    }
    registerAuctionSocket(io, socket)

    socket.on('disconnect', (reason) => {
      if (!env.isProduction) {
        console.log(`[Socket] Disconnected ${socket.id} (${reason})`)
      }
    })
  })

  if (!env.isProduction) {
    console.log('[Socket] Live auction Socket.IO ready')
  }
  return io
}

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO is not initialized. Call initSocketServer first.')
  }
  return io
}

module.exports = {
  initSocketServer,
  getIO,
}
