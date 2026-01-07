import { logger } from '../utils/logger.js';

export const loadRooms = (socket) => {
  socket.on('room:join', (room) => {
    socket.join(room);
    logger.info({ userId: socket.user.id, room }, 'Odaya katıldı');
  });
  
  socket.on('room:leave', (room) => {
    socket.leave(room);
    logger.info({ userId: socket.user.id, room }, 'Odadan ayrıldı');
  });
};

