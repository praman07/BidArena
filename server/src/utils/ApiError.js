// TODO: Implement custom API error class
class ApiError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ApiError'
  }
}

module.exports = ApiError
