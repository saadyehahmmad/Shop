const jwt = require('jsonwebtoken');
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1] || req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { authenticateToken }; 