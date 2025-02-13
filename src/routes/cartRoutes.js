const express = require('express');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management endpoints
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get current user's cart.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's cart.
 */
router.get('/', authenticateToken, (req, res) => {
  // In a real application, fetch cart information from the database
  res.json({ cart: [] });
});

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the cart.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added to cart successfully.
 */
router.post('/add', authenticateToken, (req, res) => {
  const { productId, quantity } = req.body;
  // Logic to add product to user's cart
  res.status(201).json({ message: 'Product added to cart', productId, quantity });
});

/**
 * @swagger
 * /cart/update/{id}:
 *   put:
 *     summary: Update a cart item's quantity.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated successfully.
 */
router.put('/update/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  // Logic to update the quantity of a cart item
  res.json({ message: 'Cart item updated', cartItemId: id, quantity });
});

/**
 * @swagger
 * /cart/remove/{id}:
 *   delete:
 *     summary: Remove a product from the cart.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the cart item to remove.
 *     responses:
 *       200:
 *         description: Cart item removed successfully.
 */
router.delete('/remove/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  // Logic to remove the cart item
  res.json({ message: `Cart item with id ${id} removed` });
});

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the entire cart.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully.
 */
router.delete('/clear', authenticateToken, (req, res) => {
  // Logic to clear the user's cart
  res.json({ message: 'Cart cleared' });
});

module.exports = router; 