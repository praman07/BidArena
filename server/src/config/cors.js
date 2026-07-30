const env = require('./env')

/** Supports a single CLIENT_URL or comma-separated CLIENT_URLS for preview deploys. */
const allowedOrigins = Array.from(
  new Set(
    [env.CLIENT_URL, ...(env.CLIENT_URLS || [])]
      .flatMap((value) => String(value || '').split(','))
      .map((value) => value.trim())
      .filter(Boolean)
  )
)

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser / same-origin tools (no Origin header)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

module.exports = corsOptions
module.exports.allowedOrigins = allowedOrigins
