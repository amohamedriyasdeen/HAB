const isSecure = (process.env.BASE_URL || '').startsWith('https');

const base = (httpOnly) => ({
  httpOnly,
  secure: isSecure,
  sameSite: isSecure ? 'none' : 'lax',
  path: '/',
});

exports.setCookies = (res, tokenType, token, _nodeEnv, age) => {
  res.cookie(tokenType, token, { ...base(true), maxAge: age });
};

exports.setAuthFlagCookie = (res, _nodeEnv) => {
  res.cookie('isAuthenticated', 'true', { ...base(false), maxAge: 7 * 24 * 60 * 60 * 1000 });
};

exports.clearCookies = (res, tokenType, _nodeEnv) => {
  res.clearCookie(tokenType, base(true));
};

exports.clearAuthFlagCookie = (res, _nodeEnv) => {
  res.clearCookie('isAuthenticated', base(false));
};
