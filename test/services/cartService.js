const { api, tokens, getHeaders } = require('../config/testConfig');

class CartService {
  constructor() {
    this.cartItemId = null;
  }

  async addToCart(productId = '1', quantity = 1) {
    try {
      const response = await api.post('/cart/add', { productId, quantity }, { headers: getHeaders(tokens.customer) });
      console.log('✅ Cart - Added item:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Cart - Add failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getCart() {
    try {
      const response = await api.get('/cart', { headers: getHeaders(tokens.customer) });
      console.log('✅ Cart - Get successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Cart - Get failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateCartItem(productId = '1', quantity = 2) {
    try {
      const response = await api.put(`/cart/update/${productId}`, { quantity }, { headers: getHeaders(tokens.customer) });
      console.log('✅ Cart - Updated item:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Cart - Update failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async removeFromCart(productId = '1') {
    try {
      const response = await api.delete(`/cart/remove/${productId}`, { headers: getHeaders(tokens.customer) });
      console.log('✅ Cart - Removed item:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Cart - Remove failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async clearCart() {
    try {
      const response = await api.delete('/cart/clear', { headers: getHeaders(tokens.customer) });
      console.log('✅ Cart - Cleared:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Cart - Clear failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new CartService(); 