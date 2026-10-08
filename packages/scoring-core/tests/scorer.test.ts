import {
  computeOverallSecurityScore,
  calculateNetworkScore,
  calculateUrlSafetyScore,
  calculatePermissionScore,
  calculateDeviceBaselineScore,
  determineScoreBand,
} from '../src/scorer';

describe('Deterministic Scoring Engine', () => {
  test('returns 100 for pristine secure state', () => {
    const result = computeOverallSecurityScore({
      wifi: { securityType: 'WPA3', isCaptivePortal: false },
      recentUrls: [{ verdict: 'SAFE' }],
      appAudits: [{ riskLevel: 'SAFE' }],
      device: {
        isScreenLockEnabled: true,
        isOsUpdated: true,
        isDeveloperModeEnabled: false,
        isRootedOrJailbroken: false,
      },
    });

    expect(result.score).toBe(100);
    expect(result.band).toBe('SECURE');
    expect(result.breakdown.networkScore).toBe(100);
    expect(result.breakdown.urlSafetyScore).toBe(100);
  });

  test('bounds score strictly between 0 and 100', () => {
    const worstCase = computeOverallSecurityScore({
      wifi: { securityType: 'OPEN', isCaptivePortal: true },
      recentUrls: [
        { verdict: 'MALICIOUS' },
        { verdict: 'MALICIOUS' },
        { verdict: 'MALICIOUS' },
      ],
      appAudits: [
        { riskLevel: 'CRITICAL' },
        { riskLevel: 'CRITICAL' },
        { riskLevel: 'CRITICAL' },
      ],
      device: {
        isRootedOrJailbroken: true,
        isScreenLockEnabled: false,
        isDeveloperModeEnabled: true,
        isOsUpdated: false,
      },
    });

    expect(worstCase.score).toBeGreaterThanOrEqual(0);
    expect(worstCase.score).toBeLessThanOrEqual(100);
    expect(worstCase.band).toBe('CRITICAL');
  });

  test('verifies monotonic property: mitigating a risk never decreases score', () => {
    const initial = computeOverallSecurityScore({
      wifi: { securityType: 'OPEN' },
      recentUrls: [],
      appAudits: [],
      device: { isScreenLockEnabled: false },
    });

    const fixedWifi = computeOverallSecurityScore({
      wifi: { securityType: 'WPA2' },
      recentUrls: [],
      appAudits: [],
      device: { isScreenLockEnabled: false },
    });

    const fixedBoth = computeOverallSecurityScore({
      wifi: { securityType: 'WPA2' },
      recentUrls: [],
      appAudits: [],
      device: { isScreenLockEnabled: true },
    });

    expect(fixedWifi.score).toBeGreaterThan(initial.score);
    expect(fixedBoth.score).toBeGreaterThan(fixedWifi.score);
  });

  test('provides top 3 actionable recommendations', () => {
    const result = computeOverallSecurityScore({
      wifi: { securityType: 'OPEN' },
      recentUrls: [{ verdict: 'MALICIOUS' }],
      appAudits: [{ riskLevel: 'CRITICAL' }],
      device: { isScreenLockEnabled: false },
    });

    expect(result.topRecommendations.length).toBeLessThanOrEqual(3);
    expect(result.topRecommendations[0].id).toBe('fix-wifi-open');
  });
});
