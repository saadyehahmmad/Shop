const { api, tokens, getHeaders } = require('../config/testConfig');

class ProductService {
  constructor() {
    this.productId = null;
  }

  async createProduct(productData) {
    try {
      const response = await api.post('/products', productData, { headers: getHeaders(tokens.admin) });
      this.productId = response.data.product?.id || 'prod1';
      console.log('✅ Product - Created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Product - Create failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async updateProduct(id = '1', updates) {
    try {
      const response = await api.put(`/products/${id}`, updates, { headers: getHeaders(tokens.admin) });
      console.log('✅ Product - Updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Product - Update failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getAllProducts() {
    try {
      const response = await api.get('/products', { headers: getHeaders(tokens.customer) });
      console.log('✅ Products - Get all successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Products - Get all failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSingleProduct(id = '1') {
    try {
      const response = await api.get(`/products/${id}`, { headers: getHeaders(tokens.customer) });
      console.log('✅ Products - Get single successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Products - Get single failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteProduct(id = '1') {
    try {
      const response = await api.delete(`/products/${id}`, { headers: getHeaders(tokens.admin) });
      console.log('✅ Products - Delete successful:', response.data);
      this.productId = null;
      return response.data;
    } catch (error) {
      console.error('❌ Products - Delete failed:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new ProductService(); 