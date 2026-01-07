import { getChannel } from '../config/rabbit.js';
import { config } from '../config/env.js';
import { reportService } from '../services/report.js';
import { logger } from '../utils/logger.js';

export const startAnalyticsConsumer = async () => {
  try {
    const channel = getChannel();
    const queue = 'analytics.queue';
    
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, config.rabbitmq.exchange, 'tasks.*');
    await channel.bindQueue(queue, config.rabbitmq.exchange, 'comments.added');
    
    await channel.consume(queue, async (msg) => {
      if (!msg) return;
      
      try {
        const content = JSON.parse(msg.content.toString());
        const { event, data, timestamp } = content;
        
        await reportService.saveEvent({
          type: event.startsWith('task') ? 'task' : 'comment',
          event,
          data,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
        });
        
        if (event === 'task.created') {
          await reportService.saveMetric({
            name: 'task.created',
            value: 1,
            tags: { projectId: data.projectId },
            timestamp: new Date(),
          });
        } else if (event === 'task.updated') {
          await reportService.saveMetric({
            name: 'task.updated',
            value: 1,
            tags: { projectId: data.projectId, status: data.status },
            timestamp: new Date(),
          });
        } else if (event === 'comment.added') {
          await reportService.saveMetric({
            name: 'comment.added',
            value: 1,
            tags: { taskId: data.taskId },
            timestamp: new Date(),
          });
        }
        
        channel.ack(msg);
        logger.debug({ event }, 'Analytics event kaydedildi');
      } catch (error) {
        logger.error({ error, msg: msg.content.toString() }, 'Analytics consumer hatası');
        channel.nack(msg, false, true);
      }
    }, { noAck: false });
    
    logger.info('Analytics consumer başlatıldı');
  } catch (error) {
    logger.error({ error }, 'Analytics consumer başlatma hatası');
    throw error;
  }
};

