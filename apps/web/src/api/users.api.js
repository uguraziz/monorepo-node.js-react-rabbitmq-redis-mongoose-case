import apiClient from './client.js';

export const usersApi = {
  async getAll() {
    return apiClient('/api/users');
  },
};

