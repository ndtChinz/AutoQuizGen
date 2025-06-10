import axios from 'axios';

const baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: baseURL,
  timeout: 30000, // Tăng timeout để xử lý các request tạo quiz
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm interceptors để debug
api.interceptors.request.use(config => {
  console.log('API Request:', config.method.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response ? 
      `${error.response.status} ${error.response.data?.message || ''}` : error.message);
    return Promise.reject(error);
  }
);

export default api;