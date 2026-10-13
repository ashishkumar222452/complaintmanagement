import axios from 'axios';

// In Vercel or cloud deployments with vercel.json rewrite, /api proxies directly to backend
// In local dev without rewrite, defaults to VITE_API_URL or http://localhost:5000/api
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000
});

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  const base = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format errors & handle unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status === 401) {
      // Clear token if invalid or expired
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

export const complaintApi = {
  submit: (formData) =>
    api.post('/complaints', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getMyComplaints: (params) => api.get('/complaints/my', { params }),
  getDetails: (id) => api.get(`/complaints/${id}`),
  trackPublic: (complaintId) => api.get(`/complaints/track/${complaintId}`),
  getAllAdmin: (params) => api.get('/complaints/admin/all', { params }),
  updateStatusAdmin: (id, data) => api.put(`/complaints/admin/${id}/status`, data),
  deleteAdmin: (id) => api.delete(`/complaints/admin/${id}`),
  getStatsAdmin: () => api.get('/complaints/admin/stats')
};

export const categoryApi = {
  getActive: () => api.get('/categories'),
  getAllAdmin: () => api.get('/categories/admin/all'),
  createAdmin: (data) => api.post('/categories/admin', data),
  updateAdmin: (id, data) => api.put(`/categories/admin/${id}`, data),
  deleteAdmin: (id) => api.delete(`/categories/admin/${id}`)
};

export const notificationApi = {
  getNotifications: () => api.get('/notifications'),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all')
};

export default api;
