import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends the httpOnly refresh-token cookie
});

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let isRefreshing = false;
let queue = [];

// If a request fails with 401, try refreshing the access token once, then retry.
const AUTH_ENDPOINTS = ['/auth/refresh', '/auth/login', '/auth/register', '/auth/logout'];
const isAuthEndpoint = (url = '') => AUTH_ENDPOINTS.some((path) => url.includes(path));

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && !config._retry && !isAuthEndpoint(config.url)) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(api(config)));
        });
      }
      config._retry = true;
      isRefreshing = true;
      try {
        const { data } = await api.post('/auth/refresh');
        setAccessToken(data.accessToken);
        queue.forEach((cb) => cb());
        queue = [];
        return api(config);
      } catch (err) {
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
