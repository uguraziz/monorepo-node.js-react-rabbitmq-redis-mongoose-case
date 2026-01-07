import { connectRabbitMQ, getChannel } from '../config/rabbit.js';
import { logger } from '../utils/logger.js';

export const loadRabbitMQ = async () => {
  try {
    const channel = await connectRabbitMQ();
    
    const exchange = 'taskboard.events';
    await channel.assertExchange(exchange, 'topic', { durable: true });
    
    logger.info('RabbitMQ exchange oluşturuldu');
    
    return channel;
  } catch (error) {
    const errorMessage = error.message || String(error);
    const errorCode = error.code || 'UNKNOWN';
    logger.error({ 
      message: errorMessage,
      code: errorCode 
    }, 'RabbitMQ loader hatası');
    throw error;
  }
};

