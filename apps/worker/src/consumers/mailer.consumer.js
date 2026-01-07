import { getChannel } from '../config/rabbit.js';
import { config } from '../config/env.js';
import { notifyService } from '../services/notify.js';
import { logger } from '../utils/logger.js';

export const startMailerConsumer = async () => {
  try {
    const channel = getChannel();
    const queue = 'mailer.queue';
    
    await channel.assertQueue(queue, { durable: true });
    await channel.bindQueue(queue, config.rabbitmq.exchange, 'auth.otp.requested');
    
    await channel.consume(queue, async (msg) => {
      if (!msg) return;
      
      try {
        const content = JSON.parse(msg.content.toString());
        const { event, data } = content;
        
        if (event === 'otp.requested') {
          await notifyService.sendOTP(data.email, data.otp);
          channel.ack(msg);
          logger.info({ email: data.email }, 'OTP e-posta gönderildi');
        } else {
          channel.nack(msg, false, false);
        }
      } catch (error) {
        logger.error({ error, msg: msg.content.toString() }, 'Mailer consumer hatası');
        channel.nack(msg, false, true);
      }
    }, { noAck: false });
    
    logger.info('Mailer consumer başlatıldı');
  } catch (error) {
    logger.error({ error }, 'Mailer consumer başlatma hatası');
    throw error;
  }
};

