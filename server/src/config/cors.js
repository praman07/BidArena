const env = require('./env')

const corsOptions = {
  origin: env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
}

module.exports = corsOptions

