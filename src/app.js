const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const routes = require('./routes'); // Central routes file
const { errorHandler } = require('./middlewares/errorHandler');
const { initializeDatabase } = require('./config/database');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));

// Initialize database
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
  // Continue with mock data if database initialization fails
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount all API routes under /api
app.use('/api', routes);

// Global error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

module.exports = app; 