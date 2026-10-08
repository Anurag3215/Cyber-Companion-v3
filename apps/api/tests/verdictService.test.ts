import { VerdictService } from '../src/services/verdictService';

describe('Threat Verdict Consensus & Caching Engine', () => {
  test('correctly merges multiple signals for malicious target', async () => {
    const res = await VerdictService.evaluateUrl('https://phishing-bad-site.com', true);
    expect(res.verdict).toBe('MALICIOUS');
    expect(res.confidenceScore).toBeGreaterThanOrEqual(85);
    expect(res.cached).toBe(false);
  });

  test('retrieves subsequent lookups from TTL cache', async () => {
    const url = 'https://cached-safe-site-test.com';
    const first = await VerdictService.evaluateUrl(url, true);
    expect(first.cached).toBe(false);

    const second = await VerdictService.evaluateUrl(url, false);
    expect(second.cached).toBe(true);
    expect(second.target).toBe(first.target);
  });

  test('evaluates clean target as SAFE', async () => {
    const res = await VerdictService.evaluateUrl('https://github.com', true);
    expect(res.verdict).toBe('SAFE');
    expect(res.recommendation).toContain('safe to browse');
  });
});
