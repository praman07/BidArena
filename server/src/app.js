const express = require('express')
const cors = require('cors')

const corsOptions = require('./config/cors')
const authRoutes = require('./routes/auth.routes')
const auctionRoutes = require('./routes/auction.routes')
const profileRoutes = require('./routes/profile.routes')
const uploadRoutes = require('./routes/upload.routes')

const app = express()

// TODO: Register global middlewares
app.use(cors(corsOptions))
app.use(express.json())

// TODO: Register API routes
app.use('/api/auth', authRoutes)
app.use('/api/auctions', auctionRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/upload', uploadRoutes)

// TODO: Register error middleware

module.exports = app
