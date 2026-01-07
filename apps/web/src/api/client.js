import { config } from '../config/env.js';

const getAuthToken = () => {
  const authStore = JSON.parse(localStorage.getItem('auth') || '{}');
  return authStore.accessToken;
};

const apiClient = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      const authStore = JSON.parse(localStorage.getItem('auth') || '{}');
      if (authStore.refreshToken) {
        try {
          const refreshResponse = await fetch(`${config.apiUrl}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: authStore.refreshToken }),
          });
          
          if (refreshResponse.ok) {
            const { accessToken, refreshToken: newRefreshToken } = await refreshResponse.json();
            localStorage.setItem('auth', JSON.stringify({
              ...authStore,
              accessToken,
              refreshToken: newRefreshToken,
            }));
            
            headers.Authorization = `Bearer ${accessToken}`;
            const retryResponse = await fetch(`${config.apiUrl}${endpoint}`, {
              ...options,
              headers,
            });
            return retryResponse.json();
          }
        } catch (error) {
          localStorage.removeItem('auth');
          window.location.href = '/login';
          throw error;
        }
      } else {
        localStorage.removeItem('auth');
        window.location.href = '/login';
      }
    }
    
    const error = await response.json().catch(() => ({ error: 'Bir hata oluştu' }));
    throw new Error(error.error || 'Bir hata oluştu');
  }
  
  return response.json();
};

export default apiClient;

