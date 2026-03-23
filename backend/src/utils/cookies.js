const isProd = (nodeEnv) => nodeEnv === 'production';

exports.setCookies = (res, tokenType, token, nodeEnv, age) => {
  const prod = isProd(nodeEnv);
  res.cookie(tokenType, token, {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? 'none' : 'lax',
    path: '/',
    maxAge: age
  });
};

exports.setAuthFlagCookie = (res, nodeEnv) => {
  const prod = isProd(nodeEnv);
  res.cookie('isAuthenticated', 'true', {
    httpOnly: false,
    secure: prod,
    sameSite: prod ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

exports.clearCookies = (res, tokenType, nodeEnv) => {
  const prod = isProd(nodeEnv);
  res.clearCookie(tokenType, {
    httpOnly: true,
    secure: prod,
    sameSite: prod ? 'none' : 'lax',
    path: '/'
  });
};

exports.clearAuthFlagCookie = (res, nodeEnv) => {
  const prod = isProd(nodeEnv);
  res.clearCookie('isAuthenticated', {
    httpOnly: false,
    secure: prod,
    sameSite: prod ? 'none' : 'lax',
    path: '/'
  });
};
