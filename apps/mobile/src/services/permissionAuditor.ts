export interface AppPermissionItem {
  packageName: string;
  appName: string;
  permissions: string[];
  isSystemApp?: boolean;
}

export interface PermissionAuditResult {
  packageName: string;
  appName: string;
  riskLevel: 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  flaggedReasons: string[];
  recommendation: string;
}

export function auditAppPermissions(app: AppPermissionItem): PermissionAuditResult {
  const perms = app.permissions.map((p) => p.toUpperCase());
  const flaggedReasons: string[] = [];
  let riskScore = 0;

  const hasSms = perms.some((p) => p.includes('SMS'));
  const hasInternet = perms.some((p) => p.includes('INTERNET'));
  const hasCamera = perms.some((p) => p.includes('CAMERA'));
  const hasAudio = perms.some((p) => p.includes('RECORD_AUDIO'));
  const hasLocation = perms.some((p) => p.includes('LOCATION'));
  const hasContacts = perms.some((p) => p.includes('CONTACTS'));
  const hasBoot = perms.some((p) => p.includes('BOOT_COMPLETED'));

  // Combination 1: SMS + Internet (OTP Theft)
  if (hasSms && hasInternet && !app.isSystemApp) {
    riskScore += 45;
    flaggedReasons.push('High-risk combination: SMS access + Internet connectivity (potential OTP stealer)');
  } else if (hasSms && !app.isSystemApp) {
    riskScore += 25;
    flaggedReasons.push('App can read personal SMS messages');
  }

  // Combination 2: Audio/Camera + Auto-Start on Boot
  if ((hasCamera || hasAudio) && hasBoot && !app.isSystemApp) {
    riskScore += 30;
    flaggedReasons.push('Background surveillance vector: Microphone or Camera access combined with auto-start on boot');
  } else if (hasCamera || hasAudio) {
    riskScore += 15;
    flaggedReasons.push('App requests hardware media sensors (Camera or Microphone)');
  }

  // Combination 3: Contacts + Location
  if (hasContacts && hasLocation && !app.isSystemApp) {
    riskScore += 20;
    flaggedReasons.push('Personal profiling risk: Combines physical location tracking with address book extraction');
  }

  const normalizedScore = Math.min(100, riskScore);

  let riskLevel: PermissionAuditResult['riskLevel'] = 'SAFE';
  if (normalizedScore >= 45) riskLevel = 'CRITICAL';
  else if (normalizedScore >= 30) riskLevel = 'HIGH';
  else if (normalizedScore >= 15) riskLevel = 'MODERATE';
  else if (normalizedScore > 0) riskLevel = 'LOW';

  let recommendation = 'Permissions look appropriate for standard applications.';
  if (riskLevel === 'CRITICAL') {
    recommendation = 'Revoke SMS permission in System App Settings immediately.';
  } else if (riskLevel === 'HIGH') {
    recommendation = 'Consider setting Camera and Microphone permissions to "Ask every time".';
  } else if (riskLevel === 'MODERATE') {
    recommendation = 'Review if this application genuinely requires background location access.';
  }

  return {
    packageName: app.packageName,
    appName: app.appName,
    riskLevel,
    riskScore: normalizedScore,
    flaggedReasons,
    recommendation,
  };
}
