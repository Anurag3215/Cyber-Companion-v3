import { z } from 'zod';

export const ScoreBandEnum = z.enum(['CRITICAL', 'AT_RISK', 'MODERATE', 'SECURE']);
export type ScoreBand = z.infer<typeof ScoreBandEnum>;

export const SecurityScoreBreakdownSchema = z.object({
  networkScore: z.number().min(0).max(100),
  urlSafetyScore: z.number().min(0).max(100),
  permissionScore: z.number().min(0).max(100),
  deviceBaselineScore: z.number().min(0).max(100),
});
export type SecurityScoreBreakdown = z.infer<typeof SecurityScoreBreakdownSchema>;

export const ActionableFixSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  potentialPointGain: z.number().min(1).max(50),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  actionCategory: z.enum(['WIFI', 'URL', 'PERMISSION', 'DEVICE']),
});
export type ActionableFix = z.infer<typeof ActionableFixSchema>;

export const OverallSecurityScoreSchema = z.object({
  score: z.number().min(0).max(100),
  band: ScoreBandEnum,
  breakdown: SecurityScoreBreakdownSchema,
  topRecommendations: z.array(ActionableFixSchema),
  scoreVersion: z.number().default(1),
  calculatedAt: z.string().datetime().default(() => new Date().toISOString()),
});
export type OverallSecurityScore = z.infer<typeof OverallSecurityScoreSchema>;
