import api from './api';
import { IS_TOKEN_MODE, tokenStorage } from '../config/authConfig';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (IS_TOKEN_MODE) {
      const { accessToken, refreshToken } = response.data?.data || {};
      if (accessToken) tokenStorage.setTokens(accessToken, refreshToken);
    }
    return response.data;
  },

  register: async (email, password, mobile) => {
    const response = await api.post('/auth/register', { email, password, mobile });
    if (IS_TOKEN_MODE) {
      const { accessToken, refreshToken } = response.data?.data || {};
      if (accessToken) tokenStorage.setTokens(accessToken, refreshToken);
    }
    return response.data;
  },

  logout: async () => {
    const refreshToken = IS_TOKEN_MODE ? tokenStorage.getRefresh() : null;
    const body = refreshToken ? { refreshToken } : {};
    const response = await api.post('/auth/logout', body);
    if (IS_TOKEN_MODE) tokenStorage.clearTokens();
    return response.data;
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  },

  getOAuthProviders: () => {
    const raw = import.meta.env.VITE_OAUTH_PROVIDERS || '';
    return raw.split(',').map(p => p.trim()).filter(Boolean);
  },

  oauthRedirect: (provider) => {
    const ENV = import.meta.env.VITE_ENV || 'development';
    const base = ENV === 'production'
      ? import.meta.env.VITE_API_BASE_URL_PROD
      : import.meta.env.VITE_API_BASE_URL_DEV;
    window.location.href = `${base.replace(/\/$/, '')}/auth/${provider}`;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  verifyResetToken: async (token) => {
    const response = await api.get(`/auth/verify-reset-token/${token}`);
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.post(`/auth/reset-password/${token}`, { password });
    return response.data;
  },
};
