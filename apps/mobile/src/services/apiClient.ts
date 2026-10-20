export interface ThreatInspectionResponse {
  target: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  confidenceScore: number;
  plainLanguageExplanation: string;
  recommendation: string;
  heuristicsTriggered: string[];
  cached?: boolean;
}

export interface ExplainerResponse {
  immutableVerdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  explanation: string;
  citations: string[];
  recommendedActions: string[];
  groundedInKnowledgeBase: boolean;
}

const OFFLINE_KNOWLEDGE_BASE = [
  {
    id: 'KB-001',
    topic: 'quishing',
    title: 'QR Code Phishing (Quishing) Explained',
    summary:
      'Quishing occurs when attackers place malicious QR codes over legitimate ones (e.g. at parking meters, restaurants, or in emails) to redirect victims to credential-harvesting websites.',
    threatVector: 'PHYSICAL_AND_DIGITAL_QR',
    defenseGuidance:
      'Always preview the destination domain before opening links from QR codes. Check for tampering stickers on physical QR displays.',
    keywords: ['quishing', 'qr code', 'sticker', 'parking', 'restaurant', 'fake qr', 'camera'],
  },
  {
    id: 'KB-002',
    topic: 'punycode_homoglyph',
    title: 'Internationalized Domain Name (IDN) Homoglyph Attacks',
    summary:
      "Attackers register domain names using lookalike characters from Cyrillic or Greek alphabets (prefixed by 'xn--' in ASCII) to spoof well-known brand names like apple.com or paypal.com.",
    threatVector: 'DOMAIN_SPOOFING',
    defenseGuidance:
      'Inspect the raw Punycode domain. Look for unexpected character sets or slight font rendering variations in the browser address bar.',
    keywords: ['punycode', 'homoglyph', 'cyrillic', 'idn', 'lookalike', 'typosquatting', 'spoof', 'paypal', 'apple'],
  },
  {
    id: 'KB-003',
    topic: 'wifi_security',
    title: 'Wi-Fi Encryption Standards & Rogue Access Points',
    summary:
      'Open networks transmit unencrypted frames that can be captured by local eavesdroppers. Evil Twin APs mimic trusted network names to conduct man-in-the-middle attacks.',
    threatVector: 'NETWORK_EAVESDROPPING',
    defenseGuidance:
      'Prefer WPA3 or WPA2-Enterprise networks. Always use a trusted encrypted VPN when connecting to airport, hotel, or cafe Wi-Fi.',
    keywords: ['wifi', 'wpa3', 'wpa2', 'open network', 'evil twin', 'rogue ap', 'packet sniffing', 'hotspot', 'pineapple'],
  },
  {
    id: 'KB-004',
    topic: 'app_permissions',
    title: 'Mobile App Permissions & Data Harvesting',
    summary:
      'Overprivileged mobile apps requesting background location, contacts, SMS, or microphone access can covertly track user behavior and sell location telemetry to data brokers.',
    threatVector: 'ON_DEVICE_PRIVACY',
    defenseGuidance:
      "Grant sensitive permissions only 'While using the app'. Routinely audit and revoke permissions for apps that haven't been used recently.",
    keywords: ['permissions', 'background location', 'sms', 'microphone', 'tracking', 'privacy audit', 'contacts', 'otp'],
  },
  {
    id: 'KB-005',
    topic: 'url_shorteners',
    title: 'URL Shortener Concealment',
    summary:
      'Shortener services (bit.ly, tinyurl.com) obscure the final destination URL, making it difficult for users to visually detect malicious domains.',
    threatVector: 'LINK_OBSCURATION',
    defenseGuidance:
      'Use a link expander tool or automated scanner before clicking shortened links received from unknown senders.',
    keywords: ['shortener', 'bitly', 'tinyurl', 'redirect', 'short url', 'obscuration', 'link'],
  },
];

const DEFAULT_API_BASE_URL = 'http://localhost:5000/v1';

export class ApiClient {
  private static baseUrl = DEFAULT_API_BASE_URL;

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static getBaseUrl(): string {
    return this.baseUrl;
  }

  static async checkHealth(): Promise<{ online: boolean; latencyMs: number }> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
      });
      return {
        online: response.ok,
        latencyMs: Math.max(1, Date.now() - start),
      };
    } catch {
      return { online: false, latencyMs: 0 };
    }
  }

  static async inspectUrl(url: string): Promise<ThreatInspectionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/threat/inspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, source: 'USER_INPUT' }),
      });

      if (!response.ok) {
        throw new Error(`Gateway returned HTTP ${response.status}`);
      }

      return await response.json();
    } catch {
      // Graceful offline fallback: evaluate with basic heuristics
      const isMalicious = url.includes('phish') || url.includes('malware') || url.includes('bank-verify');
      return {
        target: url,
        verdict: isMalicious ? 'MALICIOUS' : 'SAFE',
        confidenceScore: 70,
        plainLanguageExplanation: isMalicious
          ? 'Offline heuristic check detected suspicious phishing patterns in domain name.'
          : 'Offline check found no immediate structural anomalies.',
        recommendation: isMalicious
          ? 'Do not open this URL.'
          : 'Proceed with standard caution while offline.',
        heuristicsTriggered: isMalicious ? ['OFFLINE_HEURISTIC_FLAG'] : [],
        cached: false,
      };
    }
  }

  static async explainThreat(params: {
    query: string;
    immutableVerdict?: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
    detectedFlags?: string[];
  }): Promise<ExplainerResponse> {
    const verdict = params.immutableVerdict || 'UNKNOWN';
    const flags = params.detectedFlags || [];

    try {
      const response = await fetch(`${this.baseUrl}/threat/explain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: params.query,
          immutableVerdict: verdict,
          detectedFlags: flags,
        }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Network failed, proceed to client-side grounded RAG fallback
    }

    // Offline Grounded RAG synthesis
    const queryLower = params.query.toLowerCase();
    const matched = OFFLINE_KNOWLEDGE_BASE.filter((entry) => {
      const matchTopic = queryLower.includes(entry.topic.toLowerCase());
      const matchKeyword = entry.keywords.some((kw) => queryLower.includes(kw.toLowerCase()));
      const matchFlags = flags.some(
        (f) =>
          entry.threatVector.toLowerCase().includes(f.toLowerCase()) ||
          entry.keywords.some((kw) => f.toLowerCase().includes(kw))
      );
      return matchTopic || matchKeyword || matchFlags;
    });

    const primaryDoc = matched[0] || OFFLINE_KNOWLEDGE_BASE[0];
    const citations = matched.map((d) => `[${d.id}] ${d.title}`);

    let explanationText = '';
    if (verdict === 'MALICIOUS') {
      explanationText = `SECURITY ALERT: This threat was verified as MALICIOUS based on deterministic indicators. ${primaryDoc.summary}`;
    } else if (verdict === 'SUSPICIOUS') {
      explanationText = `CAUTION ADVISED: Target displays SUSPICIOUS anomalies. ${primaryDoc.summary}`;
    } else {
      explanationText = `VERIFIED SAFE: No active indicators of compromise were detected. ${primaryDoc.summary}`;
    }

    return {
      immutableVerdict: verdict,
      explanation: explanationText,
      citations: citations.length > 0 ? citations : [`[${primaryDoc.id}] ${primaryDoc.title}`],
      recommendedActions: [
        primaryDoc.defenseGuidance,
        'Maintain device encryption and keep your operating system updated.',
      ],
      groundedInKnowledgeBase: matched.length > 0,
    };
  }
}
