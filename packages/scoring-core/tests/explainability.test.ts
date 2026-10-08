import { computeOverallSecurityScore } from '../src/scorer';
import { generateScoreExplanation } from '../src/explainability';

describe('Score Explainability Generator', () => {
  test('generates clear summary for SECURE state', () => {
    const scoreOutput = computeOverallSecurityScore({
      wifi: { securityType: 'WPA3' },
      recentUrls: [{ verdict: 'SAFE' }],
      appAudits: [{ riskLevel: 'SAFE' }],
      device: { isScreenLockEnabled: true },
    });

    const exp = generateScoreExplanation(scoreOutput);
    expect(exp.headline).toContain('Excellent Cyber Hygiene');
    expect(exp.badgeLabel).toBe('Strong Protection');
  });

  test('generates urgent action items for CRITICAL state', () => {
    const scoreOutput = computeOverallSecurityScore({
      wifi: { securityType: 'OPEN' },
      recentUrls: [{ verdict: 'MALICIOUS' }],
      appAudits: [{ riskLevel: 'CRITICAL' }],
      device: { isScreenLockEnabled: false, isRootedOrJailbroken: true },
    });

    const exp = generateScoreExplanation(scoreOutput);
    expect(exp.headline).toContain('Immediate Action Required');
    expect(exp.priorityActions.length).toBeGreaterThan(0);
    expect(exp.priorityActions[0].gainText).toContain('points');
  });
});
