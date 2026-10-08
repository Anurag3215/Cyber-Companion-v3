import { Request, Response, NextFunction } from 'express';

const PRIVATE_IP_PATTERNS = [
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 127.0.0.0/8 Loopback
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,  // 10.0.0.0/8 Private
  /^192\.168\.\d{1,3}\.\d{1,3}$/,     // 192.168.0.0/16 Private
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12 Private
  /^169\.254\.\d{1,3}\.\d{1,3}$/,    // 169.254.0.0/16 Link-local & Cloud Metadata
  /^0\.0\.0\.0$/,
  /^::1$/,
];

export function isPrivateOrLoopbackHost(hostname: string): boolean {
  const normalized = hostname.toLowerCase().trim();

  if (
    normalized === 'localhost' ||
    normalized === 'metadata.google.internal' ||
    normalized.endsWith('.local') ||
    normalized.endsWith('.internal') ||
    normalized.endsWith('.lan')
  ) {
    return true;
  }

  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(normalized)) {
      return true;
    }
  }

  return false;
}

export function ssrfGuardMiddleware(req: Request, res: Response, next: NextFunction) {
  const targetUrl = req.body?.url;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return next();
  }

  try {
    const parsed = new URL(targetUrl);
    const hostname = parsed.hostname;

    if (isPrivateOrLoopbackHost(hostname)) {
      return res.status(400).json({
        error: 'Forbidden Target',
        message: 'Inspection of loopback, private RFC 1918 subnets, and cloud metadata targets is strictly prohibited by SSRF security policy.',
        target: targetUrl,
      });
    }

    next();
  } catch {
    return res.status(400).json({
      error: 'Malformed URL',
      message: 'The submitted URL is syntactically invalid.',
    });
  }
}
