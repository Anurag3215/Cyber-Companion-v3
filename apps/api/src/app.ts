import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { healthRouter } from './routes/health.js';
import { threatRouter } from './routes/threat.js';
import { tipsRouter } from './routes/tips.js';
import { rateLimiterMiddleware } from './middleware/rateLimiter.js';
import { structuredLogger } from './middleware/logger.js';

export function createApp(): Express {
  const app = express();

  // Structured logging & Security headers
  app.use(structuredLogger);
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  );

  // Rate Limiting
  app.use(rateLimiterMiddleware);

  // Body parser with size limits
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // Routes
  app.use('/v1/health', healthRouter);
  app.use('/v1/threat', threatRouter);
  app.use('/v1/tips', tipsRouter);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint does not exist.',
    });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    });
  });

  return app;
}
