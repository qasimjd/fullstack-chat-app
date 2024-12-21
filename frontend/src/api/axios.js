// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? "http://localhost:5001/api" : '/api',
  withCredentials: true,
  headers: { 
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
