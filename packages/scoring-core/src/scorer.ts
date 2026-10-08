export interface ScoringInput {
  wifi?: {
    securityType: 'OPEN' | 'WEP' | 'WPA' | 'WPA2' | 'WPA3' | 'UNKNOWN';
    isCaptivePortal?: boolean;
  };
  recentUrls?: Array<{
    verdict: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';
  }>;
  appAudits?: Array<{
    riskLevel: 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    appName?: string;
  }>;
  device?: {
    isScreenLockEnabled?: boolean;
    isOsUpdated?: boolean;
    isDeveloperModeEnabled?: boolean;
    isRootedOrJailbroken?: boolean;
  };
}

export interface ScoreOutput {
  score: number;
  band: 'CRITICAL' | 'AT_RISK' | 'MODERATE' | 'SECURE';
  isPartialScore: boolean;
  unmeasuredVectors: string[];
  breakdown: {
    networkScore: number;
    urlSafetyScore: number;
    permissionScore: number;
    deviceBaselineScore: number;
  };
  topRecommendations: Array<{
    id: string;
    title: string;
    description: string;
    potentialPointGain: number;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    actionCategory: 'WIFI' | 'URL' | 'PERMISSION' | 'DEVICE';
  }>;
  scoreVersion: number;
  calculatedAt: string;
}

export const SCORING_WEIGHTS = {
  NETWORK: 0.3,
  URL_SAFETY: 0.3,
  PERMISSIONS: 0.2,
  DEVICE_BASELINE: 0.2,
} as const;

export function calculateNetworkScore(wifi?: ScoringInput['wifi']): number {
  if (!wifi) return 80;
  let score = 100;
  switch (wifi.securityType) {
    case 'OPEN':
      score -= 70;
      break;
    case 'WEP':
      score -= 50;
      break;
    case 'WPA':
      score -= 25;
      break;
    case 'WPA2':
      score -= 5;
      break;
    case 'WPA3':
      score = 100;
      break;
    case 'UNKNOWN':
    default:
      score -= 20;
      break;
  }
  if (wifi.isCaptivePortal) {
    score -= 15;
  }
  return Math.max(0, Math.min(100, score));
}

export function calculateUrlSafetyScore(urls?: ScoringInput['recentUrls']): number {
  if (!urls || urls.length === 0) return 95;
  let deductions = 0;
  for (const url of urls) {
    if (url.verdict === 'MALICIOUS') deductions += 40;
    else if (url.verdict === 'SUSPICIOUS') deductions += 20;
  }
  return Math.max(0, Math.min(100, 100 - deductions));
}

export function calculatePermissionScore(audits?: ScoringInput['appAudits']): number {
  if (!audits || audits.length === 0) return 90;
  let deductions = 0;
  for (const audit of audits) {
    if (audit.riskLevel === 'CRITICAL') deductions += 35;
    else if (audit.riskLevel === 'HIGH') deductions += 20;
    else if (audit.riskLevel === 'MODERATE') deductions += 10;
  }
  return Math.max(0, Math.min(100, 100 - deductions));
}

export function calculateDeviceBaselineScore(device?: ScoringInput['device']): number {
  if (!device) return 85;
  let score = 100;
  if (device.isRootedOrJailbroken) score -= 80;
  if (device.isDeveloperModeEnabled) score -= 15;
  if (device.isScreenLockEnabled === false) score -= 30;
  if (device.isOsUpdated === false) score -= 20;
  return Math.max(0, Math.min(100, score));
}

export function determineScoreBand(score: number): 'CRITICAL' | 'AT_RISK' | 'MODERATE' | 'SECURE' {
  if (score >= 85) return 'SECURE';
  if (score >= 70) return 'MODERATE';
  if (score >= 50) return 'AT_RISK';
  return 'CRITICAL';
}

export function computeOverallSecurityScore(input: ScoringInput): ScoreOutput {
  const unmeasuredVectors: string[] = [];
  if (!input.wifi) unmeasuredVectors.push('WIFI');
  if (!input.recentUrls || input.recentUrls.length === 0) unmeasuredVectors.push('URLS');
  if (!input.appAudits || input.appAudits.length === 0) unmeasuredVectors.push('PERMISSIONS');
  if (!input.device) unmeasuredVectors.push('DEVICE');

  const isPartialScore = unmeasuredVectors.length > 0;

  const networkScore = calculateNetworkScore(input.wifi);
  const urlSafetyScore = calculateUrlSafetyScore(input.recentUrls);
  const permissionScore = calculatePermissionScore(input.appAudits);
  const deviceBaselineScore = calculateDeviceBaselineScore(input.device);

  const rawScore =
    networkScore * SCORING_WEIGHTS.NETWORK +
    urlSafetyScore * SCORING_WEIGHTS.URL_SAFETY +
    permissionScore * SCORING_WEIGHTS.PERMISSIONS +
    deviceBaselineScore * SCORING_WEIGHTS.DEVICE_BASELINE;

  const score = Math.round(Math.max(0, Math.min(100, rawScore)));
  const band = determineScoreBand(score);

  const recommendations: ScoreOutput['topRecommendations'] = [];

  if (input.wifi?.securityType === 'OPEN') {
    recommendations.push({
      id: 'fix-wifi-open',
      title: 'Disconnect from Open Wi-Fi',
      description: 'The current Wi-Fi has no encryption, leaving your traffic open to sniffing.',
      potentialPointGain: 21,
      severity: 'CRITICAL',
      actionCategory: 'WIFI',
    });
  }

  if (input.recentUrls?.some((u) => u.verdict === 'MALICIOUS')) {
    recommendations.push({
      id: 'fix-url-malicious',
      title: 'Review Flagged Malicious Links',
      description: 'Recent malicious links were intercepted. Avoid opening or sharing them.',
      potentialPointGain: 15,
      severity: 'HIGH',
      actionCategory: 'URL',
    });
  }

  if (input.appAudits?.some((a) => a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH')) {
    recommendations.push({
      id: 'fix-permission-overprivileged',
      title: 'Audit Risky Installed Apps',
      description: 'One or more apps request sensitive SMS or Location permissions.',
      potentialPointGain: 12,
      severity: 'HIGH',
      actionCategory: 'PERMISSION',
    });
  }

  if (input.device?.isScreenLockEnabled === false) {
    recommendations.push({
      id: 'fix-device-screenlock',
      title: 'Enable Device Screen Lock',
      description: 'Set a PIN, fingerprint, or biometric password to protect physical access.',
      potentialPointGain: 6,
      severity: 'MEDIUM',
      actionCategory: 'DEVICE',
    });
  }

  return {
    score,
    band,
    isPartialScore,
    unmeasuredVectors,
    breakdown: {
      networkScore,
      urlSafetyScore,
      permissionScore,
      deviceBaselineScore,
    },
    topRecommendations: recommendations.slice(0, 3),
    scoreVersion: 1,
    calculatedAt: new Date().toISOString(),
  };
}
