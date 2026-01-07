import { commentService } from './service.js';
import { publishEvent } from '../../events/publisher.js';
import { logger } from '../../utils/logger.js';

export const commentController = {
  async create(req, res, next) {
    try {
      const comment = await commentService.create({
        ...req.body,
        userId: req.user.id,
      });
      
      await publishEvent('comments.added', 'comment.added', {
        commentId: comment._id,
        taskId: comment.taskId,
        userId: comment.userId,
      });
      
      res.status(201).json(comment);
    } catch (error) {
      logger.error({ error }, 'Yorum oluşturma hatası');
      next(error);
    }
  },
  
  async getById(req, res, next) {
    try {
      const comment = await commentService.getById(req.params.id);
      if (!comment) {
        return res.status(404).json({ error: 'Yorum bulunamadı' });
      }
      res.json(comment);
    } catch (error) {
      logger.error({ error }, 'Yorum getirme hatası');
      next(error);
    }
  },
  
  async getAll(req, res, next) {
    try {
      const result = await commentService.getAll(req.query);
      res.json(result);
    } catch (error) {
      logger.error({ error }, 'Yorum listesi hatası');
      next(error);
    }
  },
  
  async update(req, res, next) {
    try {
      const comment = await commentService.update(req.params.id, req.body);
      res.json(comment);
    } catch (error) {
      logger.error({ error }, 'Yorum güncelleme hatası');
      next(error);
    }
  },
  
  async delete(req, res, next) {
    try {
      await commentService.delete(req.params.id);
      res.json({ message: 'Yorum silindi' });
    } catch (error) {
      logger.error({ error }, 'Yorum silme hatası');
      next(error);
    }
  },
};

