import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  mongo: {
    uri: process.env.MONGO_URI || (() => {
      const username = process.env.MONGO_INITDB_ROOT_USERNAME || 'nodelabs';
      const password = process.env.MONGO_INITDB_ROOT_PASSWORD || '';
      const database = process.env.MONGO_INITDB_DATABASE || 'nodelabs';
      const host = process.env.MONGO_HOST || 'mongodb';
      if (password) {
        return `mongodb://${username}:${password}@${host}:27017/${database}?authSource=admin`;
      }
      return `mongodb://${host}:27017/${database}`;
    })(),
  },
  
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  },
  
  rabbitmq: {
    uri: process.env.RABBITMQ_URI || (() => {
      const user = process.env.RABBITMQ_DEFAULT_USER || 'admin';
      const pass = process.env.RABBITMQ_DEFAULT_PASS || 'admin';
      const host = process.env.RABBITMQ_HOST || 'rabbitmq';
      return `amqp://${user}:${pass}@${host}:5672`;
    })(),
  },
  
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  },
  
  otp: {
    expiresIn: parseInt(process.env.OTP_EXPIRES_IN || '300', 10),
  },
};

