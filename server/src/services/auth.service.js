const User = require('../models/User')
const ApiError = require('../utils/ApiError')
const { AUTH_PROVIDERS } = require('../constants/roles')

/** Builds a unique username from a base string by appending a numeric suffix. */
const buildUniqueUsername = async (base) => {
  const normalized =
    String(base || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 16) || 'user'

  let candidate = normalized.padEnd(3, '0')
  let suffix = 0

  // Bounded loop: collisions are rare, and the suffix keeps growing.
  while (await User.exists({ username: candidate })) {
    suffix += 1
    const tail = String(suffix)
    candidate = `${normalized.slice(0, 20 - tail.length)}${tail}`
  }

  return candidate
}

const registerUser = async ({ username, email, password }) => {
  const existing = await User.findOne({ $or: [{ email }, { username }] })

  if (existing) {
    throw ApiError.conflict(
      existing.email === email
        ? 'An account with this email already exists'
        : 'This username is already taken'
    )
  }

  const user = await User.create({
    username,
    email,
    password,
    provider: AUTH_PROVIDERS.LOCAL,
  })

  return user
}

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password')

  // Same message for unknown email and wrong password to avoid account enumeration.
  if (!user || !(await user.comparePassword(password))) {
    throw ApiError.unauthorized('Invalid email or password')
  }

  return user
}

const findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails?.[0]?.value?.toLowerCase()
  if (!email) {
    throw ApiError.badRequest('Google account did not provide an email address')
  }

  const avatar = profile.photos?.[0]?.value || null

  const byGoogleId = await User.findOne({ googleId: profile.id })
  if (byGoogleId) return byGoogleId

  // Link the Google identity to an existing local account with the same email.
  const byEmail = await User.findOne({ email })
  if (byEmail) {
    byEmail.googleId = profile.id
    byEmail.avatar = byEmail.avatar || avatar
    await byEmail.save()
    return byEmail
  }

  const username = await buildUniqueUsername(
    profile.displayName || email.split('@')[0]
  )

  return User.create({
    username,
    email,
    googleId: profile.id,
    avatar,
    provider: AUTH_PROVIDERS.GOOGLE,
  })
}

const getUserById = async (id) => {
  const user = await User.findById(id)
  if (!user) throw ApiError.unauthorized('Account no longer exists')
  return user
}

module.exports = {
  registerUser,
  loginUser,
  findOrCreateGoogleUser,
  getUserById,
}
