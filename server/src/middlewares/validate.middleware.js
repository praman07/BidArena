const { validationResult } = require('express-validator')
const ApiError = require('../utils/ApiError')

/** Collects express-validator results and converts them into an ApiError. */
const validate = (req, _res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) return next()

  const details = errors.array().map(({ path, msg }) => ({ field: path, message: msg }))
  return next(ApiError.badRequest(details[0].message, details))
}

module.exports = validate
