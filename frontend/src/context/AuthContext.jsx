import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/authService';
import { updateUser as updateUserApi } from '../services/userApi';
import { IS_TOKEN_MODE, tokenStorage } from '../config/authConfig';

const AuthContext = createContext(null);

const isAuthCookiePresent = () =>
  document.cookie.split(';').some(c => c.trim().startsWith('isAuthenticated='));

const shouldCheckAuth = () =>
  IS_TOKEN_MODE ? tokenStorage.hasToken() || !!tokenStorage.getRefresh() : isAuthCookiePresent();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!shouldCheckAuth()) { setLoading(false); return; }

      if (IS_TOKEN_MODE && !tokenStorage.hasToken() && tokenStorage.getRefresh()) {
        try {
          const res = await api.post('/auth/refresh-token', { refreshToken: tokenStorage.getRefresh() });
          const newAccess = res.data?.data?.accessToken;
          if (newAccess) tokenStorage.setAccess(newAccess);
          else { tokenStorage.clearTokens(); setLoading(false); return; }
        } catch {
          tokenStorage.clearTokens(); setLoading(false); return;
        }
      }

      const data = await authService.checkAuth();
      setUser(data?.data?.user || null);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    setUser(res?.data?.user || null);
  };

  const register = async (email, password, mobile) => {
    const res = await authService.register(email, password, mobile);
    setUser(res?.data?.user || null);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  };

  const updateUser = async (id, formData) => {
    const res = await updateUserApi(id, formData);
    const updatedUser = res.data?.data?.user;
    if (updatedUser) setUser(updatedUser);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
