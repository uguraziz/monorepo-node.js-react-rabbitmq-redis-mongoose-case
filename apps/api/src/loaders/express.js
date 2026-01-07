import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { corsOrigins } from '../config/cors.js';
import { errorHandler } from '../middlewares/error.js';
import { logger } from '../utils/logger.js';

export const loadExpress = (app) => {
  app.use(helmet());
  
  app.use(cors({
    origin: corsOrigins,
    credentials: true,
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
};

