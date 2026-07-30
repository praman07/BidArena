const authService = require('../services/auth.service')
const catchAsync = require('../utils/catchAsync')
const ApiResponse = require('../utils/ApiResponse')
const { generateToken, setAuthCookie, clearAuthCookie } = require('../utils/generateToken')
const env = require('../config/env')

const issueSession = (res, user) => {
  setAuthCookie(res, generateToken(user))
}

const register = catchAsync(async (req, res) => {
  const { username, email, password } = req.body
  const user = await authService.registerUser({ username, email, password })

  issueSession(res, user)
  return ApiResponse.created(res, 'Account created successfully', {
    user: user.toPublicJSON(),
  })
})

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body
  const user = await authService.loginUser({ email, password })

  issueSession(res, user)
  return ApiResponse.ok(res, 'Logged in successfully', {
    user: user.toPublicJSON(),
  })
})

const googleCallback = (req, res) => {
  issueSession(res, req.user)
  return res.redirect(`${env.CLIENT_URL}/dashboard`)
}

const logout = catchAsync(async (req, res) => {
  clearAuthCookie(res)

  if (typeof req.logout === 'function') {
    await new Promise((resolve) => req.logout(() => resolve()))
  }

  return ApiResponse.ok(res, 'Logged out successfully')
})

const getMe = catchAsync(async (req, res) =>
  ApiResponse.ok(res, 'Current user fetched', { user: req.user.toPublicJSON() })
)

module.exports = {
  register,
  login,
  googleCallback,
  logout,
  getMe,
}
