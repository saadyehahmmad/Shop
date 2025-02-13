const express = require('express');
const { authenticateToken } = require('../middlewares/auth');
const { requireRole } = require('../middlewares/authorize');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (Admin & Seller) or user's orders (Customer)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/', authenticateToken, (req, res) => {
  // In a real application, if admin or seller, return all orders,
  // otherwise return orders of the authenticated customer
  if (req.user.role === 'Admin' || req.user.role === 'Seller') {
    res.json({ orders: [{ id: 'order1', status: 'Pending' }, { id: 'order2', status: 'Shipped' }] });
  } else {
    res.json({ orders: [{ id: 'order1', status: 'Pending', customer: req.user.username }] });
  }
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  // In a real application, retrieve the order from the database
  res.json({ order: { id, status: 'Pending', items: [] } });
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order (Customer only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       403:
 *         description: Forbidden
 */
router.post('/', authenticateToken, (req, res) => {
  // Only customers can create orders
  if (req.user.role !== 'Customer') {
    return res.status(403).json({ message: 'Only customers can create orders.' });
  }
  // In a real application, create the order in the database
  res.status(201).json({ message: 'Order created successfully', order: { id: 'order1' } });
});

/**
 * @swagger
 * /orders/{id}/cancel:
 *   put:
 *     summary: Cancel an order (Customer only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to cancel
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.put('/:id/cancel', authenticateToken, (req, res) => {
  // Only customers can cancel orders
  if (req.user.role !== 'Customer') {
    return res.status(403).json({ message: 'Only customers can cancel orders.' });
  }
  const { id } = req.params;
  // In a real application, cancel the order in the database
  res.json({ message: `Order ${id} cancelled successfully.` });
});

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (Admin & Seller only)
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered, Cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.put('/:id/status', authenticateToken, requireRole(['Admin', 'Seller']), (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  // In a real application, update the order status in the database
  res.json({ message: `Order ${id} status updated to ${status}` });
});

module.exports = router; 