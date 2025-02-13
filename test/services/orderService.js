const { api, tokens, getHeaders } = require('../config/testConfig');

class OrderService {
  constructor() {
    this.orderId = null;
  }

  async createOrder(orderData) {
    try {
      const response = await api.post('/orders', orderData, { headers: getHeaders(tokens.customer) });
      this.orderId = response.data.order?.id || 'order1';
      console.log('✅ Order - Created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Order - Create failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getOrders() {
    try {
      const response = await api.get('/orders', { headers: getHeaders(tokens.customer) });
      console.log('✅ Orders - Get all successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Orders - Get all failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSingleOrder(id = '1') {
    try {
      const response = await api.get(`/orders/${id}`, { headers: getHeaders(tokens.customer) });
      console.log('✅ Orders - Get single successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Orders - Get single failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async cancelOrder(id = '1') {
    try {
      const response = await api.put(`/orders/${id}/cancel`, {}, { headers: getHeaders(tokens.customer) });
      console.log('✅ Orders - Cancel successful:', response.data);
      this.orderId = null;
      return response.data;
    } catch (error) {
      console.error('❌ Orders - Cancel failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateOrderStatus(id = '1', status = 'processing') {
    try {
      const response = await api.put(`/orders/${id}/status`, { status }, { headers: getHeaders(tokens.admin) });
      console.log('✅ Orders - Status update successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Orders - Status update failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new OrderService(); 