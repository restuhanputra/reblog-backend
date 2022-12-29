import { randomBytes } from 'crypto';
import User from '../models/user.js';
import asyncWrapper from '../middlewares/async-middleware.js';
import createError from '../utils/error-util.js';
import getUrl from '../utils/url-util.js';
import sendMail from '../utils/sendmail-util.js';

export const createUser = asyncWrapper(async (req, res) => {
  const { username, email } = req.body;

  const checkUsername = await User.findOne({ username });
  if (checkUsername) throw createError(400, 'Username already exists');

  const checkEmail = await User.findOne({ email });
  if (checkEmail) throw createError(400, 'Email already exists');

  let user = new User({
    ...req.body,
    verificationCode: randomBytes(20).toString('hex'),
  });
  await user.save();

  let html = `
  <div>
    <h1>Hello, ${user.username}</h1>
    <p>Thank you for registering. Please, verify your account by clicking the link below.
    </p>
    <a href="${getUrl(req)}/api/v1/auth/verification/${
    user.verificationCode
  }">Verify Account</a>
  </div>
  `;

  await sendMail(
    user.email,
    'Verify Account',
    'Please verify your account',
    html
  );

  res.status(201).json({
    success: true,
    message: 'User created',
  });
});

export const getAllUser = asyncWrapper(async (req, res) => {
  const users = await User.find().select(['-password', '-__v']);

  res.status(200).json({
    success: true,
    data: users,
  });
});

export const getUserById = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw createError(404, 'User not found');

  res.status(200).json({
    success: true,
    data: user.getUserInfo(),
  });
});

export const updateUser = asyncWrapper(async (req, res) => {
  const checkUser = await User.findById(req.params.id);
  if (!checkUser) throw createError(404, 'User not found');

  await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json({
    success: true,
    message: 'User updated',
  });
});

export const deleteUser = asyncWrapper(async (req, res) => {
  const checkUser = await User.findById(req.params.id);
  if (!checkUser) throw createError(404, 'User not found');

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: 'User deleted',
  });
});
