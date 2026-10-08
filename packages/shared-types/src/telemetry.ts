import { z } from 'zod';

// --- Wi-Fi Telemetry ---
export const WifiSecurityTypeEnum = z.enum(['OPEN', 'WEP', 'WPA', 'WPA2', 'WPA3', 'UNKNOWN']);
export type WifiSecurityType = z.infer<typeof WifiSecurityTypeEnum>;

export const WifiTelemetrySchema = z.object({
  ssid: z.string().default('Unknown Network'),
  bssid: z.string().optional(),
  securityType: WifiSecurityTypeEnum,
  signalStrengthDbm: z.number().optional(),
  isCaptivePortal: z.boolean().default(false),
  timestamp: z.string().datetime().default(() => new Date().toISOString()),
});
export type WifiTelemetry = z.infer<typeof WifiTelemetrySchema>;

// --- URL Telemetry ---
export const UrlInspectionRequestSchema = z.object({
  url: z.string().url('A valid HTTP or HTTPS URL is required'),
  source: z.enum(['USER_INPUT', 'QR_SCAN', 'CLIPBOARD']).default('USER_INPUT'),
  forceRefresh: z.boolean().default(false),
});
export type UrlInspectionRequest = z.infer<typeof UrlInspectionRequestSchema>;

// --- QR Telemetry ---
export const QrPayloadTypeEnum = z.enum([
  'URL',
  'WIFI',
  'VCARD',
  'PLAIN_TEXT',
  'DEEP_LINK',
  'UNKNOWN',
]);
export type QrPayloadType = z.infer<typeof QrPayloadTypeEnum>;

export const QrScanResultSchema = z.object({
  rawPayload: z.string(),
  type: QrPayloadTypeEnum,
  sanitizedDestination: z.string().optional(),
  timestamp: z.string().datetime().default(() => new Date().toISOString()),
});
export type QrScanResult = z.infer<typeof QrScanResultSchema>;

// --- App Permission Telemetry ---
export const PermissionCategoryEnum = z.enum([
  'CAMERA',
  'MICROPHONE',
  'LOCATION',
  'SMS',
  'CONTACTS',
  'STORAGE',
  'PHONE',
]);
export type PermissionCategory = z.infer<typeof PermissionCategoryEnum>;

export const AppPermissionAuditSchema = z.object({
  packageName: z.string(),
  appName: z.string(),
  grantedPermissions: z.array(PermissionCategoryEnum),
  isSystemApp: z.boolean().default(false),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(['SAFE', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL']),
  flaggedReasons: z.array(z.string()),
});
export type AppPermissionAudit = z.infer<typeof AppPermissionAuditSchema>;
