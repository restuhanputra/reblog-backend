import mongoose from 'mongoose';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { pick } from 'lodash';
import config from '../config';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpiresIn: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @description Hooks for encrypt password before saving user
 * @param {next} next
 * @returns {String} hashed password
 */
userSchema.pre('save', async function (next) {
  let user = this;
  if (!user.isModified('password')) return next();

  user.password = await hash(user.password, 10);
  next();
});

/**
 * @description Compare password with hashed password
 * @param {password} password
 * @returns {Boolean} true or false
 */
userSchema.methods.comparePassword = async function (password) {
  return await compare(password, this.password);
};

/**
 * @description Generate JWT token
 * @returns {String} JWT
 */
userSchema.methods.generateJWT = async function () {
  let payload = {
    username: this.username,
    email: this.email,
    name: this.name,
    id: this._id,
  };
  return await sign(payload, config.SECRET, { expiresIn: '1d' });
};

/**
 * @description Generate reset password token
 * @returns {String} reset password token and expires in
 */
userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordExpiresIn = Date.now() + 3600000; // 1 hour
  this.resetPasswordToken = randomBytes(20).toString('hex');
};

/**
 * @description Get user info
 * @returns {Object} user
 */
userSchema.methods.getUserInfo = function () {
  return pick(this, ['_id', 'name', 'username', 'email', 'role', 'verified']);
};

module.exports = mongoose.model('User', userSchema);
