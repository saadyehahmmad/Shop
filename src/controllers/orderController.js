const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

class OrderController {
  async getAllOrders(req, res) {
    try {
      let orders;
      // Admin and Seller can see all orders, customers can only see their own
      if (['Admin', 'Seller'].includes(req.user.role)) {
        orders = await Order.getAllOrders();
      } else {
        orders = await Order.findByUserId(req.user.id);
      }
      res.json({ orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  }

  async getOrderById(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user has permission to view this order
      if (order.userId !== req.user.id && !['Admin', 'Seller'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }

      res.json({ order });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ message: 'Error fetching order' });
    }
  }

  async createOrder(req, res) {
    try {
      // Only customers can create orders
      if (req.user.role !== 'Customer') {
        return res.status(403).json({ message: 'Only customers can create orders' });
      }

      // Get user's cart
      const cart = await Cart.findByUserId(req.user.id);
      if (!cart || !cart.items.length) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Verify stock availability for all items
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (!product || product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for product: ${product ? product.name : item.productId}`
          });
        }
      }

      // Create order (in a real application, this would be a transaction)
      const order = new Order();
      order.userId = req.user.id;
      order.items = cart.items;
      order.totalAmount = cart.totalAmount;
      order.status = 'Pending';
      order.createdAt = new Date().toISOString();
      order.updatedAt = new Date().toISOString();

      // Update product stock
      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        await product.updateStock(-item.quantity);
      }

      // Clear the cart
      await cart.clear();

      res.status(201).json({
        message: 'Order created successfully',
        order: order.toJSON()
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ message: 'Error creating order' });
    }
  }

  async cancelOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user has permission to cancel this order
      if (order.userId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to cancel this order' });
      }

      if (!order.canBeCancelled()) {
        return res.status(400).json({ message: 'Order cannot be cancelled' });
      }

      // Restore product stock
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        await product.updateStock(item.quantity);
      }

      await order.updateStatus('Cancelled');

      res.json({
        message: 'Order cancelled successfully',
        order: order.toJSON()
      });
    } catch (error) {
      console.error('Cancel order error:', error);
      res.status(500).json({ message: 'Error cancelling order' });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // Validate status
      const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      // Only Admin and Seller can update order status
      if (!['Admin', 'Seller'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized to update order status' });
      }

      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      await order.updateStatus(status);

      res.json({
        message: 'Order status updated successfully',
        order: order.toJSON()
      });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({ message: 'Error updating order status' });
    }
  }

  async getOrdersByStatus(req, res) {
    try {
      const { status } = req.params;
      const orders = await Order.findByStatus(status);

      // Filter orders based on user role
      const filteredOrders = ['Admin', 'Seller'].includes(req.user.role)
        ? orders
        : orders.filter(order => order.userId === req.user.id);

      res.json({ orders: filteredOrders });
    } catch (error) {
      console.error('Get orders by status error:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  }
}

module.exports = new OrderController(); 