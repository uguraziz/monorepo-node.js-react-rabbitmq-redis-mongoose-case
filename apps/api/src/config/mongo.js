import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

export const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongo.uri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('MongoDB bağlantısı başarılı');
    
    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB bağlantı hatası');
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB bağlantısı kesildi');
    });
  } catch (error) {
    logger.error({ error }, 'MongoDB bağlantı hatası');
    logger.warn('MongoDB bağlantısı başarısız. Lütfen MongoDB servisinin çalıştığından emin olun.');
    logger.warn('MongoDB URI:', config.mongo.uri);
    throw error;
  }
};

export const disconnectMongo = async () => {
  await mongoose.disconnect();
  logger.info('MongoDB bağlantısı kapatıldı');
};

