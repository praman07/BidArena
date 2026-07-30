const jwt = require('jsonwebtoken')
const env = require('../config/env')

const AUTH_COOKIE_NAME = 'accessToken'

const generateToken = (user) =>
  jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })

const verifyToken = (token) => jwt.verify(token, env.JWT_SECRET)

/** Converts values like `7d`, `12h`, `30m`, `45s`, or raw seconds into milliseconds. */
const parseExpiryToMs = (expiresIn) => {
  const match = /^(\d+)([smhd])?$/.exec(String(expiresIn).trim())
  if (!match) return 7 * 24 * 60 * 60 * 1000

  const value = Number(match[1])
  const unit = match[2] || 's'
  const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
  return value * multipliers[unit]
}

const cookieOptions = () => ({
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'lax',
  path: '/',
  maxAge: parseExpiryToMs(env.JWT_EXPIRES_IN),
})

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, cookieOptions())
}

const clearAuthCookie = (res) => {
  const { maxAge, ...options } = cookieOptions()
  res.clearCookie(AUTH_COOKIE_NAME, options)
}

module.exports = {
  AUTH_COOKIE_NAME,
  generateToken,
  verifyToken,
  setAuthCookie,
  clearAuthCookie,
}
