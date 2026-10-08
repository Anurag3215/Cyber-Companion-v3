import { Request, Response, NextFunction } from 'express';

const PRIVATE_IP_PATTERNS = [
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 127.0.0.0/8 Loopback
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,  // 10.0.0.0/8 Private
  /^192\.168\.\d{1,3}\.\d{1,3}$/,     // 192.168.0.0/16 Private
  /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12 Private
  /^169\.254\.\d{1,3}\.\d{1,3}$/,    // 169.254.0.0/16 Link-local & Cloud Metadata
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^::$/,
  /^0$/,
];

export function parseDwordOrHexIp(hostname: string): string | null {
  // Check decimal integer / dword representation (e.g. 2130706433 -> 127.0.0.1)
  if (/^\d+$/.test(hostname)) {
    const num = parseInt(hostname, 10);
    if (num >= 0 && num <= 4294967295) {
      const b1 = (num >>> 24) & 255;
      const b2 = (num >>> 16) & 255;
      const b3 = (num >>> 8) & 255;
      const b4 = num & 255;
      return `${b1}.${b2}.${b3}.${b4}`;
    }
  }

  // Check hex integer representation (e.g. 0x7f000001)
  if (/^0x[0-9a-fA-F]+$/.test(hostname)) {
    const num = parseInt(hostname, 16);
    if (!isNaN(num) && num >= 0 && num <= 4294967295) {
      const b1 = (num >>> 24) & 255;
      const b2 = (num >>> 16) & 255;
      const b3 = (num >>> 8) & 255;
      const b4 = num & 255;
      return `${b1}.${b2}.${b3}.${b4}`;
    }
  }

  return null;
}

export function isPrivateOrLoopbackHost(hostname: string): boolean {
  let normalized = hostname.toLowerCase().trim();

  // Strip brackets from IPv6 hostnames like [::1]
  if (normalized.startsWith('[') && normalized.endsWith(']')) {
    normalized = normalized.slice(1, -1);
  }

  // Handle IPv4-mapped IPv6 addresses (e.g. ::ffff:127.0.0.1 or ::ffff:7f00:1)
  if (normalized.startsWith('::ffff:')) {
    const mappedPart = normalized.replace('::ffff:', '');
    if (isPrivateOrLoopbackHost(mappedPart)) {
      return true;
    }
    const parts = mappedPart.split(':');
    if (parts.length === 2) {
      const h1 = parseInt(parts[0], 16);
      const h2 = parseInt(parts[1], 16);
      if (!isNaN(h1) && !isNaN(h2)) {
        const hexIp = `${(h1 >> 8) & 255}.${h1 & 255}.${(h2 >> 8) & 255}.${h2 & 255}`;
        if (isPrivateOrLoopbackHost(hexIp)) {
          return true;
        }
      }
    }
  }

  // Handle DWord or Hex converted IPs
  const convertedIp = parseDwordOrHexIp(normalized);
  if (convertedIp && isPrivateOrLoopbackHost(convertedIp)) {
    return true;
  }

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

  // Block null bytes and header injection CRLF attempts
  if (targetUrl.includes('\0') || targetUrl.includes('%00') || /[\r\n]/.test(targetUrl)) {
    return res.status(400).json({
      error: 'Malformed URL',
      message: 'Suspicious injection characters detected in target URL.',
    });
  }

  // Max length check
  if (targetUrl.length > 2048) {
    return res.status(400).json({
      error: 'Payload Too Large',
      message: 'URL length exceeds maximum permitted threshold of 2048 characters.',
    });
  }

  try {
    const parsed = new URL(targetUrl);

    // Strictly enforce http: or https: protocol
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return res.status(400).json({
        error: 'Forbidden Scheme',
        message: 'Only HTTP and HTTPS schemes are permitted for remote scanning.',
      });
    }

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
