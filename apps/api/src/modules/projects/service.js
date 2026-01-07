import { projectRepository } from './repository.js';
import { Project } from './repository.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';

export const projectService = {
  async create(data) {
    return projectRepository.create(data);
  },
  
  async getById(id) {
    return projectRepository.findById(id);
  },
  
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};
    
    if (query.ownerId) {
      filter.ownerId = query.ownerId;
    }
    
    if (query.memberId) {
      filter.members = query.memberId;
    }
    
    const mongooseQuery = projectRepository.findAll(filter);
    const [projects, total] = await Promise.all([
      mongooseQuery.skip(skip).limit(limit).exec(),
      Project.countDocuments(filter),
    ]);
    
    return {
      data: projects,
      meta: getPaginationMeta(page, limit, total),
    };
  },
  
  async update(id, data) {
    return projectRepository.update(id, data);
  },
  
  async delete(id) {
    return projectRepository.delete(id);
  },
  
  async addMember(projectId, userId) {
    return projectRepository.addMember(projectId, userId);
  },
  
  async removeMember(projectId, userId) {
    return projectRepository.removeMember(projectId, userId);
  },
};

