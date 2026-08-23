import axios from 'axios';

// withCredentials is required so the browser sends the httpOnly auth
// cookie set by the backend on login - without it, every protected
// request would come back 401 even when logged in.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

// If any request comes back 401 (not logged in / session expired), send the
// user straight to /login instead of leaving whatever page they were on
// stuck mid-fetch forever. Skip this on the auth endpoints themselves so a
// failed login attempt shows its real error instead of bouncing away.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config?.url?.includes('/auth/');
    if (error.response?.status === 401 && !isAuthCheck && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
