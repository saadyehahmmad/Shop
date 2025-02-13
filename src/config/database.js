const { createConnection } = require('typeorm');
const config = require('./config');

const dbConfig = {
  type: "postgres",
  url: config.dbUri,
  synchronize: true, // Set to false in production
  logging: config.nodeEnv === 'development',
  entities: [
    require('../models/User').getEntitySchema(),
    require('../models/Product').getEntitySchema(),
    require('../models/Order').getEntitySchema(),
    require('../models/Cart').getEntitySchema()
  ]
};

async function initializeDatabase() {
  try {
    const connection = await createConnection(dbConfig);
    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    return null;
  }
}

module.exports = {
  dbConfig,
  initializeDatabase
};
