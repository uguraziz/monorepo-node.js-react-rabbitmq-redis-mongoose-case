import { config } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import { getRedisClient } from './config/redis.js';
import { connectRabbitMQ } from './config/rabbit.js';
import { startMailerConsumer } from './consumers/mailer.consumer.js';
import { startNotifierConsumer } from './consumers/notifier.consumer.js';
import { startAnalyticsConsumer } from './consumers/analytics.consumer.js';
import { startNightlySummaryJob } from './jobs/nightly-summary.js';
import { logger } from './utils/logger.js';

const startWorker = async () => {
  try {
    logger.info('Worker başlatılıyor...');
    
    await connectMongo();
    getRedisClient();
    await connectRabbitMQ();
    
    await startMailerConsumer();
    await startNotifierConsumer();
    await startAnalyticsConsumer();
    
    startNightlySummaryJob();
    
    logger.info('Worker başarıyla başlatıldı');
  } catch (error) {
    logger.error({ error }, 'Worker başlatma hatası');
    process.exit(1);
  }
};

const shutdown = async () => {
  logger.info('Worker kapatılıyor...');
  
  try {
    const { disconnectMongo } = await import('./config/mongo.js');
    const { closeRedis } = await import('./config/redis.js');
    const { closeRabbitMQ } = await import('./config/rabbit.js');
    
    await disconnectMongo();
    await closeRedis();
    await closeRabbitMQ();
    
    logger.info('Worker kapatıldı');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Kapatma hatası');
    process.exit(1);
  }
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startWorker();

