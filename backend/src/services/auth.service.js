const crypto = require('crypto');
const User = require('../models/user.model');
const Role = require('../models/role.model');
const RefreshToken = require('../models/refreshToken.model');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const crypt = require('../utils/crypt');
const env = require('../config/appConfig');
const { sendMail } = require('../utils/sendMail');

const createTokens = async (userId, req) => {
  const accessToken = generateAccessToken(userId, env.JWT_SECRET, env.ACCESS_TOKEN_EXPIRE, env.JWT_ALGORITHM);
  const { token: refreshToken, jti } = generateRefreshToken(userId, env.JWT_REFRESH_SECRET, env.REFRESH_TOKEN_EXPIRE, env.JWT_ALGORITHM);

  await RefreshToken.create({
    userId,
    token: refreshToken,
    jti,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  return { accessToken, refreshToken };
};

const registerUser = async ({ email, mobile, password }, req) => {
  const existingUser = await User.findOne({ email });
  if (existingUser && !existingUser.deletedAt) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  let userRole = await Role.findOne({ name: 'user' });
  if (!userRole) {
    userRole = await Role.create({ name: 'user', description: 'Default user role' });
  }

  let user;
  if (existingUser?.deletedAt) {
    existingUser.password = password;
    existingUser.mobile = mobile;
    existingUser.deletedAt = null;
    existingUser.isActive = true;
    existingUser.roles = [userRole._id];
    user = await existingUser.save();
  } else {
    user = await User.create({
      userName: email.split('@')[0],
      email,
      mobile,
      password,
      roles: [userRole._id]
    });
  }

  const { accessToken, refreshToken } = await createTokens(user._id, req);

  const populatedUser = await User.findById(user._id).populate('roles', 'name').select('-password');

  return { user: populatedUser, accessToken, refreshToken };
};

const loginUser = async ({ email, password }, req) => {
  const user = await User.findOne({ email }).select("+password");
  
  if (!user || user.deletedAt) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const passwordMatch = await crypt.matchPassword(password, user.password);
  if (!passwordMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Your account is inactive. Please contact your admin.');
    error.statusCode = 403;
    throw error;
  }

  if (user.deletedAt) {
    const error = new Error('Your account is deleted.');
    error.statusCode = 403;
    throw error;
  }
  
  const { accessToken, refreshToken } = await createTokens(user._id, req);

  const populatedUser = await User.findById(user._id).populate('roles', 'name').select('-password');
  
  return { user: populatedUser, accessToken, refreshToken };
};

const refreshAccessToken = async (refreshToken) => {
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  
  if (!storedToken || storedToken.expiresAt < new Date()) {
    const error = new Error('Invalid or expired refresh token');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(storedToken.userId, env.JWT_SECRET, env.ACCESS_TOKEN_EXPIRE, env.JWT_ALGORITHM);
  
  return { accessToken };
};

const logoutUser = async (userId, refreshToken) => {
  if (refreshToken) {
    await RefreshToken.deleteOne({ userId, token: refreshToken });
  } else {
    await RefreshToken.deleteMany({ userId });
  }
};

const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { message: 'If an account with that email exists, a password reset link has been sent' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  user.resetToken = resetToken;
  user.resetTokenExpiry = resetTokenExpiry;
  await user.save();

  const resetLink = `${env.FRONTEND_URL[0]}/#/reset-password?token=${resetToken}`;
  await sendMail({
    to: email,
    subject: 'Password Reset Request',
    template: 'resetPassword',
    variables: { name: user.userName, resetLink },
  });

  return { message: 'If an account with that email exists, a password reset link has been sent' };
};

const resetPasswordService = async (token, newPassword) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.resetToken = null;
  user.resetTokenExpiry = null;
  await user.save();

  return { message: 'Password reset successful' };
};

const verifyResetTokenService = async (token) => {
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error('Invalid or expired reset token');
    error.statusCode = 400;
    throw error;
  }
  
  return { valid: true, email: user.email };
};

module.exports = { createTokens, registerUser, loginUser, refreshAccessToken, logoutUser, forgotPasswordService, resetPasswordService, verifyResetTokenService };