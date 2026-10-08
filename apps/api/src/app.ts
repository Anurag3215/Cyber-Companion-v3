import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { healthRouter } from './routes/health.js';

export function createApp(): Express {
  const app = express();

  // Security headers & CORS
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  );

  // Body parser with size limit to prevent resource exhaustion attacks
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // Routes
  app.use('/v1/health', healthRouter);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: 'The requested endpoint does not exist.',
    });
  });

  // Global error handler (redacts stack traces in production)
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    });
  });

  return app;
}
