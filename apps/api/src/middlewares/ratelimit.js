import { getRedisClient } from '../config/redis.js';

export const rateLimit = (maxRequests = 100, windowMs = 60000) => {
  return async (req, res, next) => {
    try {
      const redis = getRedisClient();
      const ipKey = `ratelimit:ip:${req.ip}:${req.path}`;
      const userKey = req.user ? `ratelimit:user:${req.user.id}:${req.path}` : null;
      
      const ipCurrent = await redis.incr(ipKey);
      if (ipCurrent === 1) {
        await redis.expire(ipKey, Math.ceil(windowMs / 1000));
      }
      
      let userCurrent = 0;
      if (userKey) {
        userCurrent = await redis.incr(userKey);
        if (userCurrent === 1) {
          await redis.expire(userKey, Math.ceil(windowMs / 1000));
        }
      }
      
      if (ipCurrent > maxRequests || (userKey && userCurrent > maxRequests)) {
        return res.status(429).json({ error: 'Çok fazla istek' });
      }
      
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - Math.max(ipCurrent, userCurrent)));
      
      next();
    } catch (error) {
      next();
    }
  };
};

