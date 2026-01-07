import { userRepository } from './repository.js';

export const userService = {
  async getProfile(userId) {
    return userRepository.findById(userId);
  },
  
  async updateProfile(userId, data) {
    return userRepository.update(userId, data);
  },
  
  async getAllUsers() {
    return userRepository.findAll();
  },
};

