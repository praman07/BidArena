const mongoose = require('mongoose')

// TODO: Define User schema fields and methods
const userSchema = new mongoose.Schema({}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User
