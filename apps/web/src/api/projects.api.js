import apiClient from './client.js';

export const projectsApi = {
  async getAll(query = {}) {
    const params = new URLSearchParams(query);
    return apiClient(`/api/projects?${params.toString()}`);
  },
  
  async getById(id) {
    return apiClient(`/api/projects/${id}`);
  },
  
  async create(data) {
    return apiClient('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  async update(id, data) {
    return apiClient(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  async delete(id) {
    return apiClient(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  },
  
  async addMember(projectId, userId) {
    return apiClient(`/api/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
  
  async removeMember(projectId, userId) {
    return apiClient(`/api/projects/${projectId}/members`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  },
};

