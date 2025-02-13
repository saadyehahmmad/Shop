const { getConnection } = require('typeorm');
const mockData = require('../data');

class BaseModel {
  static getEntitySchema() {
    throw new Error('getEntitySchema must be implemented by derived classes');
  }

  static async getRepository() {
    try {
      const connection = getConnection();
      if (connection && connection.isConnected) {
        const repository = connection.getRepository(this.getEntitySchema());
        return repository;
      }
      return null;
    } catch (error) {
      console.error(`Error getting repository for ${this.name}:`, error);
      return null;
    }
  }

  static getMockData() {
    const modelName = this.name.toLowerCase() + 's';
    return mockData[modelName] || [];
  }

  static async findById(id) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.findOne({ where: { id } });
      } else {
        return this.getMockData().find(item => item.id === id);
      }
    } catch (error) {
      console.error(`Error in ${this.name}.findById:`, error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.find();
      } else {
        return this.getMockData();
      }
    } catch (error) {
      console.error(`Error in ${this.name}.findAll:`, error);
      throw error;
    }
  }

  async save() {
    try {
      const repository = await this.constructor.getRepository();
      if (repository) {
        return await repository.save(this);
      } else {
        const mockDataArray = this.constructor.getMockData();
        const index = mockDataArray.findIndex(item => item.id === this.id);
        
        if (index === -1) {
          this.id = (mockDataArray.length + 1).toString();
          mockDataArray.push(this);
        } else {
          mockDataArray[index] = this;
        }
        
        return this;
      }
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.save:`, error);
      throw error;
    }
  }

  async remove() {
    try {
      const repository = await this.constructor.getRepository();
      if (repository) {
        return await repository.remove(this);
      } else {
        const mockDataArray = this.constructor.getMockData();
        const index = mockDataArray.findIndex(item => item.id === this.id);
        
        if (index !== -1) {
          mockDataArray.splice(index, 1);
        }
        
        return true;
      }
    } catch (error) {
      console.error(`Error in ${this.constructor.name}.remove:`, error);
      throw error;
    }
  }

  static async create(data) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        const entity = repository.create(data);
        return await repository.save(entity);
      } else {
        const instance = new this();
        Object.assign(instance, data);
        return await instance.save();
      }
    } catch (error) {
      console.error(`Error in ${this.name}.create:`, error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const entity = await this.findById(id);
      if (!entity) {
        throw new Error(`${this.name} not found`);
      }

      Object.assign(entity, data);
      return await entity.save();
    } catch (error) {
      console.error(`Error in ${this.name}.update:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const entity = await this.findById(id);
      if (!entity) {
        throw new Error(`${this.name} not found`);
      }

      return await entity.remove();
    } catch (error) {
      console.error(`Error in ${this.name}.delete:`, error);
      throw error;
    }
  }

  toJSON() {
    return { ...this };
  }
}

module.exports = BaseModel; 