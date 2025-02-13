require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../src/config/config');
const { tokens } = require('./config/testConfig');
const authService = require('./services/authService');
const productService = require('./services/productService');
const cartService = require('./services/cartService');
const orderService = require('./services/orderService');

// Base URL for the API
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Important for CSRF
});

// Global tokens for testing
let customerToken = '';
// Generate an admin token manually for endpoints requiring Admin/Seller role
const adminToken = jwt.sign({ username: 'adminTest', role: 'Admin' }, jwtSecret, { expiresIn: '1h' });

// Initialize admin token
tokens.admin = jwt.sign(
  { username: 'adminTest', role: 'Admin' },
  process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
  { expiresIn: '1h' }
);

// First get CSRF token
async function getCsrfToken() {
  try {
    const response = await api.get('/api/csrf-token');
    return response.data.csrfToken;
  } catch (error) {
    console.error('Failed to get CSRF token:', error.message);
    return null;
  }
}

// Helper function to get headers
const getHeaders = async (token) => {
  const csrfToken = await getCsrfToken();
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
    'CSRF-Token': csrfToken
  };
};

// Test functions
async function testRegister(userData) {
  try {
    const headers = await getHeaders();
    const response = await api.post('/api/auth/register', userData, { headers });
    console.log('✅ Register successful:', response.data);
  } catch (error) {
    console.error('❌ Register failed:', error.response?.data || error.message);
  }
}

async function testLogin(username, password) {
  try {
    const response = await api.post('/api/auth/login', { username, password }, { headers: await getHeaders(customerToken) });
    customerToken = response.data.token;
    console.log('✅ Login successful. Token:', customerToken);
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }
}

async function testProfile() {
  try {
    const response = await api.get('/api/auth/profile', { headers: await getHeaders(customerToken) });
    console.log('✅ Profile:', response.data);
  } catch (error) {
    console.error('❌ Fetching profile failed:', error.response?.data || error.message);
  }
}

async function testGetAllProducts() {
  try {
    const response = await api.get('/api/products', { headers: await getHeaders(customerToken) });
    console.log('✅ Products:', response.data);
  } catch (error) {
    console.error('❌ Get Products failed:', error.response?.data || error.message);
  }
}

async function testGetSingleProduct(productId) {
  try {
    const response = await api.get(`/api/products/${productId}`, { headers: await getHeaders(customerToken) });
    console.log(`✅ Product ${productId}:`, response.data);
  } catch (error) {
    console.error(`❌ Get Product ${productId} failed:`, error.response?.data || error.message);
  }
}

async function testCreateProduct(productData) {
  try {
    const response = await api.post('/api/products', productData, { headers: await getHeaders(adminToken) });
    console.log('✅ Product created:', response.data);
  } catch (error) {
    console.error('❌ Create Product failed:', error.response?.data || error.message);
  }
}

async function testUpdateProduct(productId, updates) {
  try {
    const response = await api.put(`/api/products/${productId}`, updates, { headers: await getHeaders(adminToken) });
    console.log('✅ Product updated:', response.data);
  } catch (error) {
    console.error('❌ Update Product failed:', error.response?.data || error.message);
  }
}

async function testDeleteProduct(productId) {
  try {
    const response = await api.delete(`/api/products/${productId}`, { headers: await getHeaders(adminToken) });
    console.log('✅ Product deleted:', response.data);
  } catch (error) {
    console.error('❌ Delete Product failed:', error.response?.data || error.message);
  }
}

async function testAddToCart(productId, quantity) {
  try {
    const response = await api.post('/api/cart/add', { productId, quantity }, { headers: await getHeaders(customerToken) });
    console.log('✅ Added to cart:', response.data);
  } catch (error) {
    console.error('❌ Add to Cart failed:', error.response?.data || error.message);
  }
}

async function testGetCart() {
  try {
    const response = await api.get('/api/cart', { headers: await getHeaders(customerToken) });
    console.log('✅ Cart:', response.data);
  } catch (error) {
    console.error('❌ Get Cart failed:', error.response?.data || error.message);
  }
}

async function testUpdateCartItem(cartItemId, quantity) {
  try {
    const response = await api.put(`/api/cart/update/${cartItemId}`, { quantity }, { headers: await getHeaders(customerToken) });
    console.log('✅ Cart item updated:', response.data);
  } catch (error) {
    console.error('❌ Update Cart item failed:', error.response?.data || error.message);
  }
}

async function testRemoveFromCart(cartItemId) {
  try {
    const response = await api.delete(`/api/cart/remove/${cartItemId}`, { headers: await getHeaders(customerToken) });
    console.log('✅ Removed from cart:', response.data);
  } catch (error) {
    console.error('❌ Remove from Cart failed:', error.response?.data || error.message);
  }
}

async function testClearCart() {
  try {
    const response = await api.delete('/api/cart/clear', { headers: await getHeaders(customerToken) });
    console.log('✅ Cart cleared:', response.data);
  } catch (error) {
    console.error('❌ Clear Cart failed:', error.response?.data || error.message);
  }
}

async function testGetOrders() {
  try {
    const response = await api.get('/api/orders', { headers: await getHeaders(customerToken) });
    console.log('✅ Orders:', response.data);
  } catch (error) {
    console.error('❌ Get Orders failed:', error.response?.data || error.message);
  }
}

async function testGetSingleOrder(orderId) {
  try {
    const response = await api.get(`/api/orders/${orderId}`, { headers: await getHeaders(customerToken) });
    console.log(`✅ Order ${orderId}:`, response.data);
  } catch (error) {
    console.error(`❌ Get Order ${orderId} failed:`, error.response?.data || error.message);
  }
}

async function testCreateOrder(orderData) {
  try {
    const response = await api.post('/api/orders', orderData, { headers: await getHeaders(customerToken) });
    console.log('✅ Order created:', response.data);
  } catch (error) {
    console.error('❌ Create Order failed:', error.response?.data || error.message);
  }
}

async function testCancelOrder(orderId) {
  try {
    const response = await api.put(`/api/orders/${orderId}/cancel`, {}, { headers: await getHeaders(customerToken) });
    console.log('✅ Order cancelled:', response.data);
  } catch (error) {
    console.error('❌ Cancel Order failed:', error.response?.data || error.message);
  }
}

async function testUpdateOrderStatus(orderId, status) {
  try {
    const response = await api.put(`/api/orders/${orderId}/status`, { status }, { headers: await getHeaders(adminToken) });
    console.log('✅ Order status updated:', response.data);
  } catch (error) {
    console.error('❌ Update Order Status failed:', error.response?.data || error.message);
  }
}

async function runAuthTests() {
  console.log('\n🔐 Running Authentication Tests...');
  try {
    // Register a new user
    const userData = {
      username: 'testuser',
      password: 'testpass123',
      email: 'test@example.com',
      role: 'Customer'
    };
    await authService.register(userData);
    
    // Login and store token
    const token = await authService.login(userData.username, userData.password);
    tokens.customer = token;
    console.log('Token received:', token);
    
    // Get profile
    const profile = await authService.getProfile();
    console.log('Profile data:', profile);
    
    return true;
  } catch (error) {
    console.error('Auth tests failed:', error.message);
    return false;
  }
}

async function runProductTests() {
  console.log('\n📦 Running Product Tests...');
  try {
    // Create a new product
    const productData = {
      name: 'Test Product',
      price: 99.99,
      description: 'A test product',
      category: 'Test',
      stock: 100
    };
    const newProduct = await productService.createProduct(productData);
    
    // Update the product
    if (newProduct.product?.id) {
      await productService.updateProduct(newProduct.product.id, {
        price: 89.99,
        stock: 90
      });
    }
    
    // Get all products
    const products = await productService.getAllProducts();
    console.log('Total products:', products.length);
    
    // Get single product
    if (newProduct.product?.id) {
      const singleProduct = await productService.getSingleProduct(newProduct.product.id);
      console.log('Single product:', singleProduct);
      
      // Delete the product
      await productService.deleteProduct(newProduct.product.id);
    }
    
    return true;
  } catch (error) {
    console.error('Product tests failed:', error.message);
    return false;
  }
}

async function runCartTests() {
  console.log('\n🛒 Running Cart Tests...');
  try {
    // Add item to cart
    await cartService.addToCart('1', 2);
    
    // Get cart contents
    const cart = await cartService.getCart();
    console.log('Cart contents:', cart);
    
    // Update and remove items if cart is not empty
    if (cart.items && cart.items.length > 0) {
      const itemId = cart.items[0].id;
      await cartService.updateCartItem(itemId, 3);
      await cartService.removeFromCart(itemId);
    }
    
    // Clear cart
    await cartService.clearCart();
    
    return true;
  } catch (error) {
    console.error('Cart tests failed:', error.message);
    return false;
  }
}

async function runOrderTests() {
  console.log('\n📝 Running Order Tests...');
  try {
    // Create a new order
    const orderData = {
      items: [{ productId: '1', quantity: 1 }]
    };
    const newOrder = await orderService.createOrder(orderData);
    
    if (newOrder.order?.id) {
      // Get all orders
      const orders = await orderService.getOrders();
      console.log('Total orders:', orders.length);
      
      // Get single order
      const singleOrder = await orderService.getSingleOrder(newOrder.order.id);
      console.log('Single order:', singleOrder);
      
      // Update order status
      await orderService.updateOrderStatus(newOrder.order.id, 'Processing');
      
      // Cancel order
      await orderService.cancelOrder(newOrder.order.id);
    }
    
    return true;
  } catch (error) {
    console.error('Order tests failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('=== Starting API Tests ===');
  
  try {
    // Run auth tests first and proceed only if successful
    const authSuccess = await runAuthTests();
    if (!authSuccess) {
      throw new Error('Authentication tests failed');
    }
    
    // Run other tests in parallel
    await Promise.all([
      runProductTests(),
      runCartTests(),
      runOrderTests()
    ]);
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
  
  console.log('\n=== API Tests Completed ===');
}

// Run all tests
runAllTests();
