import api from './api';

export const fetchAllUsers = () => api.get('/user/fetch-all-users');
export const getUserById = (id) => api.get(`/user/${id}`);
export const createUser = (formData) => api.post(`/user/create`, formData);
export const updateUser = (id, formData) => api.post(`/user/${id}`, formData);
export const updateUserStatus = (id) => api.post(`/user/status-change/${id}`);
export const deleteUserById = (id) => api.delete(`/user/${id}`);
