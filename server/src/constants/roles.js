const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
}

const ROLE_VALUES = Object.values(ROLES)

const AUTH_PROVIDERS = {
  LOCAL: 'local',
  GOOGLE: 'google',
}

const PROVIDER_VALUES = Object.values(AUTH_PROVIDERS)

module.exports = { ROLES, ROLE_VALUES, AUTH_PROVIDERS, PROVIDER_VALUES }
