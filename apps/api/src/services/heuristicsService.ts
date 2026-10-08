export interface HeuristicScanResult {
  url: string;
  isMalicious: boolean;
  isSuspicious: boolean;
  score: number; // 0 (pristine) to 100 (critical threat)
  flags: string[];
  explanations: string[];
}

const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'ow.ly',
  'buff.ly',
  'rebrand.ly',
  'cutt.ly',
  'goo.gl',
]);

const SUSPICIOUS_TLDS = new Set([
  '.xyz',
  '.top',
  '.work',
  '.click',
  '.gq',
  '.cf',
  '.tk',
  '.ml',
  '.ga',
  '.loan',
  '.buzz',
  '.fit',
]);

const SUSPICIOUS_KEYWORDS = [
  'login',
  'verify',
  'update',
  'secure',
  'banking',
  'account',
  'wallet',
  'password',
  'signin',
  'auth',
];

export function analyzeUrlHeuristics(rawUrl: string): HeuristicScanResult {
  const flags: string[] = [];
  const explanations: string[] = [];
  let score = 0;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return {
      url: rawUrl,
      isMalicious: true,
      isSuspicious: true,
      score: 95,
      flags: ['MALFORMED_URL'],
      explanations: ['URL string is malformed and cannot be parsed as a valid HTTP/HTTPS endpoint.'],
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.toLowerCase();

  // 1. Insecure HTTP
  if (protocol === 'http:') {
    score += 15;
    flags.push('INSECURE_HTTP');
    explanations.push('Connection uses unencrypted HTTP. Data sent to this site can be intercepted.');
  }

  // 2. UserInfo `@` spoofing: http://google.com@evil.com
  if (parsed.username || rawUrl.includes('@')) {
    score += 40;
    flags.push('USERINFO_SPOOFING');
    explanations.push('Contains an "@" symbol in the authority block, which disguises the actual destination host.');
  }

  // 3. IP Host: http://192.168.1.1 or http://93.184.216.34
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    score += 35;
    flags.push('IP_HOST_LITERAL');
    explanations.push('Host uses a direct numeric IP address instead of a registered domain name.');
  }

  // 4. Punycode / IDN Homoglyph detection: xn--
  if (hostname.startsWith('xn--') || hostname.includes('.xn--') || /[^\u0000-\u007F]/.test(hostname)) {
    score += 50;
    flags.push('PUNYCODE_HOMOGLYPH');
    explanations.push('Contains internationalized characters or punycode prefix mimicking legitimate English brand names.');
  }

  // 5. URL Shortener detection
  if (KNOWN_SHORTENERS.has(hostname)) {
    score += 20;
    flags.push('URL_SHORTENER');
    explanations.push('Uses a URL shortener service that obscures the real destination address.');
  }

  // 6. Suspicious / Disposable TLD
  const matchedTld = Array.from(SUSPICIOUS_TLDS).find((tld) => hostname.endsWith(tld));
  if (matchedTld) {
    score += 20;
    flags.push(`SUSPICIOUS_TLD_${matchedTld.toUpperCase()}`);
    explanations.push(`Domain uses high-abuse top-level domain (${matchedTld}) frequently associated with disposable phishing campaigns.`);
  }

  // 7. Excessive subdomains (e.g. secure.bank.verify.account.phish.com)
  const parts = hostname.split('.');
  if (parts.length > 4) {
    score += 20;
    flags.push('EXCESSIVE_SUBDOMAINS');
    explanations.push('Unusually long subdomain hierarchy frequently used to hide malicious domains on mobile screens.');
  }

  // 8. Phishing keywords in path or subdomain
  const fullPathAndHost = (hostname + parsed.pathname).toLowerCase();
  const matchedKeywords = SUSPICIOUS_KEYWORDS.filter((kw) => fullPathAndHost.includes(kw));
  if (matchedKeywords.length >= 2 && score >= 20) {
    score += 25;
    flags.push('PHISHING_KEYWORDS_FOUND');
    explanations.push(`Contains high-risk credential keywords: ${matchedKeywords.join(', ')}.`);
  }

  const normalizedScore = Math.min(100, score);
  const isMalicious = normalizedScore >= 50;
  const isSuspicious = normalizedScore >= 25 && normalizedScore < 50;

  return {
    url: rawUrl,
    isMalicious,
    isSuspicious,
    score: normalizedScore,
    flags,
    explanations,
  };
}
