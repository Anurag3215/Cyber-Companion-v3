import { z } from 'zod';

export const TipCategoryEnum = z.enum([
  'WIFI_SAFETY',
  'PHISHING_AWARENESS',
  'QR_HYGIENE',
  'PASSWORD_SECURITY',
  'APP_PERMISSIONS',
  'DEVICE_CARE',
]);
export type TipCategory = z.infer<typeof TipCategoryEnum>;

export const CyberTipSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().max(350), // <= 60 words
  category: TipCategoryEnum,
  actionText: z.string().optional(),
  readingLevelGrade: z.number().default(6),
  createdAt: z.string().datetime().default(() => new Date().toISOString()),
});
export type CyberTip = z.infer<typeof CyberTipSchema>;

export const ContextualThreatCardSchema = z.object({
  id: z.string(),
  triggerThreatType: z.string(),
  headline: z.string(),
  explanation: z.string(),
  preventativeSteps: z.array(z.string()),
});
export type ContextualThreatCard = z.infer<typeof ContextualThreatCardSchema>;
