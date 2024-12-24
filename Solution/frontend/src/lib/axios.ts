import axios from 'axios';

const baseURL =
  import.meta.env.VITE_NODE_ENVIRONMENT === 'prod'
    ? 'https://community-event-management-backend.onrender.com/api'
    : 'http://localhost:3000/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Return API data from responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
