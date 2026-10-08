import { Request, Response, NextFunction } from 'express';

interface ClientRecord {
  count: number;
  resetAt: number;
}

const clientHits = new Map<string, ClientRecord>();
const WINDOW_MS = 15 * 60 * 1000; // 15 mins
const MAX_REQUESTS = 100;

export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();

  const record = clientHits.get(ip);
  if (!record || now > record.resetAt) {
    clientHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - 1);
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
    res.setHeader('X-RateLimit-Remaining', 0);
    res.setHeader('Retry-After', Math.ceil((record.resetAt - now) / 1000));
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait before making further threat inspection requests.',
    });
  }

  record.count += 1;
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS - record.count);
  next();
}
