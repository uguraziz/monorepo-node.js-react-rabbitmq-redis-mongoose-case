import { logger } from '../utils/logger.js';
import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  logger.error({ err, req: { method: req.method, url: req.url } }, 'Hata oluştu');
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validasyon hatası',
      message: err.message,
    });
  }
  
  if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Kimlik doğrulama hatası',
      message: err.message,
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Geçersiz ID formatı',
    });
  }
  
  const statusCode = err.statusCode || 500;
  const message = config.nodeEnv === 'production' 
    ? 'Sunucu hatası' 
    : err.message;
  
  res.status(statusCode).json({
    error: message,
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
};

