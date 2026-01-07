import { userService } from './service.js';
import { logger } from '../../utils/logger.js';

export const userController = {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);
      res.json(user);
    } catch (error) {
      logger.error({ error }, 'Profil getirme hatası');
      next(error);
    }
  },
  
  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);
      res.json(user);
    } catch (error) {
      logger.error({ error }, 'Profil güncelleme hatası');
      next(error);
    }
  },
  
  async getAllUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      logger.error({ error }, 'Kullanıcı listesi hatası');
      next(error);
    }
  },
};

