export interface IVerdictCache {
  domainOrUrlHash: string;
  target: string;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  confidenceScore: number;
  primaryCategory: string;
  heuristicsTriggered: string[];
  plainLanguageExplanation: string;
  recommendation: string;
  threatIntelSources: Array<{
    source: string;
    positives: number;
    totalEngines: number;
  }>;
  createdAt: Date;
  expiresAt: Date;
}

// In-memory fallback and Mongoose schema interface definition
export const VerdictCacheCollection = 'verdict_caches';
