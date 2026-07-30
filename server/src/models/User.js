const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const {
  ROLES,
  ROLE_VALUES,
  AUTH_PROVIDERS,
  PROVIDER_VALUES,
} = require('../constants/roles')

const SALT_ROUNDS = 12

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [20, 'Username must be at most 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      // Not required for OAuth accounts, which have no local credentials.
      type: String,
      minlength: 8,
      select: false,
    },
    googleId: {
      type: String,
      default: null,
      // `sparse` keeps the unique index from colliding on multiple nulls.
      index: { unique: true, sparse: true },
    },
    avatar: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      enum: PROVIDER_VALUES,
      default: AUTH_PROVIDERS.LOCAL,
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLES.USER,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password
        delete ret.__v
        return ret
      },
    },
  }
)

// Async middleware signals completion by resolving, so `next` is not used.
userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS)
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  if (!this.password) return Promise.resolve(false)
  return bcrypt.compare(candidate, this.password)
}

/** Shape returned to clients — never includes the password hash. */
userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id.toString(),
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    provider: this.provider,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User
