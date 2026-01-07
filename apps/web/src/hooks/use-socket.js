import { useEffect, useRef } from 'react';
import { getSocket, disconnectSocket } from '../lib/socket.js';
import { useAuthStore } from '../store/auth.store.js';

export const useSocket = (room, events = {}) => {
  const socketRef = useRef(null);
  const { accessToken } = useAuthStore();
  
  useEffect(() => {
    if (!accessToken) return;
    
    const socket = getSocket(accessToken);
    socketRef.current = socket;
    
    if (room) {
      socket.emit('room:join', room);
    }
    
    Object.entries(events).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
    
    return () => {
      Object.keys(events).forEach((event) => {
        socket.off(event);
      });
      
      if (room) {
        socket.emit('room:leave', room);
      }
    };
  }, [accessToken, room, events]);
  
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        disconnectSocket();
      }
    };
  }, []);
  
  return socketRef.current;
};

