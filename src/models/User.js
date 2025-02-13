const { EntitySchema } = require("typeorm");
const bcrypt = require("bcrypt");
const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super();
    this.id = undefined;
    this.email = '';
    this.password = '';
    this.username = '';
    this.role = 'Customer'; // Default role
  }

  static getEntitySchema() {
    return new EntitySchema({
      name: "User",
      target: User,
      columns: {
        id: {
          primary: true,
          type: "int",
          generated: true
        },
        email: {
          type: "varchar",
          length: 255,
          unique: true
        },
        username: {
          type: "varchar",
          length: 255
        },
        password: {
          type: "varchar",
          length: 255
        },
        role: {
          type: "varchar",
          length: 50
        }
      }
    });
  }

  static async findByEmail(email) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.findOne({ where: { email } });
      } else {
        return this.getMockData().find(user => user.email === email);
      }
    } catch (error) {
      console.error('Error in User.findByEmail:', error);
      throw error;
    }
  }

  static async findByUsername(username) {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.findOne({ where: { username } });
      } else {
        return this.getMockData().find(user => user.username === username);
      }
    } catch (error) {
      console.error('Error in User.findByUsername:', error);
      throw error;
    }
  }

  static async authenticate(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    } catch (error) {
      console.error('Error in User.authenticate:', error);
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const repository = await this.getRepository();
      if (repository) {
        return await repository.find();
      } else {
        return this.getMockData();
      }
    } catch (error) {
      console.error('Error in User.getAllUsers:', error);
      throw error;
    }
  }

  async validatePassword(password) {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (error) {
      console.error('Error in User.validatePassword:', error);
      throw error;
    }
  }

  async hashPassword() {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      console.error('Error in User.hashPassword:', error);
      throw error;
    }
  }

  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;
