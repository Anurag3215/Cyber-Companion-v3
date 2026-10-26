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
    keywords: ['punycode', 'homoglyph', 'cyrillic', 'idn', 'lookalike', 'typosquatting', 'spoof', 'paypal', 'apple', 'chase'],
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
  {
    id: 'KB-006',
    topic: 'ethical_hacking',
    title: 'Ethical Hacking & Penetration Testing Principles',
    summary:
      'Ethical hacking involves authorized, legal security assessments to identify, report, and remediate vulnerabilities before malicious attackers can exploit them. Practitioners employ red teaming, fuzzing, static code analysis, and sandbox execution.',
    threatVector: 'PROACTIVE_DEFENSE',
    defenseGuidance:
      'Adopt continuous vulnerability management, enforce least-privilege access, mandate code audits, and implement bug bounty programs.',
    keywords: ['ethical hacking', 'ethical', 'hacking', 'hacker', 'penetration testing', 'pentest', 'bug bounty', 'white hat', 'vulnerability', 'exploit'],
  },
  {
    id: 'KB-007',
    topic: 'deauth_jamming',
    title: '802.11 Deauthentication Attacks & Jamming',
    summary:
      'Attackers transmit spoofed 802.11 deauthentication management frames to disconnect clients from legitimate access points, compelling the victim device to connect to a rogue clone.',
    threatVector: 'WIRELESS_FRAME_JAMMING',
    defenseGuidance:
      'Enforce 802.11w Protected Management Frames (PMF) on access points to cryptographically sign management frames against deauth attacks.',
    keywords: ['deauth', 'deauthentication', 'jamming', '802.11w', 'pmf', 'disconnect', 'wifi attack'],
  },
  {
    id: 'KB-008',
    topic: 'phishing_social_eng',
    title: 'Phishing & Social Engineering Manipulation',
    summary:
      'Phishing exploits human urgency to trick victims into revealing credentials, private OTP tokens, or downloading weaponized attachments disguised as trusted organizations.',
    threatVector: 'SOCIAL_ENGINEERING',
    defenseGuidance:
      'Never click unsolicited urgent verification links. Verify communications out-of-band by navigating to the official website directly.',
    keywords: ['phishing', 'social engineering', 'credential harvesting', 'smishing', 'vishing', 'scam', 'fraud'],
  },
  {
    id: 'KB-009',
    topic: 'ransomware_malware',
    title: 'Ransomware & Malware Defense',
    summary:
      'Ransomware covertly encrypts critical personal or enterprise data demanding cryptocurrency ransoms. Infection vectors include malicious email attachments and drive-by downloads.',
    threatVector: 'HOST_COMPROMISE',
    defenseGuidance:
      'Maintain immutable 3-2-1 offline backups, keep operating systems patched, and avoid running unknown executables.',
    keywords: ['ransomware', 'malware', 'virus', 'trojan', 'payload', 'extortion', 'spyware'],
  },
  {
    id: 'KB-010',
    topic: 'zero_trust',
    title: 'Zero-Trust Architecture & Continuous Verification',
    summary:
      'Zero-Trust operates on the principle: "Never Trust, Always Verify". Every connection request is strictly authenticated and cryptographically validated regardless of network perimeter.',
    threatVector: 'SECURITY_ARCHITECTURE',
    defenseGuidance:
      'Enforce least-privilege microsegmentation, end-to-end encryption for all data in transit, and multi-factor authentication across all endpoints.',
    keywords: ['zero trust', 'zero-trust', 'least privilege', 'verification', 'architecture'],
  },
];

const CANDIDATE_API_BASE_URLS = [
  'https://cyber-companion-v3.onrender.com/v1',
  'http://127.0.0.1:5000/v1',
  'http://localhost:5000/v1',
  'http://10.0.2.2:5000/v1',
  'http://192.168.1.15:5000/v1',
];

/**
 * Pure Deterministic Autonomous On-Device Threat Intelligence Engine
 * Evaluates target URLs and domains locally with zero cloud or laptop dependency.
 */
export function evaluateAutonomousUrlHeuristics(rawInput: string): ThreatInspectionResponse {
  const target = (rawInput || '').trim();
  const lower = target.toLowerCase();
  const flags: string[] = [];
  const addFlag = (name: string) => {
    if (!flags.includes('OFFLINE_HEURISTIC_FLAG')) {
      flags.push('OFFLINE_HEURISTIC_FLAG');
    }
    if (!flags.includes(name)) {
      flags.push(name);
    }
  };

  // Check 1: Private Subnet / SSRF Guards
  const isLoopback =
    lower.includes('127.0.0.1') ||
    lower.includes('localhost') ||
    lower.includes('0.0.0.0');
  const isPrivateSubnet =
    /10\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower) ||
    /192\.168\.\d{1,3}\.\d{1,3}/.test(lower) ||
    /172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}/.test(lower) ||
    lower.includes('169.254.169.254') ||
    lower.includes('169.254.');

  if (isLoopback || isPrivateSubnet) {
    addFlag('SSRF_INTERNAL_NETWORK_TARGET');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 96,
      plainLanguageExplanation:
        'CRITICAL: Target resolves directly to a loopback or private network subnet (Server-Side Request Forgery vector). Intended to probe internal infrastructure.',
      recommendation:
        'Block immediately. Never permit inbound untrusted requests to target private network addresses.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 2: Punycode & IDN Homoglyph brand impersonation (e.g. Cyrillic 'а', 'р', 'о', 'xn--')
  const hasPunycode = lower.includes('xn--');
  const hasCyrillicHomoglyph = /[\u0400-\u04FF\u0370-\u03FF]/.test(target);
  const spoofedBrandWords = [
    'paypal',
    'chase',
    'apple',
    'google',
    'microsoft',
    'amazon',
    'netflix',
    'bankofamerica',
    'wellsfargo',
  ];

  if (hasPunycode || hasCyrillicHomoglyph) {
    addFlag('IDN_HOMOGLYPH_BRAND_IMPERSONATION');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 98,
      plainLanguageExplanation:
        'SEVERE: Internationalized Domain Name (IDN) / Punycode homoglyph detected. The domain uses lookalike Cyrillic or Greek characters to spoof a trusted brand identity.',
      recommendation:
        'DO NOT OPEN. This is a weaponized phishing lure engineered to steal credentials or payment tokens.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 3: Weaponized executable or mobile malware packages
  if (
    lower.includes('.apk') ||
    lower.includes('.exe') ||
    lower.includes('.scr') ||
    lower.includes('.bat') ||
    lower.includes('.vbs') ||
    lower.includes('.msi')
  ) {
    addFlag('UNVERIFIED_BINARY_PAYLOAD_DOWNLOAD');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 94,
      plainLanguageExplanation:
        'HIGH THREAT: Target points directly to an unverified binary payload or Android APK package. Sideloading untrusted packages risks full device compromise.',
      recommendation:
        'Reject download immediately. Do not grant installation permissions or execute unknown APK files.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 4: Unencrypted HTTP carrying authentication or financial endpoints
  const isHttp = lower.startsWith('http://');
  const hasAuthKeywords =
    lower.includes('login') ||
    lower.includes('signin') ||
    lower.includes('bank') ||
    lower.includes('verify') ||
    lower.includes('account') ||
    lower.includes('portal') ||
    lower.includes('secure') ||
    lower.includes('wallet');

  if (isHttp && hasAuthKeywords) {
    addFlag('CLEARTEXT_HTTP_AUTHENTICATION_INTERCEPT');
    addFlag('CREDENTIAL_HARVESTER_SIGNATURE');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 92,
      plainLanguageExplanation:
        'CRITICAL: Cleartext HTTP protocol detected on an authentication endpoint. Credentials and session tokens will be transmitted in plaintext across the local airspace.',
      recommendation:
        'Halt immediately. Legitimate banking and authentication portals enforce strict HTTPS/TLS.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 5: Quishing parking meter / payment lure
  if (
    lower.includes('park') &&
    (lower.includes('pay') || lower.includes('meter') || lower.includes('quickpay'))
  ) {
    addFlag('QUISHING_PAYMENT_STICKER_SPOOF');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 90,
      plainLanguageExplanation:
        'ALERT: QR code payment destination matches known parking meter quishing patterns. Fraudsters replace physical municipal stickers to harvest credit card data.',
      recommendation:
        'Verify physical signage or use the official municipal parking app directly.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 6: Known phishing keywords & brand lures
  if (
    lower.includes('phish') ||
    lower.includes('malware') ||
    lower.includes('chase-security') ||
    lower.includes('bank-verify') ||
    lower.includes('account-alert') ||
    lower.includes('update-billing')
  ) {
    addFlag('SUSPICIOUS_PHISHING_LURE');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 90,
      plainLanguageExplanation:
        'ALERT: Domain contains known phishing indicators and deceptive credential harvesting keywords.',
      recommendation:
        'Do not open. Discard link and contact your service provider through official verified channels.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 7: URL Shorteners concealing destinations
  const isShortener =
    lower.includes('bit.ly') ||
    lower.includes('tinyurl.com') ||
    lower.includes('t.co') ||
    lower.includes('goo.gl') ||
    lower.includes('ow.ly') ||
    lower.includes('is.gd') ||
    lower.includes('buff.ly');

  if (isShortener) {
    addFlag('URL_SHORTENER_OBSCURATION');
    return {
      target,
      verdict: 'SUSPICIOUS',
      confidenceScore: 68,
      plainLanguageExplanation:
        'CAUTION: Shortened URL conceals final destination host, preventing static domain reputation verification.',
      recommendation:
        'Use an expander to reveal full destination before proceeding.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 8: Verified Safe Perimeter (Trusted Reputable Domains)
  const isVerifiedSafe =
    lower.includes('github.com') ||
    lower.includes('google.com') ||
    lower.includes('microsoft.com') ||
    lower.includes('apple.com') ||
    lower.includes('wikipedia.org') ||
    lower.includes('cybercompanion.security');

  if (isVerifiedSafe && lower.startsWith('https://')) {
    return {
      target,
      verdict: 'SAFE',
      confidenceScore: 10,
      plainLanguageExplanation:
        'VERIFIED SAFE: Destination is a reputable domain with active TLS encryption and zero reported threat flags.',
      recommendation: 'Safe to proceed. Perimeter verified.',
      heuristicsTriggered: [],
      cached: false,
    };
  }

  // Default clean URL
  return {
    target,
    verdict: 'SAFE',
    confidenceScore: 18,
    plainLanguageExplanation:
      'Autonomous on-device inspection completed. No malicious patterns, homoglyphs, or credential interceptors detected.',
    recommendation: 'Proceed with standard cybersecurity awareness.',
    heuristicsTriggered: [],
    cached: false,
  };
}

export class ApiClient {
  private static baseUrl = 'https://cyber-companion-v3.onrender.com/v1';

  static setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  static getBaseUrl(): string {
    return this.baseUrl;
  }

  private static async requestWithFallback(endpoint: string, options?: RequestInit): Promise<Response> {
    const urls = [this.baseUrl, ...CANDIDATE_API_BASE_URLS.filter((u) => u !== this.baseUrl)];

    // Aggressive timeout: 1000ms per candidate so offline mobile does not stall
    for (const url of urls) {
      try {
        const timeoutMs = url.startsWith('https://') ? 4000 : 1500;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(`${url}${endpoint}`, {
          ...options,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          this.baseUrl = url;
          return res;
        }
      } catch {
        // Try next candidate URL or drop into autonomous engine
      }
    }
    throw new Error(`Failed to reach API gateway at ${endpoint}`);
  }

  static async checkHealth(): Promise<{ online: boolean; latencyMs: number }> {
    const start = Date.now();
    try {
      const response = await this.requestWithFallback('/health', {
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
      const response = await this.requestWithFallback('/threat/inspect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, source: 'USER_INPUT' }),
      });

      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Offline fallback: seamless on-device autonomous engine
    }

    // Always deliver instant, pure deterministic on-device analysis
    return evaluateAutonomousUrlHeuristics(url);
  }

  static async scanRealWifi(): Promise<any[]> {
    try {
      const response = await this.requestWithFallback('/threat/wifi/scan', {
        method: 'GET',
      });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data.networks) ? data.networks : [];
    } catch {
      return [];
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
      const response = await this.requestWithFallback('/threat/explain', {
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
      // Network unreachable, proceed instantly to client-side grounded RAG
    }

    // Offline Grounded RAG synthesis
    const queryLower = params.query.toLowerCase().trim();
    const queryTokens = queryLower.split(/\s+/).filter((t) => t.length >= 3);

    const scored = OFFLINE_KNOWLEDGE_BASE.map((entry) => {
      let score = 0;
      const topicLower = entry.topic.toLowerCase();
      const titleLower = entry.title.toLowerCase();
      const summaryLower = entry.summary.toLowerCase();

      if (queryLower.includes(topicLower) || topicLower.includes(queryLower)) score += 20;
      if (titleLower.includes(queryLower)) score += 15;

      for (const token of queryTokens) {
        if (topicLower.includes(token)) score += 8;
        if (titleLower.includes(token)) score += 6;
        if (summaryLower.includes(token)) score += 3;
        for (const kw of entry.keywords) {
          if (kw.toLowerCase().includes(token) || token.includes(kw.toLowerCase())) {
            score += 7;
          }
        }
      }

      for (const flag of flags) {
        const flagLower = flag.toLowerCase();
        if (entry.threatVector.toLowerCase().includes(flagLower)) score += 10;
        for (const kw of entry.keywords) {
          if (flagLower.includes(kw.toLowerCase())) score += 5;
        }
      }

      return { entry, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const hasMatch = scored.length > 0 && scored[0].score > 0;
    const primaryDoc = hasMatch ? scored[0].entry : OFFLINE_KNOWLEDGE_BASE[0];
    const topMatches = scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.entry);
    const citations = (topMatches.length > 0 ? topMatches : [primaryDoc]).map((d) => `[${d.id}] ${d.title}`);

    let explanationText = '';
    if (verdict === 'MALICIOUS') {
      explanationText = `SECURITY ALERT: This threat was verified as MALICIOUS based on deterministic indicators. ${primaryDoc.summary}`;
    } else if (verdict === 'SUSPICIOUS') {
      explanationText = `CAUTION ADVISED: Target displays SUSPICIOUS anomalies. ${primaryDoc.summary}`;
    } else if (verdict === 'SAFE') {
      explanationText = `VERIFIED SAFE: No active indicators of compromise were detected. ${primaryDoc.summary}`;
    } else {
      explanationText = `CYBER COMPANION INTEL: ${primaryDoc.summary}`;
    }

    return {
      immutableVerdict: verdict,
      explanation: explanationText,
      citations: citations.length > 0 ? citations : [`[${primaryDoc.id}] ${primaryDoc.title}`],
      recommendedActions: [
        primaryDoc.defenseGuidance,
        'Maintain device encryption and keep your operating system updated.',
      ],
      groundedInKnowledgeBase: hasMatch,
    };
  }
}
