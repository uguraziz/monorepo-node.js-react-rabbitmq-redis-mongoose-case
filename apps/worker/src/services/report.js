import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const EventSchema = new mongoose.Schema({
  type: { type: String, required: true },
  event: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
});

const MetricSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  tags: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

export const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
export const Metric = mongoose.models.Metric || mongoose.model('Metric', MetricSchema);

export const reportService = {
  async saveEvent(eventData) {
    try {
      const event = new Event(eventData);
      await event.save();
      logger.debug({ eventType: eventData.type }, 'Event kaydedildi');
      return event;
    } catch (error) {
      logger.error({ error, eventData }, 'Event kaydetme hatası');
      throw error;
    }
  },
  
  async saveMetric(metricData) {
    try {
      const metric = new Metric(metricData);
      await metric.save();
      logger.debug({ metricName: metricData.name }, 'Metrik kaydedildi');
      return metric;
    } catch (error) {
      logger.error({ error, metricData }, 'Metrik kaydetme hatası');
      throw error;
    }
  },
  
  async getTaskStats(projectId, startDate, endDate) {
    try {
      const events = await Event.find({
        type: 'task',
        'data.projectId': projectId,
        timestamp: { $gte: startDate, $lte: endDate },
      });
      
      return {
        total: events.length,
        created: events.filter(e => e.event === 'task.created').length,
        updated: events.filter(e => e.event === 'task.updated').length,
        assigned: events.filter(e => e.event === 'task.assigned').length,
      };
    } catch (error) {
      logger.error({ error, projectId }, 'İstatistik getirme hatası');
      throw error;
    }
  },
};

