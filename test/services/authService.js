const { api, tokens, getHeaders } = require('../config/testConfig');

class AuthService {
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData, { headers: getHeaders() });
      console.log('✅ Auth - Register successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Auth - Register failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await api.post('/auth/login', { username, password }, { headers: getHeaders() });
      tokens.customer = response.data.token;
      console.log('✅ Auth - Login successful');
      return response.data.token;
    } catch (error) {
      console.error('❌ Auth - Login failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await api.get('/auth/profile', { headers: getHeaders(tokens.customer) });
      console.log('✅ Auth - Get profile successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Auth - Get profile failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new AuthService(); 