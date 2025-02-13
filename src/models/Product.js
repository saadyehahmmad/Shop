const { EntitySchema } = require("typeorm");
const BaseModel = require("./BaseModel");

class Product extends BaseModel {
  constructor() {
    super();
    this.id = undefined;
    this.name = '';
    this.price = 0;
    this.stock = 0;
    this.description = '';
    this.category = '';
    this.sellerId = '';
  }

  static getEntitySchema() {
    return new EntitySchema({
      name: "Product",
      target: Product,
      columns: {
        id: {
          primary: true,
          type: "int",
          generated: true
        },
        name: {
          type: "varchar",
          length: 255
        },
        price: {
          type: "decimal"
        },
        stock: {
          type: "int"
        },
        description: {
          type: "text"
        },
        category: {
          type: "varchar",
          length: 100
        },
        sellerId: {
          type: "varchar"
        }
      }
    });
  }

  static async findByCategory(category) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.find({ where: { category } });
      } else {
        return this.getMockData().filter(product => product.category === category);
      }
    } catch (error) {
      console.error('Error in Product.findByCategory:', error);
      throw error;
    }
  }

  static async findBySeller(sellerId) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.find({ where: { sellerId } });
      } else {
        return this.getMockData().filter(product => product.sellerId === sellerId);
      }
    } catch (error) {
      console.error('Error in Product.findBySeller:', error);
      throw error;
    }
  }

  static async getAllProducts() {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.find();
      } else {
        return this.getMockData();
      }
    } catch (error) {
      console.error('Error in Product.getAllProducts:', error);
      throw error;
    }
  }

  isInStock() {
    return this.stock > 0;
  }

  async updateStock(quantity) {
    try {
      if (this.stock + quantity < 0) {
        throw new Error('Insufficient stock');
      }
      this.stock += quantity;
      return await this.save();
    } catch (error) {
      console.error('Error in Product.updateStock:', error);
      throw error;
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      stock: this.stock,
      description: this.description,
      category: this.category,
      sellerId: this.sellerId
    };
  }
}

module.exports = Product;
