import amqp from 'amqplib';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let connection = null;
let channel = null;

export const connectRabbitMQ = async () => {
  try {
    logger.info(`RabbitMQ'ya bağlanılıyor: ${config.rabbitmq.uri}`);
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
    logger.error({ 
      message: errorMessage,
      code: errorCode,
      uri: config.rabbitmq.uri 
    }, 'RabbitMQ bağlantı hatası');
    logger.warn('RabbitMQ bağlantısı başarısız. Lütfen RabbitMQ servisinin çalıştığından emin olun.');
    logger.warn('RabbitMQ URI:', config.rabbitmq.uri);
    throw error;
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

