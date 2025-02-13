const requireRole = (roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: `Access denied. Required role: ${roles.join(' or ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

module.exports = {
  requireRole
}; 