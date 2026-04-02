import axios from 'axios';
import { router } from '../router';
import { IS_TOKEN_MODE, tokenStorage } from '../config/authConfig';

const ENV = import.meta.env.VITE_ENV || 'development';
const API_BASE_URL = ENV === 'production'
  ? import.meta.env.VITE_API_BASE_URL_PROD
  : import.meta.env.VITE_API_BASE_URL_DEV;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: !IS_TOKEN_MODE,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  if (IS_TOKEN_MODE) {
    const token = tokenStorage.getAccess();
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest)).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = IS_TOKEN_MODE ? tokenStorage.getRefresh() : null;
        if (IS_TOKEN_MODE && !refreshToken) {
          tokenStorage.clearTokens();
          router.navigate('/login');
          return Promise.reject(error);
        }
        const body = IS_TOKEN_MODE ? { refreshToken } : {};
        const res = await api.post('/auth/refresh-token', body);
        if (IS_TOKEN_MODE && res.data?.data?.accessToken) {
          tokenStorage.setAccess(res.data.data.accessToken);
        }
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        if (IS_TOKEN_MODE) tokenStorage.clearTokens();
        router.navigate('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
