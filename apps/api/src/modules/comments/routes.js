import { Router } from 'express';
import { commentController } from './controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireMember } from '../../middlewares/rbac.js';

export const loadCommentRoutes = () => {
  const router = Router();
  
  router.use(authenticate);
  router.use(requireMember);
  
  router.post('/', commentController.create);
  router.get('/', commentController.getAll);
  router.get('/:id', commentController.getById);
  router.put('/:id', commentController.update);
  router.delete('/:id', commentController.delete);
  
  return router;
};

