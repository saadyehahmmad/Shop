require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  dbUri: process.env.DB_URI || 'mongodb://localhost:27017/shop',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key'
}; 