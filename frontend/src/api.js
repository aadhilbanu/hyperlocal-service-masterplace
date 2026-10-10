import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

api.interceptors.request.use((config) => {
  const url = config.url || '';
  const isPublic = url.includes('/token/') || url.includes('/users/register/');
  const token = localStorage.getItem('access_token');
  if (token && !isPublic) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = (error.config && error.config.url) || '';
    const isPublic = url.includes('/token/') || url.includes('/users/register/');
    if (error.response && error.response.status === 401 && !isPublic) {
      localStorage.removeItem('access_token');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export function errorText(err, fallback) {
  const data = err.response && err.response.data;
  if (data && typeof data === 'object') {
    const first = Object.values(data)[0];
    if (Array.isArray(first)) return first[0];
    if (typeof first === 'string') return first;
  }
  return fallback;
}

export default api;
