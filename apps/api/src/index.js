import http from 'http';
import { config } from './config/env.js';
import { connectMongo } from './config/mongo.js';
import { getRedisClient } from './config/redis.js';
import { loadRabbitMQ } from './loaders/rabbit.js';
import { loadSocket } from './loaders/socket.js';
import { initializeSockets } from './sockets/index.js';
import app from './app.js';
import { logger } from './utils/logger.js';

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectMongo();
    getRedisClient();
    await loadRabbitMQ();
    loadSocket(server);
    initializeSockets();
    
    server.listen(config.port, () => {
      logger.info(`Server ${config.port} portunda çalışıyor`);
    });
  } catch (error) {
    logger.error({ error }, 'Server başlatma hatası');
    process.exit(1);
  }
};

const shutdown = async () => {
  logger.info('Server kapatılıyor...');
  
  server.close(async () => {
    try {
      const { disconnectMongo } = await import('./config/mongo.js');
      const { closeRedis } = await import('./config/redis.js');
      const { closeRabbitMQ } = await import('./config/rabbit.js');
      
      await disconnectMongo();
      await closeRedis();
      await closeRabbitMQ();
      
      logger.info('Server kapatıldı');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Kapatma hatası');
      process.exit(1);
    }
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

startServer();

