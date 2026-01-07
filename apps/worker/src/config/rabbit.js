import amqp from 'amqplib';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let connection = null;
let channel = null;

export const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(config.rabbitmq.uri);
    channel = await connection.createChannel();
    
    await channel.assertExchange(config.rabbitmq.exchange, 'topic', { durable: true });
    
    logger.info('RabbitMQ bağlantısı başarılı');
    
    connection.on('error', (err) => {
      logger.error({ err }, 'RabbitMQ bağlantı hatası');
    });
    
    connection.on('close', () => {
      logger.warn('RabbitMQ bağlantısı kapatıldı');
    });
    
    return channel;
  } catch (error) {
    logger.error({ error }, 'RabbitMQ bağlantı hatası');
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

