import { Router } from 'express';
import { authController } from './controller.js';
import { validate } from '../../middlewares/validate.js';
import { authenticate } from '../../middlewares/auth.js';
import {
  requestOTPSchema,
  verifyOTPSchema,
  refreshTokenSchema,
  logoutSchema,
} from './validators.js';

export const loadAuthRoutes = () => {
  const router = Router();
  
  router.post('/otp/request', validate(requestOTPSchema), authController.requestOTP);
  router.post('/otp/verify', validate(verifyOTPSchema), authController.verifyOTP);
  router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
  router.post('/logout', validate(logoutSchema), authController.logout);
  router.post('/logout-all', authenticate, authController.logoutAll);
  
  return router;
};

