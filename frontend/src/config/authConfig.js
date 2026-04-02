export const AUTH_BASE     = import.meta.env.VITE_AUTH_BASE || 'cookie';
export const IS_TOKEN_MODE = AUTH_BASE === 'token';

const ACCESS_KEY  = 'access_token';
const REFRESH_KEY = 'refresh_token';

// --- Drivers (all share the same interface: get / set / remove) ---

const sessionDriver = {
  get:    (key)        => sessionStorage.getItem(key),
  set:    (key, value) => sessionStorage.setItem(key, value),
  remove: (key)        => sessionStorage.removeItem(key),
};

// SameSite=Strict blocks CSRF. No httpOnly since JS must read it.
// Refresh token lives here so it survives page refresh (sessionStorage would lose it).
const cookieDriver = {
  get: (key) => {
    const match = document.cookie.split(';').find(c => c.trim().startsWith(`${key}=`));
    if (!match) return null;
    const [, ...rest] = match.trim().split('=');
    return decodeURIComponent(rest.join('='));
  },
  set: (key, value) => {
    document.cookie = `${key}=${encodeURIComponent(value)};path=/;max-age=${7 * 24 * 60 * 60};SameSite=Strict`;
  },
  remove: (key) => {
    document.cookie = `${key}=;path=/;max-age=0;SameSite=Strict`;
  },
};

// In cookie mode backend owns everything — frontend does nothing
const noopDriver = { get: () => null, set: () => {}, remove: () => {} };

// access token  → sessionStorage (cleared on tab close, limits XSS window)
// refresh token → cookie SameSite=Strict (survives refresh, blocks CSRF)
const accessDriver  = IS_TOKEN_MODE ? sessionDriver : noopDriver;
const refreshDriver = IS_TOKEN_MODE ? cookieDriver  : noopDriver;

export const tokenStorage = {
  getAccess:    ()      => accessDriver.get(ACCESS_KEY),
  setAccess:    (token) => accessDriver.set(ACCESS_KEY, token),
  clearAccess:  ()      => accessDriver.remove(ACCESS_KEY),

  getRefresh:   ()      => refreshDriver.get(REFRESH_KEY),
  setRefresh:   (token) => refreshDriver.set(REFRESH_KEY, token),
  clearRefresh: ()      => refreshDriver.remove(REFRESH_KEY),

  setTokens: (accessToken, refreshToken) => {
    if (accessToken)  accessDriver.set(ACCESS_KEY, accessToken);
    if (refreshToken) refreshDriver.set(REFRESH_KEY, refreshToken);
  },
  clearTokens: () => {
    accessDriver.remove(ACCESS_KEY);
    refreshDriver.remove(REFRESH_KEY);
  },
  hasToken: () => !!accessDriver.get(ACCESS_KEY),
};
