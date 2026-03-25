import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
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

  register: async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
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
