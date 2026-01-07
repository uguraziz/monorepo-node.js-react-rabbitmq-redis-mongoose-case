import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store.js';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

