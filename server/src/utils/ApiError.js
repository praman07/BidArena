const HTTP_STATUS = require('../constants/httpStatus')

class ApiError extends Error {
  constructor(statusCode, message, details = undefined) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.details = details
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message, details) {
    return new ApiError(HTTP_STATUS.BAD_REQUEST, message, details)
  }

  static unauthorized(message = 'Not authenticated') {
    return new ApiError(HTTP_STATUS.UNAUTHORIZED, message)
  }

  static forbidden(message = 'Access denied') {
    return new ApiError(HTTP_STATUS.FORBIDDEN, message)
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(HTTP_STATUS.NOT_FOUND, message)
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(HTTP_STATUS.CONFLICT, message)
  }

  static internal(message = 'Something went wrong') {
    return new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message)
  }
}

module.exports = ApiError
