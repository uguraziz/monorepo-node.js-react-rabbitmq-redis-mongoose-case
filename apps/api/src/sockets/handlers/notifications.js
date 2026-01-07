import { getIO } from '../../loaders/socket.js';
import { logger } from '../../utils/logger.js';

export const loadNotificationHandlers = (socket) => {
  socket.on('notification:subscribe', () => {
    const room = `user:${socket.user.id}`;
    socket.join(room);
    logger.info({ userId: socket.user.id, room }, 'Bildirim odasına katıldı');
  });
  
  socket.on('notification:unsubscribe', () => {
    const room = `user:${socket.user.id}`;
    socket.leave(room);
    logger.info({ userId: socket.user.id, room }, 'Bildirim odasından ayrıldı');
  });
};

export const emitNotification = (userId, data) => {
  const io = getIO();
  const nsp = io.of('/realtime');
  nsp.to(`user:${userId}`).emit('notification', data);
};

