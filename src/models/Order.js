const { EntitySchema } = require("typeorm");
const BaseModel = require("./BaseModel");

class Order extends BaseModel {
  constructor() {
    super();
    this.id = undefined;
    this.userId = '';
    this.items = [];
    this.totalAmount = 0;
    this.status = 'pending';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static getEntitySchema() {
    return new EntitySchema({
      name: "Order",
      target: Order,
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
          type: "decimal"
        },
        status: {
          type: "varchar",
          default: "pending"
        },
        createdAt: {
          type: "timestamp",
          createDate: true
        },
        updatedAt: {
          type: "timestamp",
          updateDate: true
        }
      }
    });
  }

  static async findByUserId(userId) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.find({ 
          where: { userId },
          order: { createdAt: "DESC" }
        });
      } else {
        return this.getMockData()
          .filter(order => order.userId === userId)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    } catch (error) {
      console.error('Error in Order.findByUserId:', error);
      throw error;
    }
  }

  static async findByStatus(status) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.find({ where: { status } });
      } else {
        return this.getMockData().filter(order => order.status === status);
      }
    } catch (error) {
      console.error('Error in Order.findByStatus:', error);
      throw error;
    }
  }

  static async getAllOrders() {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.find();
      } else {
        return this.getMockData();
      }
    } catch (error) {
      console.error('Error in Order.getAllOrders:', error);
      throw error;
    }
  }

  canBeCancelled() {
    return ['pending', 'processing'].includes(this.status);
  }

  canBeUpdated() {
    return ['pending', 'processing', 'shipped'].includes(this.status);
  }

  calculateTotal() {
    this.totalAmount = this.items.reduce((total, item) => 
      total + (item.price * item.quantity), 0
    );
    return this.totalAmount;
  }

  async updateStatus(newStatus) {
    try {
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(newStatus)) {
        throw new Error('Invalid order status');
      }
      this.status = newStatus;
      this.updatedAt = new Date();
      return await this.save();
    } catch (error) {
      console.error('Error in Order.updateStatus:', error);
      throw error;
    }
  }

  async cancel() {
    try {
      if (!this.canBeCancelled()) {
        throw new Error('Order cannot be cancelled in current status');
      }
      this.status = 'cancelled';
      this.updatedAt = new Date();
      return await this.save();
    } catch (error) {
      console.error('Error in Order.cancel:', error);
      throw error;
    }
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      items: this.items,
      totalAmount: this.totalAmount,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Order;
