import { ApiClient } from '../src/services/apiClient';

describe('ApiClient & AI Explainer Client Suite', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    ApiClient.setBaseUrl('http://localhost:5000/v1');
  });

  it('correctly sets and retrieves the base URL', () => {
    ApiClient.setBaseUrl('https://api.test-sentinel.io/v1');
    expect(ApiClient.getBaseUrl()).toBe('https://api.test-sentinel.io/v1');
  });

  it('checks gateway health when endpoint responds 200 OK', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
    } as any);

    const health = await ApiClient.checkHealth();
    expect(health.online).toBe(true);
    expect(health.latencyMs).toBeGreaterThanOrEqual(1);
  });

  it('handles offline state gracefully when health check throws', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network offline'));

    const health = await ApiClient.checkHealth();
    expect(health.online).toBe(false);
    expect(health.latencyMs).toBe(0);
  });

  it('performs offline fallback for URL threat inspection when fetch fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network unreachable'));

    const maliciousResult = await ApiClient.inspectUrl('http://paypal-security-phish.xyz');
    expect(maliciousResult.verdict).toBe('MALICIOUS');
    expect(maliciousResult.heuristicsTriggered).toContain('OFFLINE_HEURISTIC_FLAG');

    const safeResult = await ApiClient.inspectUrl('https://valid-portal.com');
    expect(safeResult.verdict).toBe('SAFE');
  });

  it('performs grounded RAG explanation with citations offline', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network unreachable'));

    // Quishing query
    const quishingRes = await ApiClient.explainThreat({
      query: 'What is quishing or malicious QR stickers on parking meters?',
      immutableVerdict: 'MALICIOUS',
      detectedFlags: ['QR_CODE', 'PHYSICAL_TAMPERING'],
    });

    expect(quishingRes.immutableVerdict).toBe('MALICIOUS');
    expect(quishingRes.groundedInKnowledgeBase).toBe(true);
    expect(quishingRes.citations.some((c) => c.includes('KB-001'))).toBe(true);
    expect(quishingRes.explanation).toContain('SECURITY ALERT:');
    expect(quishingRes.recommendedActions.length).toBeGreaterThan(0);
  });

  it('performs grounded RAG explanation for Wi-Fi Evil Twin attack offline', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network unreachable'));

    const wifiRes = await ApiClient.explainThreat({
      query: 'How does an Evil Twin rogue Wi-Fi access point capture passwords?',
      immutableVerdict: 'SUSPICIOUS',
      detectedFlags: ['EVIL_TWIN', 'OPEN_NETWORK'],
    });

    expect(wifiRes.immutableVerdict).toBe('SUSPICIOUS');
    expect(wifiRes.groundedInKnowledgeBase).toBe(true);
    expect(wifiRes.citations.some((c) => c.includes('KB-003'))).toBe(true);
    expect(wifiRes.explanation).toContain('CAUTION ADVISED:');
  });

  it('performs grounded RAG explanation for Punycode homoglyphs offline', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network unreachable'));

    const punycodeRes = await ApiClient.explainThreat({
      query: 'Explain Punycode homoglyph spoofing for paypal lookalike domains',
      immutableVerdict: 'SAFE',
    });

    expect(punycodeRes.immutableVerdict).toBe('SAFE');
    expect(punycodeRes.citations.some((c) => c.includes('KB-002'))).toBe(true);
    expect(punycodeRes.explanation).toContain('VERIFIED SAFE:');
  });
});
