import cron from 'node-cron';
import { reportService } from '../services/report.js';
import { logger } from '../utils/logger.js';

export const startNightlySummaryJob = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Günlük özet işi başlatıldı');
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const taskCreatedMetric = await reportService.saveMetric({
        name: 'daily.summary',
        value: 0,
        tags: { date: yesterday.toISOString().split('T')[0] },
        timestamp: yesterday,
      });
      
      logger.info({ date: yesterday.toISOString() }, 'Günlük özet oluşturuldu');
    } catch (error) {
      logger.error({ error }, 'Günlük özet işi hatası');
    }
  });
  
  logger.info('Günlük özet işi zamanlayıcısı başlatıldı');
};

