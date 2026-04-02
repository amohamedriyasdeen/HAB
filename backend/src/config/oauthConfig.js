const env = require('./appConfig');

const PROVIDER_MAP = {
  google: {
    strategy: 'passport-google-oauth20',
    credentials: { clientID: env?.GOOGLE_CLIENT_ID, clientSecret: env?.GOOGLE_CLIENT_SECRET },
    callbackURL: env?.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    profileMap: (profile) => ({
      oauthId:  profile.id,
      email:    profile.emails?.[0]?.value,
      userName: profile.displayName || profile.emails?.[0]?.value?.split('@')[0],
      avatar:   profile.photos?.[0]?.value || null,
    }),
  },
  facebook: {
    strategy: 'passport-facebook',
    credentials: { clientID: env?.FACEBOOK_APP_ID, clientSecret: env?.FACEBOOK_APP_SECRET },
    callbackURL: env?.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
    profileMap: (profile) => ({
      oauthId:  profile.id,
      email:    profile.emails?.[0]?.value,
      userName: profile.displayName || `${profile.name?.givenName || ''} ${profile.name?.familyName || ''}`.trim(),
      avatar:   profile.photos?.[0]?.value || null,
    }),
  },
};

// Validate at startup and build active providers
const activeProviders = (env?.OAUTH_PROVIDERS ?? []).reduce((acc, name) => {
  const config = PROVIDER_MAP[name];

  if (!config) {
    console.warn(`[OAuth] "${name}" is listed in OAUTH_PROVIDERS but has no configuration defined.`);
    return acc;
  }

  const { clientID, clientSecret } = config.credentials;
  const missing = [
    !clientID     && `${name.toUpperCase()}_CLIENT_ID / APP_ID`,
    !clientSecret && `${name.toUpperCase()}_CLIENT_SECRET / APP_SECRET`,
    !config.callbackURL && `${name.toUpperCase()}_CALLBACK_URL`,
  ].filter(Boolean);

  if (missing.length) {
    console.error(`[OAuth] "${name}" missing .env keys: ${missing.join(', ')} — skipping.`);
    return acc;
  }

  console.log(`[OAuth] "${name}" configured successfully.`);
  acc[name] = config;
  return acc;
}, {});

module.exports = activeProviders;
