import { User } from '../auth/repository.js';

export const userRepository = {
  async findById(id) {
    return User.findById(id).select('-password');
  },
  
  async findAll(query = {}) {
    return User.find(query).select('-password');
  },
  
  async update(id, data) {
    return User.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true }).select('-password');
  },
};

