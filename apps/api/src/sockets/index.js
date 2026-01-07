import { getIO } from '../loaders/socket.js';
import { loadRooms } from './rooms.js';
import { loadTaskHandlers } from './handlers/tasks.js';
import { loadNotificationHandlers } from './handlers/notifications.js';

export const initializeSockets = () => {
  const io = getIO();
  const nsp = io.of('/realtime');
  
  nsp.on('connection', (socket) => {
    loadRooms(socket);
    loadTaskHandlers(socket);
    loadNotificationHandlers(socket);
  });
};

