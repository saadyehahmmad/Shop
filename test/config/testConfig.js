require('dotenv').config();
const jwt = require('jsonwebtoken');
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store tokens
const tokens = {
  customer: null,
  admin: jwt.sign(
    { username: 'adminTest', role: 'Admin' },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
};

// Get headers with token
function getHeaders(token) {
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
}

// API endpoints configuration
const API = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    profile: '/auth/profile'
  },
  products: {
    base: '/products',
    single: (id) => `/products/${id}`
  },
  cart: {
    base: '/cart',
    add: '/cart/add',
    update: (id) => `/cart/update/${id}`,
    remove: (id) => `/cart/remove/${id}`,
    clear: '/cart/clear'
  },
  orders: {
    base: '/orders',
    single: (id) => `/orders/${id}`,
    cancel: (id) => `/orders/${id}/cancel`,
    status: (id) => `/orders/${id}/status`
  }
};

module.exports = {
  api,
  tokens,
  getHeaders,
  API_URL,
  JWT_SECRET,
  API
}; 