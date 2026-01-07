import amqp from 'amqplib';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let connection = null;
let channel = null;

export const connectRabbitMQ = async (retries = 10, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      logger.info(`RabbitMQ'ya bağlanılıyor: ${config.rabbitmq.uri} (deneme ${i + 1}/${retries})`);
      connection = await amqp.connect(config.rabbitmq.uri);
      channel = await connection.createChannel();
      
      logger.info('RabbitMQ bağlantısı başarılı');
      
      connection.on('error', (err) => {
        logger.error({ err: err.message || err }, 'RabbitMQ bağlantı hatası');
      });
      
      connection.on('close', () => {
        logger.warn('RabbitMQ bağlantısı kapatıldı');
      });
      
      return channel;
    } catch (error) {
      const errorMessage = error.message || String(error);
      const errorCode = error.code || 'UNKNOWN';
      
      if (i === retries - 1) {
        logger.error({ 
          message: errorMessage,
          code: errorCode,
          uri: config.rabbitmq.uri 
        }, 'RabbitMQ bağlantı hatası - tüm denemeler başarısız');
        logger.warn('RabbitMQ bağlantısı başarısız. Lütfen RabbitMQ servisinin çalıştığından emin olun.');
        throw error;
      }
      
      logger.warn(`RabbitMQ bağlantısı başarısız, ${delay}ms sonra tekrar denenecek... (${i + 1}/${retries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel henüz oluşturulmadı');
  }
  return channel;
};

export const closeRabbitMQ = async () => {
  if (channel) {
    await channel.close();
  }
  if (connection) {
    await connection.close();
  }
  logger.info('RabbitMQ bağlantısı kapatıldı');
};

