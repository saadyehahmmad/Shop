require('dotenv').config();
const app = require('./src/app');
const config = require('./src/config/config');
const { createConnection } = require('typeorm');

const port = config.port || 3000;

// Database configuration
const dbConfig = {
  type: "postgres", // or your database type
  url: config.dbUri,
  synchronize: true,
  logging: false,
  entities: [
    require('./src/models/User').getEntitySchema(),
    require('./src/models/Product').getEntitySchema(),
    require('./src/models/Order').getEntitySchema(),
    require('./src/models/Cart').getEntitySchema()
  ]
};

// Start server function
async function startServer() {
  try {
    // Try to connect to database
    try {
      await createConnection(dbConfig);
      console.log('Database connected successfully');
    } catch (error) {
      console.log('Database connection failed, using mock data:', error.message);
    }

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`API Documentation available at http://localhost:${port}/api/docs`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
startServer(); 