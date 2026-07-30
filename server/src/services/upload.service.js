const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const cloudinary = require('../config/cloudinary')
const env = require('../config/env')
const ApiError = require('../utils/ApiError')

const LOCAL_UPLOAD_DIR = path.resolve(__dirname, '../../uploads/auctions')

const ensureLocalUploadDir = () => {
  if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
    fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true })
  }
}

const uploadBufferToCloudinary = (file) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'bidarena/auctions',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error)
        return resolve(result.secure_url)
      }
    )
    stream.end(file.buffer)
  })

const saveBufferLocally = (file) => {
  ensureLocalUploadDir()
  const extension = path.extname(file.originalname) || '.jpg'
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${extension}`
  const filepath = path.join(LOCAL_UPLOAD_DIR, filename)
  fs.writeFileSync(filepath, file.buffer)
  return `http://localhost:${env.PORT}/uploads/auctions/${filename}`
}

/**
 * Uploads one or more image files and returns public URLs.
 * Prefers Cloudinary when configured; falls back to local disk in development.
 */
const uploadImages = async (files = []) => {
  if (!files.length) {
    throw ApiError.badRequest('At least one image is required')
  }

  if (env.cloudinaryEnabled) {
    const urls = []
    for (const file of files) {
      const url = await uploadBufferToCloudinary(file)
      urls.push(url)
    }
    return urls
  }

  if (env.isProduction) {
    throw ApiError.internal(
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.'
    )
  }

  return files.map((file) => saveBufferLocally(file))
}

module.exports = {
  uploadImages,
  LOCAL_UPLOAD_DIR,
}
