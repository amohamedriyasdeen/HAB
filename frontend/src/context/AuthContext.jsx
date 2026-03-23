import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../services/authService';
import { updateUser as updateUserApi } from '../services/userApi';

const AuthContext = createContext(null);

const isAuthCookiePresent = () => document.cookie.split(';').some(c => c.trim().startsWith('isAuthenticated='));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthCookiePresent()) {
        setLoading(false);
        return;
      }
      const data = await authService.checkAuth();
      setUser(data?.data?.user || null);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.data.user);
    setLoading(false);
    return data;
  };

  const register = async (email, password) => {
    const data = await authService.register(email, password);
    setUser(data.data.user);
    setLoading(false);
    return data;
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
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
