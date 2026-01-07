import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/nodelabs',
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
  
  rabbitmq: {
    uri: process.env.RABBITMQ_URI || 'amqp://admin:admin@localhost:5672',
    exchange: process.env.RABBITMQ_EXCHANGE || 'taskboard.events',
  },
  
  api: {
    url: process.env.API_URL || 'http://localhost:3000',
  },
};

