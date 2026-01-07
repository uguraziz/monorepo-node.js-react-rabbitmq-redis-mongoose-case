import apiClient from './client.js';

export const authApi = {
  async requestOTP(email) {
    return apiClient('/api/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  
  async verifyOTP(email, otp) {
    return apiClient('/api/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },
  
  async refreshToken(refreshToken) {
    return apiClient('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
  
  async logout(refreshToken) {
    return apiClient('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
  
  async logoutAll() {
    return apiClient('/api/auth/logout-all', {
      method: 'POST',
    });
  },
};

