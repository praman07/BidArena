const ApiError = require('../utils/ApiError')
const HTTP_STATUS = require('../constants/httpStatus')
const env = require('../config/env')

const notFoundHandler = (req, _res, next) => {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`))
}

/** Normalizes Mongoose and JWT failures into ApiError before responding. */
const normalizeError = (error) => {
  if (error instanceof ApiError) return error

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }))
    return ApiError.badRequest(details[0]?.message || 'Validation failed', details)
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field'
    return ApiError.conflict(`An account with this ${field} already exists`)
  }

  if (error.name === 'CastError') {
    return ApiError.badRequest('Invalid identifier provided')
  }

  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    return ApiError.unauthorized('Session expired or invalid')
  }

  return null
}

const errorHandler = (error, _req, res, _next) => {
  const normalized = normalizeError(error)

  const statusCode = normalized?.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR
  const message = normalized?.message || 'Something went wrong'

  if (!normalized) {
    console.error(error)
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(normalized?.details ? { details: normalized.details } : {}),
    ...(env.isProduction ? {} : { stack: error.stack }),
  })
}

module.exports = { notFoundHandler, errorHandler }
