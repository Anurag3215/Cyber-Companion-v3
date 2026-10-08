export type WifiEncryption = 'OPEN' | 'WEP' | 'WPA' | 'WPA2' | 'WPA3' | 'UNKNOWN';

export interface WifiRiskAssessment {
  ssid: string;
  encryption: WifiEncryption;
  riskLevel: 'SAFE' | 'MODERATE' | 'AT_RISK' | 'CRITICAL';
  isEncrypted: boolean;
  plainExplanation: string;
  recommendation: string;
}

export function evaluateWifiRisk(
  encryption: WifiEncryption,
  ssid = 'Unknown Network',
  isCaptivePortal = false,
): WifiRiskAssessment {
  if (encryption === 'OPEN') {
    return {
      ssid,
      encryption: 'OPEN',
      riskLevel: 'CRITICAL',
      isEncrypted: false,
      plainExplanation: 'Unencrypted open network. Data transmitted can be intercepted by anyone nearby.',
      recommendation: 'Disconnect or use a trusted VPN immediately.',
    };
  }

  if (encryption === 'WEP') {
    return {
      ssid,
      encryption: 'WEP',
      riskLevel: 'CRITICAL',
      isEncrypted: false,
      plainExplanation: 'Obsolete WEP encryption cracked by modern tools in seconds.',
      recommendation: 'Upgrade router security to WPA2 or WPA3.',
    };
  }

  if (isCaptivePortal) {
    return {
      ssid,
      encryption,
      riskLevel: 'AT_RISK',
      isEncrypted: true,
      plainExplanation: 'Captive portal detected. Public venue portals are often targeted for session interception.',
      recommendation: 'Avoid entering banking or personal credentials.',
    };
  }

  if (encryption === 'WPA3') {
    return {
      ssid,
      encryption: 'WPA3',
      riskLevel: 'SAFE',
      isEncrypted: true,
      plainExplanation: 'State-of-the-art WPA3 encryption with Protected Management Frames active.',
      recommendation: 'Network encryption posture is excellent.',
    };
  }

  return {
    ssid,
    encryption: 'WPA2',
    riskLevel: 'SAFE',
    isEncrypted: true,
    plainExplanation: 'WPA2 encryption active. Traffic is encrypted between device and router.',
    recommendation: 'Safe for general everyday use.',
  };
}
