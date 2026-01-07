import { projectService } from './service.js';
import { logger } from '../../utils/logger.js';

export const projectController = {
  async create(req, res, next) {
    try {
      const project = await projectService.create({
        ...req.body,
        ownerId: req.user.id,
      });
      res.status(201).json(project);
    } catch (error) {
      logger.error({ error }, 'Proje oluşturma hatası');
      next(error);
    }
  },
  
  async getById(req, res, next) {
    try {
      const project = await projectService.getById(req.params.id);
      if (!project) {
        return res.status(404).json({ error: 'Proje bulunamadı' });
      }
      res.json(project);
    } catch (error) {
      logger.error({ error }, 'Proje getirme hatası');
      next(error);
    }
  },
  
  async getAll(req, res, next) {
    try {
      const result = await projectService.getAll(req.query);
      res.json(result);
    } catch (error) {
      logger.error({ error }, 'Proje listesi hatası');
      next(error);
    }
  },
  
  async update(req, res, next) {
    try {
      const project = await projectService.update(req.params.id, req.body);
      res.json(project);
    } catch (error) {
      logger.error({ error }, 'Proje güncelleme hatası');
      next(error);
    }
  },
  
  async delete(req, res, next) {
    try {
      await projectService.delete(req.params.id);
      res.json({ message: 'Proje silindi' });
    } catch (error) {
      logger.error({ error }, 'Proje silme hatası');
      next(error);
    }
  },
  
  async addMember(req, res, next) {
    try {
      const project = await projectService.addMember(req.params.id, req.body.userId);
      res.json(project);
    } catch (error) {
      logger.error({ error }, 'Üye ekleme hatası');
      next(error);
    }
  },
  
  async removeMember(req, res, next) {
    try {
      const project = await projectService.removeMember(req.params.id, req.body.userId);
      res.json(project);
    } catch (error) {
      logger.error({ error }, 'Üye çıkarma hatası');
      next(error);
    }
  },
};

