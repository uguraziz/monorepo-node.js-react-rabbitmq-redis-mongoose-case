import { getChannel } from '../config/rabbit.js';
import { logger } from '../utils/logger.js';

export const publishEvent = async (topic, event, data) => {
  try {
    const channel = getChannel();
    const exchange = 'taskboard.events';
    
    await channel.assertExchange(exchange, 'topic', { durable: true });
    
    const message = JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString(),
    });
    
    channel.publish(exchange, topic, Buffer.from(message), {
      persistent: true,
    });
    
    logger.info({ topic, event }, 'Event yayınlandı');
  } catch (error) {
    logger.error({ error, topic, event }, 'Event yayınlama hatası');
    throw error;
  }
};

