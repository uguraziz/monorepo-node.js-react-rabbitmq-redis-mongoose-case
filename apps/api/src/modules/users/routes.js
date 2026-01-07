import { Router } from 'express';
import { userController } from './controller.js';
import { authenticate } from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/rbac.js';

export const loadUserRoutes = () => {
  const router = Router();
  
  router.get('/profile', authenticate, userController.getProfile);
  router.put('/profile', authenticate, userController.updateProfile);
  router.get('/', authenticate, userController.getAllUsers);
  
  return router;
};

