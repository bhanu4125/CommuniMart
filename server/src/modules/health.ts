import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const healthCheckHandler = (req: Request, res: Response) => {
  res.json({
    status: 'online',
    service: 'CommuniMart API',
    society: 'Green Meadows Gated Community',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    memoryUsage: process.memoryUsage().rss
  });
};
