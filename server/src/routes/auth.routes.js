const express = require('express')
const authController = require('../controllers/auth.controller')
const { registerValidator, loginValidator } = require('../validators/auth.validator')
const validate = require('../middlewares/validate.middleware')
const { requireAuth } = require('../middlewares/auth.middleware')
const { passport } = require('../config/passport')
const env = require('../config/env')
const ApiError = require('../utils/ApiError')

const router = express.Router()

router.post('/register', registerValidator, validate, authController.register)
router.post('/login', loginValidator, validate, authController.login)
router.post('/logout', authController.logout)
router.get('/me', requireAuth, authController.getMe)

const ensureGoogleEnabled = (_req, _res, next) => {
  if (!env.googleEnabled) {
    return next(ApiError.badRequest('Google sign-in is not configured on this server'))
  }
  return next()
}

router.get(
  '/google',
  ensureGoogleEnabled,
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
)

router.get(
  '/google/callback',
  ensureGoogleEnabled,
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  authController.googleCallback
)

module.exports = router
