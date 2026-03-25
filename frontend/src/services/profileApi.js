import api from './api';

export const updateProfile = (formData) => api.put('/user/profile', formData);
