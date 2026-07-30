const HTTP_STATUS = require('../constants/httpStatus')

class ApiResponse {
  constructor(statusCode, message, data = null) {
    this.success = statusCode < 400
    this.message = message
    this.data = data
    this.statusCode = statusCode
  }

  /** Sends the response and omits `statusCode` from the JSON body. */
  send(res) {
    const { statusCode, ...body } = this
    return res.status(statusCode).json(body)
  }

  static ok(res, message, data) {
    return new ApiResponse(HTTP_STATUS.OK, message, data).send(res)
  }

  static created(res, message, data) {
    return new ApiResponse(HTTP_STATUS.CREATED, message, data).send(res)
  }
}

module.exports = ApiResponse
