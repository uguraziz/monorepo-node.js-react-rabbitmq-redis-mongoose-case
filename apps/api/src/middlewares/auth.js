import { verifyAccessToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token bulunamadı' });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    logger.error({ error }, 'JWT doğrulama hatası');
    return res.status(401).json({ error: 'Geçersiz token' });
  }
};

