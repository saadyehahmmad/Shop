const Product = require('../models/Product');

class ProductController {
  async getAllProducts(req, res) {
    try {
      const products = await Product.getAllProducts();
      res.json({ products });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ product });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ message: 'Error fetching product' });
    }
  }

  async createProduct(req, res) {
    try {
      const { name, price, stock, description, category } = req.body;

      // Validate input
      if (!name || !price || !stock || !description || !category) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // In a real application, you would save to database here
      // For now, we'll just return success
      res.status(201).json({
        message: 'Product created successfully',
        product: {
          name,
          price,
          stock,
          description,
          category,
          sellerId: req.user.id
        }
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ message: 'Error creating product' });
    }
  }

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if user has permission to update this product
      if (product.sellerId !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized to update this product' });
      }

      // In a real application, you would update the database here
      res.json({
        message: 'Product updated successfully',
        product: {
          ...product,
          ...updates
        }
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ message: 'Error updating product' });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if user has permission to delete this product
      if (product.sellerId !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized to delete this product' });
      }

      // In a real application, you would delete from database here
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: 'Error deleting product' });
    }
  }

  async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const products = await Product.findByCategory(category);
      res.json({ products });
    } catch (error) {
      console.error('Get products by category error:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  }

  async getProductsBySeller(req, res) {
    try {
      const { sellerId } = req.params;
      const products = await Product.findBySeller(sellerId);
      res.json({ products });
    } catch (error) {
      console.error('Get products by seller error:', error);
      res.status(500).json({ message: 'Error fetching products' });
    }
  }

  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Check if user has permission to update stock
      if (product.sellerId !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized to update stock' });
      }

      await product.updateStock(quantity);
      res.json({
        message: 'Stock updated successfully',
        product: product.toJSON()
      });
    } catch (error) {
      console.error('Update stock error:', error);
      res.status(500).json({ message: error.message || 'Error updating stock' });
    }
  }
}

module.exports = new ProductController(); 