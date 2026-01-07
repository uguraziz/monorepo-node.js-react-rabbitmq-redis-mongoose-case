import { getIO } from '../../loaders/socket.js';
import { logger } from '../../utils/logger.js';

export const loadTaskHandlers = (socket) => {
  socket.on('task:subscribe', (projectId) => {
    const room = `project:${projectId}`;
    socket.join(room);
    logger.info({ userId: socket.user.id, room }, 'Görev odasına katıldı');
  });
  
  socket.on('task:unsubscribe', (projectId) => {
    const room = `project:${projectId}`;
    socket.leave(room);
    logger.info({ userId: socket.user.id, room }, 'Görev odasından ayrıldı');
  });
};

export const emitTaskUpdate = (projectId, data) => {
  const io = getIO();
  const nsp = io.of('/realtime');
  nsp.to(`project:${projectId}`).emit('task.updated', data);
};

