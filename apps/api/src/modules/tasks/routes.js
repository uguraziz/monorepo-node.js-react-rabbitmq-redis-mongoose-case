import { Router } from 'express';
import { taskController } from './controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireMember } from '../../middlewares/rbac.js';

export const loadTaskRoutes = () => {
  const router = Router();
  
  router.use(authenticate);
  router.use(requireMember);
  
  router.post('/', taskController.create);
  router.get('/', taskController.getAll);
  router.get('/:id', taskController.getById);
  router.put('/:id', taskController.update);
  router.delete('/:id', taskController.delete);
  
  return router;
};

