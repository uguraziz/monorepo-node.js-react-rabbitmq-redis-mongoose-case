export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Kimlik doğrulama gerekli' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Yetki yetersiz' });
    }
    
    next();
  };
};

export const requireMember = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Kimlik doğrulama gerekli' });
  }
  
  if (req.user.role !== 'admin' && req.user.role !== 'member') {
    return res.status(403).json({ error: 'Yetki yetersiz' });
  }
  
  next();
};

