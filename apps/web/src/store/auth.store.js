import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (user, accessToken, refreshToken) => {
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
        
        localStorage.setItem('auth', JSON.stringify({
          user,
          accessToken,
          refreshToken,
        }));
      },
      
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        
        localStorage.removeItem('auth');
      },
      
      updateTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
        });
        
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        localStorage.setItem('auth', JSON.stringify({
          ...auth,
          accessToken,
          refreshToken,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

