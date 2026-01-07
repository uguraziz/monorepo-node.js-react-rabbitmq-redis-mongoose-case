import { authService } from './service.js';
import { logger } from '../../utils/logger.js';

export const authController = {
  async requestOTP(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.requestOTP(email);
      res.json(result);
    } catch (error) {
      logger.error({ error }, 'OTP isteği hatası');
      next(error);
    }
  },
  
  async verifyOTP(req, res, next) {
    try {
      const { email, otp } = req.body;
      const result = await authService.verifyOTP(email, otp);
      res.json(result);
    } catch (error) {
      logger.error({ error }, 'OTP doğrulama hatası');
      next(error);
    }
  },
  
  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json(result);
    } catch (error) {
      logger.error({ error }, 'Token yenileme hatası');
      next(error);
    }
  },
  
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.logout(refreshToken);
      res.json(result);
    } catch (error) {
      logger.error({ error }, 'Çıkış hatası');
      next(error);
    }
  },
  
  async logoutAll(req, res, next) {
    try {
      const result = await authService.logoutAll(req.user.id);
      res.json(result);
    } catch (error) {
      logger.error({ error }, 'Tüm oturumları kapatma hatası');
      next(error);
    }
  },
};

