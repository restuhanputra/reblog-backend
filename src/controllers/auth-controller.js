import User from '../models/user.js';
import asyncWrapper from '../middlewares/async-middleware.js';
import createError from '../utils/error-util.js';
import getUrl from '../utils/url-util.js';
import sendMail from '../utils/sendmail-util.js';

export const verifiyCode = asyncWrapper(async (req, res) => {
  const { verificationCode } = req.params;

  const user = await User.findOne({
    verificationCode,
  });
  if (!user) throw createError(401, 'Unauthorized. Invalid verification code');

  user.verified = true;
  user.verificationCode = undefined;
  await user.save();
  res.status(200).json({
    success: true,
    message: 'Account verified',
  });
});

export const resetPassword = asyncWrapper(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw createError(404, 'User not found');

  user.generatePasswordReset();
  await user.save();

  let html = `
  <div>
    <h1>Hello, ${user.username}</h1>
    <p>You have requested to reset your password. Please, click the link below to reset your password.
    </p>
    <a href="${getUrl(req)}/api/v1/auth/reset-password/${
    user.resetPasswordToken
  }">Reset Password</a>
  </div>
  `;

  await sendMail(
    user.email,
    'Reset Password',
    'Please reset your password',
    html
  );

  res.status(200).json({
    success: true,
    message: 'Password reset link sent to your email',
  });
});

export const verifyResetPassword = asyncWrapper(async (req, res) => {
  const { password, resetPasswordToken } = req.body;

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpiresIn: { $gt: Date.now() },
  });
  if (!user)
    throw createError(
      401,
      'Unauthorized. Invalid reset password code or has expired'
    );

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpiresIn = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
});

export const login = asyncWrapper(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) throw createError(401, 'Invalid username or password');

  const passwordIsMatch = await user.comparePassword(password);
  if (!passwordIsMatch) throw createError(401, 'Invalid username or password');

  let token = await user.generateJWT();
  res.status(200).json({
    success: true,
    message: 'Login successfully',
    token: `Bearer ${token}`,
  });
});

export const logout = (req, res) => {
  req.logout((err) => {
    if (err) next(err);
  });
  req.session.user = null;
  req.session.save(function (err) {
    if (err) next(err);
    res.clearCookie('connect.sid');

    req.session.regenerate(function (err) {
      if (err) next(err);
      res.status(200).json({
        success: true,
        message: 'Logout successfully',
      });
    });
  });
};
