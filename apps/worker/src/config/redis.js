import Redis from 'ioredis';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let redisClient = null;

export const getRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });
    
    redisClient.on('connect', () => {
      logger.info('Redis bağlantısı başarılı');
    });
    
    redisClient.on('error', (err) => {
      logger.error({ err }, 'Redis bağlantı hatası');
    });
  }
  
  return redisClient;
};

export const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    logger.info('Redis bağlantısı kapatıldı');
  }
};

