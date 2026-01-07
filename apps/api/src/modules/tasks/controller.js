import { taskService } from './service.js';
import { publishEvent } from '../../events/publisher.js';
import { emitTaskUpdate } from '../../sockets/handlers/tasks.js';
import { logger } from '../../utils/logger.js';

export const taskController = {
  async create(req, res, next) {
    try {
      const task = await taskService.create({
        ...req.body,
        createdById: req.user.id,
      });
      
      await publishEvent('tasks.created', 'task.created', {
        taskId: task._id,
        projectId: task.projectId,
        assigneeId: task.assigneeId,
      });
      
      emitTaskUpdate(task.projectId, { type: 'created', task });
      
      res.status(201).json(task);
    } catch (error) {
      logger.error({ error }, 'Görev oluşturma hatası');
      next(error);
    }
  },
  
  async getById(req, res, next) {
    try {
      const task = await taskService.getById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Görev bulunamadı' });
      }
      res.json(task);
    } catch (error) {
      logger.error({ error }, 'Görev getirme hatası');
      next(error);
    }
  },
  
  async getAll(req, res, next) {
    try {
      const result = await taskService.getAll(req.query);
      res.json(result);
    } catch (error) {
      logger.error({ error }, 'Görev listesi hatası');
      next(error);
    }
  },
  
  async update(req, res, next) {
    try {
      const task = await taskService.update(req.params.id, req.body);
      
      if (req.body.status || req.body.assigneeId || req.body.title) {
        await publishEvent('tasks.updated', 'task.updated', {
          taskId: task._id,
          projectId: task.projectId,
          status: task.status,
          assigneeId: task.assigneeId,
        });
        
        emitTaskUpdate(task.projectId, { type: 'updated', task });
      }
      
      res.json(task);
    } catch (error) {
      logger.error({ error }, 'Görev güncelleme hatası');
      next(error);
    }
  },
  
  async delete(req, res, next) {
    try {
      const task = await taskService.getById(req.params.id);
      await taskService.delete(req.params.id);
      
      if (task) {
        emitTaskUpdate(task.projectId, { type: 'deleted', taskId: task._id });
      }
      
      res.json({ message: 'Görev silindi' });
    } catch (error) {
      logger.error({ error }, 'Görev silme hatası');
      next(error);
    }
  },
};

