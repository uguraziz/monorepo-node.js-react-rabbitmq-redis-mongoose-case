import { commentRepository } from './repository.js';
import { Comment } from './repository.js';
import { getPaginationParams, getPaginationMeta } from '../../utils/pagination.js';

export const commentService = {
  async create(data) {
    return commentRepository.create(data);
  },
  
  async getById(id) {
    return commentRepository.findById(id);
  },
  
  async getAll(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {};
    
    if (query.taskId) {
      filter.taskId = query.taskId;
    }
    
    const mongooseQuery = commentRepository.findAll(filter);
    const [comments, total] = await Promise.all([
      mongooseQuery.skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      Comment.countDocuments(filter),
    ]);
    
    return {
      data: comments,
      meta: getPaginationMeta(page, limit, total),
    };
  },
  
  async update(id, data) {
    return commentRepository.update(id, data);
  },
  
  async delete(id) {
    return commentRepository.delete(id);
  },
};

