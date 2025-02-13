const users = require('./users.json');
const products = require('./products.json');
const carts = require('./carts.json');
const orders = require('./orders.json');

// Utility functions for users
const findUserById = (id) => users.users.find(user => user.id === id);
const findUserByEmail = (email) => users.users.find(user => user.email === email);
const findUserByUsername = (username) => users.users.find(user => user.username === username);

// Utility functions for products
const findProductById = (id) => products.products.find(product => product.id === id);
const findProductsByCategory = (category) => products.products.filter(product => product.category === category);
const findProductsBySeller = (sellerId) => products.products.filter(product => product.sellerId === sellerId);

// Utility functions for carts
const findCartByUserId = (userId) => carts.carts.find(cart => cart.userId === userId);
const findCartItemById = (cartId, itemId) => {
  const cart = carts.carts.find(cart => cart.id === cartId);
  return cart ? cart.items.find(item => item.id === itemId) : null;
};

// Utility functions for orders
const findOrderById = (id) => orders.orders.find(order => order.id === id);
const findOrdersByUserId = (userId) => orders.orders.filter(order => order.userId === userId);
const findOrdersByStatus = (status) => orders.orders.filter(order => order.status === status);

module.exports = {
  data: {
    users: users.users,
    products: products.products,
    carts: carts.carts,
    orders: orders.orders
  },
  users: {
    findById: findUserById,
    findByEmail: findUserByEmail,
    findByUsername: findUserByUsername
  },
  products: {
    findById: findProductById,
    findByCategory: findProductsByCategory,
    findBySeller: findProductsBySeller
  },
  carts: {
    findByUserId: findCartByUserId,
    findItemById: findCartItemById
  },
  orders: {
    findById: findOrderById,
    findByUserId: findOrdersByUserId,
    findByStatus: findOrdersByStatus
  }
}; 