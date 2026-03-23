const jwt = require("jsonwebtoken");
const crypto = require('crypto');

exports.generateAccessToken = (userId, secret, expire, algorithm) => {
  return jwt.sign(
    { userId },
    secret,
    { expiresIn: expire, algorithm }
  );
};

exports.generateRefreshToken = (userId, secret, expire, algorithm) => {
  const jti = crypto.randomBytes(16).toString('hex');
  return {
    token: jwt.sign(
      { userId, jti, type: 'refresh' },
      secret,
      { expiresIn: expire, algorithm }
    ),
    jti
  };
};

exports.verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};