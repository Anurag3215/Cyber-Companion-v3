import { Request, Response, NextFunction } from 'express';

export function structuredLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    // Redact sensitive query parameters and headers
    const sanitizedUrl = req.originalUrl.replace(/([?&](token|key|auth|password)=)[^&]+/gi, '$1[REDACTED]');

    const logEntry = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: sanitizedUrl,
      status: res.statusCode,
      durationMs: duration,
      userAgent: req.headers['user-agent'] || 'Unknown',
    };

    if (process.env.NODE_ENV !== 'test') {
      console.log(JSON.stringify(logEntry));
    }
  });

  next();
}
