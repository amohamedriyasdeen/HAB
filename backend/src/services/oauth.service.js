const User = require('../models/user.model');
const Role = require('../models/role.model');
const { createTokens } = require('./auth.service');

const handleOAuthUser = async (provider, profile, req) => {
  const { oauthId, email, userName, avatar } = profile;

  if (!email) {
    const error = new Error('No email returned from OAuth provider');
    error.statusCode = 400;
    throw error;
  }

  let user = await User.findOne({ oauthProvider: provider, oauthId });

  if (!user) {
    // Check if email already exists (local account) — link it
    user = await User.findOne({ email, deletedAt: null });

    if (user) {
      // Link OAuth to existing account
      user.oauthProvider = provider;
      user.oauthId = oauthId;
      user.isOAuthUser = true;
      if (!user.profile && avatar) user.profile = avatar;
      await user.save();
    } else {
      // New user — register
      let userRole = await Role.findOne({ name: 'user' });
      if (!userRole) userRole = await Role.create({ name: 'user', description: 'Default user role' });

      user = await User.create({
        userName,
        email,
        profile: avatar,
        isOAuthUser: true,
        oauthProvider: provider,
        oauthId,
        roles: [userRole._id],
      });
    }
  }

  if (!user.isActive) {
    const error = new Error('Your account is inactive. Please contact your admin.');
    error.statusCode = 403;
    throw error;
  }

  const populatedUser = await User.findById(user._id).populate('roles', 'name').select('-password');
  const { accessToken, refreshToken } = await createTokens(user._id, req);

  return { user: populatedUser, accessToken, refreshToken };
};

module.exports = { handleOAuthUser };
