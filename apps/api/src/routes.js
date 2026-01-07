import { loadAuthRoutes } from './modules/auth/routes.js';
import { loadUserRoutes } from './modules/users/routes.js';
import { loadProjectRoutes } from './modules/projects/routes.js';
import { loadTaskRoutes } from './modules/tasks/routes.js';
import { loadCommentRoutes } from './modules/comments/routes.js';

export const loadRoutes = (app) => {
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });
  
  app.use('/api/auth', loadAuthRoutes());
  app.use('/api/users', loadUserRoutes());
  app.use('/api/projects', loadProjectRoutes());
  app.use('/api/tasks', loadTaskRoutes());
  app.use('/api/comments', loadCommentRoutes());
};

