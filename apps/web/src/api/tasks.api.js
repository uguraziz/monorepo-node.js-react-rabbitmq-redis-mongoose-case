import apiClient from './client.js';

export const tasksApi = {
  async getAll(query = {}) {
    const params = new URLSearchParams(query);
    return apiClient(`/api/tasks?${params.toString()}`);
  },
  
  async getById(id) {
    return apiClient(`/api/tasks/${id}`);
  },
  
  async create(data) {
    return apiClient('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async update(id, data) {
    return apiClient(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id) {
    return apiClient(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

