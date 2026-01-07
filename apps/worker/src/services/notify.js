import { getRedisClient } from '../config/redis.js';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const notifyService = {
  async sendOTP(email, otp) {
    logger.info({ email, otp }, 'OTP gönderildi (stub)');
    
    return {
      success: true,
      message: 'OTP e-posta ile gönderildi',
    };
  },
  
  async sendTaskNotification(userId, taskData) {
    try {
      const redis = getRedisClient();
      const notification = {
        userId,
        type: 'task',
        data: taskData,
        timestamp: new Date().toISOString(),
      };
      
      await redis.publish(`notifications:${userId}`, JSON.stringify(notification));
      
      logger.info({ userId, taskId: taskData.taskId }, 'Görev bildirimi gönderildi');
      
      return { success: true };
    } catch (error) {
      logger.error({ error, userId }, 'Bildirim gönderme hatası');
      throw error;
    }
  },
  
  async sendCommentNotification(userId, commentData) {
    try {
      const redis = getRedisClient();
      const notification = {
        userId,
        type: 'comment',
        data: commentData,
        timestamp: new Date().toISOString(),
      };
      
      await redis.publish(`notifications:${userId}`, JSON.stringify(notification));
      
      logger.info({ userId, commentId: commentData.commentId }, 'Yorum bildirimi gönderildi');
      
      return { success: true };
    } catch (error) {
      logger.error({ error, userId }, 'Bildirim gönderme hatası');
      throw error;
    }
  },
};

