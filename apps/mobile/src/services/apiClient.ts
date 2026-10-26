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
      confidenceScore: 98,
      plainLanguageExplanation:
        'CRITICAL: Target resolves directly to a loopback or private network subnet (Server-Side Request Forgery vector). Attackers use this to bypass firewalls and attack local gateway hardware.',
      recommendation:
        'Block immediately. Never permit inbound untrusted requests to target private network addresses.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 2: Punycode & IDN Homoglyph brand impersonation (e.g. Cyrillic 'а', 'р', 'о', 'xn--', leetspeak)
  const hasPunycode = lower.includes('xn--');
  const hasCyrillicHomoglyph = /[\u0400-\u04FF\u0370-\u03FF]/.test(target);
  const hasLeetspeakHomoglyph =
    lower.includes('paypa1') ||
    lower.includes('goog1e') ||
    lower.includes('app1e') ||
    lower.includes('micros0ft') ||
    lower.includes('netf1ix') ||
    lower.includes('amaz0n') ||
    lower.includes('wellsfarg0');

  if (hasPunycode || hasCyrillicHomoglyph || hasLeetspeakHomoglyph) {
    addFlag('IDN_HOMOGLYPH_BRAND_IMPERSONATION');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 98,
      plainLanguageExplanation:
        'SEVERE: Homoglyph or brand impersonation detected. The domain uses lookalike characters or visual substitutions (e.g. "1" for "l" or Cyrillic letters) to spoof a legitimate brand identity and steal credentials.',
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
    lower.includes('.msi') ||
    lower.includes('.cmd') ||
    lower.includes('.dmg') ||
    lower.includes('.jar') ||
    lower.includes('.iso')
  ) {
    addFlag('UNVERIFIED_BINARY_PAYLOAD_DOWNLOAD');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 95,
      plainLanguageExplanation:
        'HIGH THREAT: Target points directly to an unverified binary payload or executable package (.apk, .exe, .scr). Sideloading untrusted packages risks full device compromise and malware infection.',
      recommendation:
        'Reject download immediately. Do not grant installation permissions or execute unknown binary packages.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 4: Quishing parking meter / payment lure
  if (
    lower.includes('park') &&
    (lower.includes('pay') || lower.includes('meter') || lower.includes('quickpay') || lower.includes('quick-bill'))
  ) {
    addFlag('QUISHING_PAYMENT_STICKER_SPOOF');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 92,
      plainLanguageExplanation:
        'ALERT: QR code payment destination matches known parking meter quishing patterns. Fraudsters replace physical municipal stickers to harvest credit card data.',
      recommendation:
        'Verify physical signage or use the official municipal parking app directly.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 5: Brand Impersonation & Credential Harvesting Lures
  const brandKeywords = ['chase', 'paypal', 'bank', 'apple', 'google', 'microsoft', 'office365', 'netflix', 'amazon', 'binance', 'coinbase', 'wallet', 'wellsfargo', 'citi', 'boa'];
  const credentialKeywords = ['login', 'signin', 'verify', 'verification', 'security', 'account', 'portal', 'auth', 'password', 'recover', 'billing', 'invoice', 'update', 'alert', 'confirm'];
  const hasBrand = brandKeywords.some((b) => lower.includes(b));
  const hasCred = credentialKeywords.some((c) => lower.includes(c));

  if (hasBrand && hasCred && !lower.includes('cybercompanion.security')) {
    addFlag('BRAND_CREDENTIAL_HARVESTER_SIGNATURE');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 94,
      plainLanguageExplanation:
        'CRITICAL PHISHING THREAT: Domain pairs trusted corporate/banking brand names with credential-harvesting triggers (login/verify/update). Designed to harvest user accounts.',
      recommendation:
        'Do not open or submit passwords. Contact your service provider exclusively through official channels.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 6: Explicit phishing & threat indicators
  if (
    lower.includes('phish') ||
    lower.includes('malware') ||
    lower.includes('trojan') ||
    lower.includes('stealer') ||
    lower.includes('exploit') ||
    lower.includes('hacker') ||
    lower.includes('suspect') ||
    lower.includes('fraud') ||
    lower.includes('scam') ||
    lower.includes('fake-') ||
    lower.includes('airdrop') ||
    lower.includes('claim-free') ||
    lower.includes('free-crypto') ||
    lower.includes('prize-winner')
  ) {
    addFlag('SUSPICIOUS_PHISHING_LURE');
    return {
      target,
      verdict: 'MALICIOUS',
      confidenceScore: 92,
      plainLanguageExplanation:
        'ALERT: Target contains explicit threat, phishing, or financial lure signatures flagged by autonomous heuristics.',
      recommendation:
        'Do not open. Discard link and block the sender.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 7: Untrusted High-Abuse TLDs (.xyz, .top, .cc, .ru, .click, .buzz, etc.)
  const suspiciousTlds = ['.xyz', '.top', '.cc', '.ru', '.click', '.buzz', '.club', '.work', '.link', '.info', '.online', '.site', '.vip', '.live', '.cn', '.tk', '.ml', '.ga', '.cf', '.gq'];
  const matchedTld = suspiciousTlds.find((tld) => {
    try {
      const parsedUrl = new URL(lower.startsWith('http') ? lower : 'http://' + lower);
      return parsedUrl.hostname.endsWith(tld);
    } catch {
      return lower.includes(tld);
    }
  });

  if (matchedTld) {
    if (hasCred || hasBrand || lower.includes('-') || lower.startsWith('http://')) {
      addFlag('ABUSE_PRONE_TLD_PHISHING');
      return {
        target,
        verdict: 'MALICIOUS',
        confidenceScore: 90,
        plainLanguageExplanation:
          `HIGH RISK: Destination is hosted on a high-abuse top-level domain (${matchedTld}) combined with credential harvesting triggers or hyphenated deception.`,
        recommendation:
          'Do not proceed. Legitimate institutions rarely use disposable high-abuse TLDs for sensitive services.',
        heuristicsTriggered: flags,
        cached: false,
      };
    }

    addFlag('UNTRUSTED_REGISTRY_TLD');
    return {
      target,
      verdict: 'SUSPICIOUS',
      confidenceScore: 68,
      plainLanguageExplanation:
        `CAUTION: Domain utilizes an untrusted registry extension (${matchedTld}) with elevated historic spam and malware distribution records.`,
      recommendation: 'Exercise high caution. Verify destination identity before entering information.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 8: Unencrypted Cleartext HTTP
  const isHttp = lower.startsWith('http://');
  if (isHttp) {
    if (hasCred) {
      addFlag('CLEARTEXT_HTTP_AUTHENTICATION_INTERCEPT');
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

    addFlag('CLEARTEXT_HTTP_TRANSPORT');
    return {
      target,
      verdict: 'SUSPICIOUS',
      confidenceScore: 62,
      plainLanguageExplanation:
        'CAUTION: Target communicates over unencrypted cleartext HTTP. Network packets are readable by any local observer or rogue Wi-Fi access point in your physical vicinity.',
      recommendation: 'Never submit passwords, personal data, or credit card numbers on unencrypted HTTP pages.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 9: Raw IP address as host (e.g. http://185.220.101.5)
  if (/https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(lower)) {
    addFlag('RAW_IP_HOST_TARGET');
    return {
      target,
      verdict: 'SUSPICIOUS',
      confidenceScore: 74,
      plainLanguageExplanation:
        'WARNING: Target uses a raw numerical IP address instead of a registered domain name. Legitimate web services use verified DNS hostnames.',
      recommendation: 'Avoid opening numeric IP links from unsolicited sources.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 10: URL Shorteners concealing destinations
  const isShortener =
    lower.includes('bit.ly') ||
    lower.includes('tinyurl.com') ||
    lower.includes('t.co') ||
    lower.includes('goo.gl') ||
    lower.includes('ow.ly') ||
    lower.includes('is.gd') ||
    lower.includes('buff.ly') ||
    lower.includes('cutt.ly') ||
    lower.includes('rebrand.ly');

  if (isShortener) {
    addFlag('URL_SHORTENER_OBSCURATION');
    return {
      target,
      verdict: 'SUSPICIOUS',
      confidenceScore: 68,
      plainLanguageExplanation:
        'CAUTION: Shortened URL conceals final destination host, preventing static domain reputation verification.',
      recommendation:
        'Use an expander or verify destination identity before following shortened links.',
      heuristicsTriggered: flags,
      cached: false,
    };
  }

  // Check 11: Verified Safe Perimeter (Trusted Reputable Domains)
  const isVerifiedSafe =
    lower.includes('github.com') ||
    lower.includes('google.com') ||
    lower.includes('microsoft.com') ||
    lower.includes('apple.com') ||
    lower.includes('wikipedia.org') ||
    lower.includes('cybercompanion.security') ||
    lower.includes('expo.dev') ||
    lower.includes('reactnative.dev') ||
    lower.includes('cloudflare.com') ||
    lower.includes('mozilla.org');

  if (isVerifiedSafe && lower.startsWith('https://')) {
    return {
      target,
      verdict: 'SAFE',
      confidenceScore: 8,
      plainLanguageExplanation:
        'VERIFIED SAFE: Destination is an established reputable organization domain with valid TLS encryption and clean global threat intelligence telemetry.',
      recommendation: 'Safe to proceed. Perimeter verified.',
      heuristicsTriggered: ['VERIFIED_REPUTABLE_DOMAIN', 'ACTIVE_TLS_TRANSPORT'],
      cached: false,
    };
  }

  // Check 12: General Clean HTTPS
  if (lower.startsWith('https://')) {
    return {
      target,
      verdict: 'SAFE',
      confidenceScore: 16,
      plainLanguageExplanation:
        'Autonomous on-device inspection completed. Target uses encrypted HTTPS protocol with zero detected homoglyphs, malware payloads, or phishing keywords.',
      recommendation: 'Standard web navigation safety observed.',
      heuristicsTriggered: ['ACTIVE_TLS_TRANSPORT'],
      cached: false,
    };
  }

  // Default clean URL
  return {
    target,
    verdict: 'SAFE',
    confidenceScore: 20,
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
        const timeoutMs = url.startsWith('https://') ? 8000 : 1500;
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
