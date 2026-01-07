import express from 'express';
import { loadExpress } from './loaders/express.js';
import { loadRoutes } from './routes.js';
import { errorHandler } from './middlewares/error.js';

const app = express();

loadExpress(app);
loadRoutes(app);
app.use(errorHandler);

export default app;

