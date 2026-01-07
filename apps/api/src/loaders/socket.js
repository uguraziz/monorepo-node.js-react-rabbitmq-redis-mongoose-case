import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';
import { logger } from '../utils/logger.js';

let io = null;

export const loadSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
      credentials: true,
    },
    path: '/socket.io',
  });
  
  const nsp = io.of('/realtime');
  
  nsp.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Token gerekli'));
      }
      
      const decoded = verifyAccessToken(token);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error('Geçersiz token'));
    }
  });
  
  nsp.on('connection', (socket) => {
    logger.info({ userId: socket.user.id }, 'Socket bağlantısı kuruldu');
    
    socket.on('disconnect', () => {
      logger.info({ userId: socket.user.id }, 'Socket bağlantısı kesildi');
    });
  });
  
  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io henüz başlatılmadı');
  }
  return io;
};

