import { io } from 'socket.io-client';
import { config } from '../config/env.js';

let socket = null;

export const getSocket = (token) => {
  if (!socket) {
    socket = io(`${config.socketUrl}/realtime`, {
      path: '/socket.io',
      transports: ['websocket'],
      auth: {
        token,
      },
    });
  }
  
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

