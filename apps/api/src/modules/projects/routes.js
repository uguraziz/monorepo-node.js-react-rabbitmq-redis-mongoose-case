import { Router } from 'express';
import { projectController } from './controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireMember } from '../../middlewares/rbac.js';

export const loadProjectRoutes = () => {
  const router = Router();
  
  router.use(authenticate);
  router.use(requireMember);
  
  router.post('/', projectController.create);
  router.get('/', projectController.getAll);
  router.get('/:id', projectController.getById);
  router.put('/:id', projectController.update);
  router.delete('/:id', projectController.delete);
  router.post('/:id/members', projectController.addMember);
  router.delete('/:id/members', projectController.removeMember);
  
  return router;
};

