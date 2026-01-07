import { taskRepository } from './repository.js';
import { Task } from './repository.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';

export const taskService = {
  async create(data) {
    return taskRepository.create(data);
  },
  
  async getById(id) {
    return taskRepository.findById(id);
  },
  
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};
    
    if (query.projectId) {
      filter.projectId = query.projectId;
    }
    
    if (query.assigneeId) {
      filter.assigneeId = query.assigneeId;
    }
    
    if (query.status) {
      filter.status = query.status;
    }
    
    if (query.tag) {
      filter.tags = query.tag;
    }
    
    const mongooseQuery = taskRepository.findAll(filter);
    const [tasks, total] = await Promise.all([
      mongooseQuery.skip(skip).limit(limit).exec(),
      Task.countDocuments(filter),
    ]);
    
    return {
      data: tasks,
      meta: getPaginationMeta(page, limit, total),
    };
  },
  
  async update(id, data) {
    return taskRepository.update(id, data);
  },
  
  async delete(id) {
    return taskRepository.delete(id);
  },
};

