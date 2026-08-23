import axios from 'axios';

// withCredentials is required so the browser sends the httpOnly auth
// cookie set by the backend on login - without it, every protected
// request would come back 401 even when logged in.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
});

export default api;
