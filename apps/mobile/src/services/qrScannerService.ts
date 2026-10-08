export type QrType = 'URL' | 'WIFI' | 'VCARD' | 'PLAIN_TEXT' | 'DEEP_LINK' | 'UNKNOWN';

export interface QrParsedPayload {
  raw: string;
  type: QrType;
  sanitizedDestination?: string;
  metadata?: Record<string, string>;
}

export function classifyQrPayload(raw: string): QrParsedPayload {
  const trimmed = raw.trim();

  // Wi-Fi QR Code: WIFI:S:MySSID;T:WPA;P:password;;
  if (trimmed.toUpperCase().startsWith('WIFI:')) {
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const authMatch = trimmed.match(/T:([^;]+)/i);
    return {
      raw,
      type: 'WIFI',
      metadata: {
        ssid: ssidMatch ? ssidMatch[1] : 'Hidden SSID',
        authType: authMatch ? authMatch[1] : 'OPEN',
      },
    };
  }

  // vCard: BEGIN:VCARD
  if (trimmed.toUpperCase().startsWith('BEGIN:VCARD')) {
    return {
      raw,
      type: 'VCARD',
    };
  }

  // HTTP / HTTPS URL
  if (/^https?:\/\//i.test(trimmed)) {
    return {
      raw,
      type: 'URL',
      sanitizedDestination: trimmed,
    };
  }

  // App Deep Link (e.g. upi://pay, market://details, telegram://)
  if (/^[a-z0-9+.-]+:\/\//i.test(trimmed)) {
    return {
      raw,
      type: 'DEEP_LINK',
      sanitizedDestination: trimmed,
    };
  }

  // Plain Text
  return {
    raw,
    type: 'PLAIN_TEXT',
    sanitizedDestination: trimmed,
  };
}
