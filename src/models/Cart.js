const { EntitySchema } = require("typeorm");
const BaseModel = require("./BaseModel");
const Product = require("./Product");

class Cart extends BaseModel {
  constructor() {
    super();
    this.id = undefined;
    this.userId = '';
    this.items = [];
    this.totalAmount = 0;
  }

  static getEntitySchema() {
    return new EntitySchema({
      name: "Cart",
      target: Cart,
      columns: {
        id: {
          primary: true,
          type: "int",
          generated: true
        },
        userId: {
          type: "varchar"
        },
        items: {
          type: "json"
        },
        totalAmount: {
          type: "decimal",
          default: 0
        }
      }
    });
  }

  static async findByUserId(userId) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.findOne({ where: { userId } });
      } else {
        return this.getMockData().find(cart => cart.userId === userId);
      }
    } catch (error) {
      console.error('Error in Cart.findByUserId:', error);
      throw error;
    }
  }

  async addItem(productId, quantity) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (!product.isInStock() || product.stock < quantity) {
        throw new Error('Insufficient stock');
      }

      if (!this.items) {
        this.items = [];
      }

      const existingItem = this.items.find(item => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({
          productId,
          name: product.name,
          price: product.price,
          quantity
        });
      }

      this.calculateTotal();
      return await this.save();
    } catch (error) {
      console.error('Error in Cart.addItem:', error);
      throw error;
    }
  }

  async updateItemQuantity(productId, quantity) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      if (quantity > product.stock) {
        throw new Error('Insufficient stock');
      }

      const item = this.items.find(item => item.productId === productId);
      if (!item) {
        throw new Error('Item not found in cart');
      }

      if (quantity <= 0) {
        this.items = this.items.filter(item => item.productId !== productId);
      } else {
        item.quantity = quantity;
      }

      this.calculateTotal();
      return await this.save();
    } catch (error) {
      console.error('Error in Cart.updateItemQuantity:', error);
      throw error;
    }
  }

  async removeItem(productId) {
    try {
      this.items = this.items.filter(item => item.productId !== productId);
      this.calculateTotal();
      return await this.save();
    } catch (error) {
      console.error('Error in Cart.removeItem:', error);
      throw error;
    }
  }

  async clear() {
    try {
      this.items = [];
      this.totalAmount = 0;
      return await this.save();
    } catch (error) {
      console.error('Error in Cart.clear:', error);
      throw error;
    }
  }

  calculateTotal() {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      totalAmount: this.totalAmount
    };
  }
}

module.exports = Cart; 