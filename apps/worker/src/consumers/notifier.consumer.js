import { getChannel } from '../config/rabbit.js';
import { config } from '../config/env.js';
import { notifyService } from '../services/notify.js';
import { logger } from '../utils/logger.js';

export const startNotifierConsumer = async () => {
  try {
    const channel = getChannel();
    const queue = 'notifier.queue';
    
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, config.rabbitmq.exchange, 'tasks.*');
    await channel.bindQueue(queue, config.rabbitmq.exchange, 'comments.added');
    
    await channel.consume(queue, async (msg) => {
      if (!msg) return;
      
      try {
        const content = JSON.parse(msg.content.toString());
        const { event, data } = content;
        
        if (event === 'task.created' || event === 'task.updated' || event === 'task.assigned') {
          if (data.assigneeId) {
            await notifyService.sendTaskNotification(data.assigneeId, {
              taskId: data.taskId,
              projectId: data.projectId,
              event,
            });
          }
          channel.ack(msg);
          logger.info({ event, taskId: data.taskId }, 'Görev bildirimi gönderildi');
        } else if (event === 'comment.added') {
          await notifyService.sendCommentNotification(data.userId, {
            commentId: data.commentId,
            taskId: data.taskId,
            event,
          });
          channel.ack(msg);
          logger.info({ event, commentId: data.commentId }, 'Yorum bildirimi gönderildi');
        } else {
          channel.nack(msg, false, false);
        }
      } catch (error) {
        logger.error({ error, msg: msg.content.toString() }, 'Notifier consumer hatası');
        channel.nack(msg, false, true);
      }
    }, { noAck: false });
    
    logger.info('Notifier consumer başlatıldı');
  } catch (error) {
    logger.error({ error }, 'Notifier consumer başlatma hatası');
    throw error;
  }
};

