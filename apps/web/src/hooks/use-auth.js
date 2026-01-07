import { useAuthStore } from '../store/auth.store.js';
import { authApi } from '../api/auth.api.js';

export const useAuth = () => {
  const { user, accessToken, isAuthenticated, setAuth, clearAuth, updateTokens } = useAuthStore();
  
  const login = async (email, otp) => {
    try {
      const response = await authApi.verifyOTP(email, otp);
      setAuth(response.user, response.accessToken, response.refreshToken);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}');
      if (auth.refreshToken) {
        await authApi.logout(auth.refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };
  
  const requestOTP = async (email) => {
    return authApi.requestOTP(email);
  };
  
  return {
    user,
    accessToken,
    isAuthenticated,
    login,
    logout,
    requestOTP,
    updateTokens,
  };
};

