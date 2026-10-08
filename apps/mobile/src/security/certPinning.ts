export interface CertPinningConfig {
  domain: string;
  pins: string[]; // SHA-256 SPKI base64 hashes
  backupPins: string[];
  enforcePinning: boolean;
}

export const PRODUCTION_PINNING_CONFIG: Record<string, CertPinningConfig> = {
  'api.cybercompanion.internal': {
    domain: 'api.cybercompanion.internal',
    pins: [
      'pin-sha256="WoiWRyIOVNa9ihaKkdOdHZAZFYGEBU0b516M2qGEq9A="',
    ],
    backupPins: [
      'pin-sha256="r/m5WBGo8+/5GunSpmxDHFFDK199WNxTmzhLS85060="',
    ],
    enforcePinning: true,
  },
};

export function verifyCertificatePin(
  domain: string,
  serverSpkiHash: string,
  configs = PRODUCTION_PINNING_CONFIG
): { valid: boolean; reason?: string } {
  const config = configs[domain];
  if (!config) {
    // If not in pinning map, standard TLS trust chain applies
    return { valid: true };
  }

  if (!config.enforcePinning) {
    return { valid: true };
  }

  const allAllowedPins = [...config.pins, ...config.backupPins];
  const isMatch = allAllowedPins.some((pin) =>
    pin.toLowerCase().includes(serverSpkiHash.toLowerCase())
  );

  if (isMatch) {
    return { valid: true };
  }

  return {
    valid: false,
    reason: `Certificate pinning validation failure for domain: ${domain}. Potential MITM attack intercepted.`,
  };
}
