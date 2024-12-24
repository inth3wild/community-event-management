import axios from 'axios';

const baseURL =
  process.env.NODE_ENVIRONMENT === 'dev'
    ? 'http://localhost:3000/api'
    : 'https://community-event-management-backend.onrender.com/api';

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
