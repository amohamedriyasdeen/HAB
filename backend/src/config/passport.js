const passport = require('passport');
const activeProviders = require('./oauthConfig');

Object.entries(activeProviders).forEach(([providerName, config]) => {
  const { Strategy } = require(config.strategy);

  const options = {
    ...config.credentials,
    callbackURL: config.callbackURL,
    ...(config.scope        && { scope: config.scope }),
    ...(config.profileFields && { profileFields: config.profileFields }),
  };

  passport.use(
    providerName,
    new Strategy(options, (accessToken, refreshToken, profile, done) => {
      try {
        done(null, { provider: providerName, profile: config.profileMap(profile) });
      } catch (err) {
        done(err, null);
      }
    })
  );
});

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
