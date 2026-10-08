import { computeOverallSecurityScore, ScoringInput } from '../src/scorer';

describe('Scoring Calibration & Mathematical Property Tests', () => {
  const securityTypes: Array<ScoringInput['wifi']['securityType']> = [
    'OPEN',
    'WEP',
    'WPA',
    'WPA2',
    'WPA3',
    'UNKNOWN',
  ];
  const urlVerdicts: Array<'SAFE' | 'SUSPICIOUS' | 'MALICIOUS'> = ['SAFE', 'SUSPICIOUS', 'MALICIOUS'];
  const auditLevels: Array<'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'> = [
    'SAFE',
    'LOW',
    'MODERATE',
    'HIGH',
    'CRITICAL',
  ];

  test('PROPERTY TEST: score is strictly within [0, 100] across 100 random combinations', () => {
    for (let i = 0; i < 100; i++) {
      const randomWifi = securityTypes[Math.floor(Math.random() * securityTypes.length)];
      const randomUrlVerdict = urlVerdicts[Math.floor(Math.random() * urlVerdicts.length)];
      const randomAuditLevel = auditLevels[Math.floor(Math.random() * auditLevels.length)];
      const randomScreenLock = Math.random() > 0.5;
      const randomRoot = Math.random() > 0.8;

      const input: ScoringInput = {
        wifi: { securityType: randomWifi, isCaptivePortal: Math.random() > 0.7 },
        recentUrls: [{ verdict: randomUrlVerdict }],
        appAudits: [{ riskLevel: randomAuditLevel }],
        device: {
          isScreenLockEnabled: randomScreenLock,
          isRootedOrJailbroken: randomRoot,
          isDeveloperModeEnabled: Math.random() > 0.5,
          isOsUpdated: Math.random() > 0.5,
        },
      };

      const result = computeOverallSecurityScore(input);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
      expect(result.breakdown.networkScore).toBeGreaterThanOrEqual(0);
      expect(result.breakdown.networkScore).toBeLessThanOrEqual(100);
      expect(result.breakdown.urlSafetyScore).toBeGreaterThanOrEqual(0);
      expect(result.breakdown.urlSafetyScore).toBeLessThanOrEqual(100);
    }
  });

  test('PROPERTY TEST: Monotonic improvement when fixing Wi-Fi', () => {
    const vulnerable = computeOverallSecurityScore({
      wifi: { securityType: 'OPEN' },
      recentUrls: [{ verdict: 'SAFE' }],
      appAudits: [],
      device: { isScreenLockEnabled: true },
    });

    const fixed = computeOverallSecurityScore({
      wifi: { securityType: 'WPA3' },
      recentUrls: [{ verdict: 'SAFE' }],
      appAudits: [],
      device: { isScreenLockEnabled: true },
    });

    expect(fixed.score).toBeGreaterThan(vulnerable.score);
  });

  test('PROPERTY TEST: Monotonic improvement when fixing Screen Lock', () => {
    const noLock = computeOverallSecurityScore({
      wifi: { securityType: 'WPA2' },
      recentUrls: [],
      appAudits: [],
      device: { isScreenLockEnabled: false },
    });

    const hasLock = computeOverallSecurityScore({
      wifi: { securityType: 'WPA2' },
      recentUrls: [],
      appAudits: [],
      device: { isScreenLockEnabled: true },
    });

    expect(hasLock.score).toBeGreaterThan(noLock.score);
  });
});
