import { analyzeUrlHeuristics } from './heuristicsService.js';
import { ThreatIntelAdapters, IntelProviderResult } from './intelAdapters.js';

export interface VerdictResponse {
  target: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  confidenceScore: number;
  primaryCategory: string;
  heuristicsTriggered: string[];
  plainLanguageExplanation: string;
  recommendation: string;
  threatIntelSources: IntelProviderResult[];
  cached: boolean;
  analyzedAt: string;
}

interface CacheEntry {
  data: VerdictResponse;
  expiresAt: number;
}

const verdictCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export class VerdictService {
  static async evaluateUrl(url: string, forceRefresh = false): Promise<VerdictResponse> {
    const cacheKey = url.toLowerCase().trim();
    const now = Date.now();

    if (!forceRefresh) {
      const cached = verdictCache.get(cacheKey);
      if (cached && now < cached.expiresAt) {
        return {
          ...cached.data,
          cached: true,
        };
      }
    }

    // Step 1: Run Heuristics Engine
    const heuristics = analyzeUrlHeuristics(url);

    // Step 2: Query External Threat Intel in parallel
    const [vtRes, gsbRes, uhRes] = await Promise.all([
      ThreatIntelAdapters.checkVirusTotal(url),
      ThreatIntelAdapters.checkGoogleSafeBrowsing(url),
      ThreatIntelAdapters.checkUrlhaus(url),
    ]);

    const sources = [vtRes, gsbRes, uhRes];

    // Step 3: Consensus Merger & Confidence Calculation
    const externalMaliciousHits = sources.filter((s) => s.isMalicious).length;

    let verdict: VerdictResponse['verdict'] = 'SAFE';
    let confidenceScore = 85;
    let primaryCategory = 'NONE';
    let plainLanguageExplanation =
      'Domain shows no active threat flags, valid certificate structures, and a clean historical reputation.';
    let recommendation = 'URL is safe to browse.';

    if (externalMaliciousHits >= 2 || (externalMaliciousHits >= 1 && heuristics.isMalicious)) {
      verdict = 'MALICIOUS';
      confidenceScore = 98;
      primaryCategory = 'PHISHING';
      plainLanguageExplanation =
        'Confirmed malicious website flagged by multiple independent security threat intelligence engines. Likely phishing or malware.';
      recommendation = 'Do NOT open this website. Block all interaction and delete the link.';
    } else if (externalMaliciousHits === 1 || heuristics.isMalicious) {
      verdict = 'MALICIOUS';
      confidenceScore = 88;
      primaryCategory = heuristics.flags.includes('PUNYCODE_HOMOGLYPH') ? 'PUNYCODE_HOMOGLYPH' : 'SUSPICIOUS_PHISHING';
      plainLanguageExplanation =
        heuristics.explanations[0] ||
        'Flagged as malicious by cloud security threat intelligence databases.';
      recommendation = 'Avoid visiting this page. High likelihood of credential interception.';
    } else if (heuristics.isSuspicious) {
      verdict = 'SUSPICIOUS';
      confidenceScore = 75;
      primaryCategory = 'DECEPTIVE_BEHAVIOR';
      plainLanguageExplanation =
        heuristics.explanations[0] ||
        'Contains suspicious lexical traits often seen in short-lived deceptive domains.';
      recommendation = 'Proceed with extreme caution. Do not enter personal credentials.';
    }

    const result: VerdictResponse = {
      target: url,
      verdict,
      confidenceScore,
      primaryCategory,
      heuristicsTriggered: heuristics.flags,
      plainLanguageExplanation,
      recommendation,
      threatIntelSources: sources,
      cached: false,
      analyzedAt: new Date().toISOString(),
    };

    // Cache the result
    verdictCache.set(cacheKey, {
      data: result,
      expiresAt: now + CACHE_TTL_MS,
    });

    return result;
  }
}
