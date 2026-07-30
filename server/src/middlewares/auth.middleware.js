const catchAsync = require('../utils/catchAsync')
const ApiError = require('../utils/ApiError')
const authService = require('../services/auth.service')
const { AUTH_COOKIE_NAME, verifyToken } = require('../utils/generateToken')

const extractToken = (req) => {
  const fromCookie = req.cookies?.[AUTH_COOKIE_NAME]
  if (fromCookie) return fromCookie

  const header = req.headers.authorization
  if (header?.startsWith('Bearer ')) return header.slice(7)

  return null
}

const requireAuth = catchAsync(async (req, _res, next) => {
  const token = extractToken(req)
  if (!token) throw ApiError.unauthorized('Not authenticated')

  let payload
  try {
    payload = verifyToken(token)
  } catch {
    throw ApiError.unauthorized('Session expired or invalid')
  }

  req.user = await authService.getUserById(payload.sub)
  return next()
})

const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(ApiError.forbidden('You do not have permission to do that'))
  }
  return next()
}

module.exports = { requireAuth, requireRole }
