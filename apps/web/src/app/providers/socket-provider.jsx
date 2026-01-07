import { useEffect } from 'react';
import { getSocket, disconnectSocket } from '../../lib/socket.js';
import { useAuthStore } from '../../store/auth.store.js';

export const SocketProvider = ({ children }) => {
  const { accessToken, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      const socket = getSocket(accessToken);
      
      socket.on('connect', () => {
        console.log('Socket connected');
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
      
      return () => {
        disconnectSocket();
      };
    }
  }, [isAuthenticated, accessToken]);
  
  return <>{children}</>;
};

