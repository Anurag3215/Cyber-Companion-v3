import { z } from 'zod';

export const ThreatVerdictEnum = z.enum(['SAFE', 'SUSPICIOUS', 'MALICIOUS', 'UNKNOWN']);
export type ThreatVerdict = z.infer<typeof ThreatVerdictEnum>;

export const ThreatCategoryEnum = z.enum([
  'PHISHING',
  'MALWARE',
  'SOCIAL_ENGINEERING',
  'PUNYCODE_HOMOGLYPH',
  'SUSPICIOUS_SHORTENER',
  'IP_LITERAL',
  'ROGUE_HOTSPOT',
  'OVER_PRIVILEGED_APP',
  'NONE',
]);
export type ThreatCategory = z.infer<typeof ThreatCategoryEnum>;

export const ThreatIntelDetailSchema = z.object({
  source: z.string(),
  positives: z.number().default(0),
  totalEngines: z.number().default(0),
  categories: z.array(z.string()).default([]),
  responseTimeMs: z.number().optional(),
});
export type ThreatIntelDetail = z.infer<typeof ThreatIntelDetailSchema>;

export const ThreatAnalysisResultSchema = z.object({
  target: z.string(),
  verdict: ThreatVerdictEnum,
  confidenceScore: z.number().min(0).max(100),
  primaryCategory: ThreatCategoryEnum,
  heuristicsTriggered: z.array(z.string()),
  plainLanguageExplanation: z.string(),
  recommendation: z.string(),
  threatIntelSources: z.array(ThreatIntelDetailSchema).default([]),
  analyzedAt: z.string().datetime().default(() => new Date().toISOString()),
  cached: z.boolean().default(false),
});
export type ThreatAnalysisResult = z.infer<typeof ThreatAnalysisResultSchema>;
