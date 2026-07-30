const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

const env = require('./config/env')
const corsOptions = require('./config/cors')
const { configurePassport } = require('./config/passport')
const authRoutes = require('./routes/auth.routes')
const auctionRoutes = require('./routes/auction.routes')
const { notFoundHandler, errorHandler } = require('./middlewares/error.middleware')

const app = express()

app.set('trust proxy', 1)

app.use(cors(corsOptions))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser(env.COOKIE_SECRET))
app.use(configurePassport().initialize())

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'BidArena API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/auctions', auctionRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

module.exports = app
