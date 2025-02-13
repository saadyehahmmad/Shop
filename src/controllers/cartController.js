const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await Cart.findByUserId(req.user.id);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      res.json({ cart });
    } catch (error) {
      console.error('Get cart error:', error);
      res.status(500).json({ message: 'Error fetching cart' });
    }
  }

  async addToCart(req, res) {
    try {
      const { productId, quantity } = req.body;

      // Validate input
      if (!productId || !quantity || quantity < 1) {
        return res.status(400).json({ message: 'Valid product ID and quantity are required' });
      }

      // Get product details
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check stock
      if (!product.isInStock() || product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      // Get or create cart
      let cart = await Cart.findByUserId(req.user.id);
      if (!cart) {
        cart = new Cart();
        cart.userId = req.user.id;
        cart.items = [];
        cart.totalAmount = 0;
      }

      // Add item to cart
      await cart.addItem(product, quantity);

      res.json({
        message: 'Item added to cart successfully',
        cart: cart.toJSON()
      });
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ message: 'Error adding item to cart' });
    }
  }

  async updateCartItem(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity < 0) {
        return res.status(400).json({ message: 'Valid quantity is required' });
      }

      const cart = await Cart.findByUserId(req.user.id);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // If quantity is 0, remove item
      if (quantity === 0) {
        await cart.removeItem(id);
      } else {
        await cart.updateItemQuantity(id, quantity);
      }

      res.json({
        message: 'Cart updated successfully',
        cart: cart.toJSON()
      });
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({ message: 'Error updating cart' });
    }
  }

  async removeFromCart(req, res) {
    try {
      const { id } = req.params;
      const cart = await Cart.findByUserId(req.user.id);

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      await cart.removeItem(id);

      res.json({
        message: 'Item removed from cart successfully',
        cart: cart.toJSON()
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ message: 'Error removing item from cart' });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await Cart.findByUserId(req.user.id);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.clear();

      res.json({
        message: 'Cart cleared successfully',
        cart: cart.toJSON()
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ message: 'Error clearing cart' });
    }
  }
}

module.exports = new CartController(); 