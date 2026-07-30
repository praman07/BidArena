const passport = require('passport')
const { Strategy: GoogleStrategy } = require('passport-google-oauth20')
const env = require('./env')
const authService = require('../services/auth.service')

const configurePassport = () => {
  if (!env.googleEnabled) {
    console.warn(
      'Google OAuth disabled: GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET are not set.'
    )
    return passport
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await authService.findOrCreateGoogleUser(profile)
          return done(null, user)
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  return passport
}

module.exports = { passport, configurePassport }
