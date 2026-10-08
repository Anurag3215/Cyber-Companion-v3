import request from 'supertest';
import { createApp } from '../src/app';
import { calculateSecurityScore } from '../../../packages/scoring-core/src/scorer';
import { generateScoreExplanation } from '../../../packages/scoring-core/src/explainability';

describe('Cyber Companion v3 - End-to-End System Integration Suite', () => {
  const app = createApp();

  test('E2E Flow 1: System Health, Threat Inspection, Scoring, and Explanations', async () => {
    // Step 1: Health check
    const healthRes = await request(app).get('/v1/health');
    expect(healthRes.status).toBe(200);
    expect(healthRes.body.status).toBe('ok');

    // Step 2: Threat URL Inspection (simulating decoded QR code leading to a phishing attempt)
    const threatRes = await request(app)
      .post('/v1/threat/inspect')
      .send({ url: 'http://192.168.1.1.evil-phish.xyz/login?account=verify' });

    expect(threatRes.status).toBe(200);
    expect(threatRes.body.verdict).toBe('MALICIOUS');
    expect(threatRes.body.riskScore).toBeGreaterThanOrEqual(70);

    // Step 3: Wi-Fi assessment for insecure cafe network
    const wifiRes = await request(app)
      .post('/v1/threat/wifi/assess')
      .send({ ssid: 'Public_Airport_Free', securityType: 'OPEN' });

    expect(wifiRes.status).toBe(200);
    expect(wifiRes.body.riskLevel).toBe('CRITICAL');

    // Step 4: Deterministic Scoring Core computation across all 4 pillars
    const compositeScore = calculateSecurityScore({
      network: { score: 20, factors: ['Open unencrypted public Wi-Fi'] },
      permissions: { score: 50, factors: ['Camera, Location granted in background'] },
      qrThreats: { score: 10, factors: ['Scanned active malicious phishing payload'] },
      awareness: { score: 80, factors: ['7-day reading streak completed'] },
    });

    // Network (30%), Permissions (30%), QR Threats (20%), Awareness (20%)
    // 20*0.3 + 50*0.3 + 10*0.2 + 80*0.2 = 6 + 15 + 2 + 16 = 39
    expect(compositeScore.overallScore).toBe(39);
    expect(compositeScore.riskBand).toBe('CRITICAL');

    // Step 5: Score Explainability and Top Actionable Fixes
    const explanation = generateScoreExplanation(compositeScore);
    expect(explanation.topRecommendations.length).toBeGreaterThan(0);
    expect(explanation.summary).toContain('Immediate attention required');

    // Step 6: Cyber Awareness Feed retrieval
    const tipsRes = await request(app).get('/v1/awareness/tips/today');
    expect(tipsRes.status).toBe(200);
    expect(tipsRes.body.title).toBeDefined();
    expect(tipsRes.body.readingTimeMinutes).toBe(1);
  });

  test('E2E Flow 2: Zero-Trust Guardrails - Strict SSRF Blocking and Header Integrity', async () => {
    // Attempt SSRF targeting AWS EC2 metadata
    const ssrfRes1 = await request(app)
      .post('/v1/threat/inspect')
      .send({ url: 'http://169.254.169.254/latest/meta-data/' });
    expect(ssrfRes1.status).toBe(400);
    expect(ssrfRes1.body.error).toBe('Forbidden Target');

    // Attempt SSRF targeting localhost loopback
    const ssrfRes2 = await request(app)
      .post('/v1/threat/inspect')
      .send({ url: 'http://127.0.0.1:8080/admin' });
    expect(ssrfRes2.status).toBe(400);
    expect(ssrfRes2.body.error).toBe('Forbidden Target');

    // Attempt SSRF targeting IPv6 localhost
    const ssrfRes3 = await request(app)
      .post('/v1/threat/inspect')
      .send({ url: 'http://[::1]:3000/internal' });
    expect(ssrfRes3.status).toBe(400);
    expect(ssrfRes3.body.error).toBe('Forbidden Target');
  });

  test('E2E Flow 3: Clean User Session with High Score Security State', async () => {
    // Wi-Fi is WPA3 enterprise
    const wifiRes = await request(app)
      .post('/v1/threat/wifi/assess')
      .send({ ssid: 'SecureCorp_WPA3', securityType: 'WPA3' });

    expect(wifiRes.status).toBe(200);
    expect(wifiRes.body.riskLevel).toBe('LOW');

    // Clean URL scan
    const threatRes = await request(app)
      .post('/v1/threat/inspect')
      .send({ url: 'https://www.wikipedia.org' });

    expect(threatRes.status).toBe(200);
    expect(threatRes.body.verdict).toBe('SAFE');

    // Clean composite score
    const cleanScore = calculateSecurityScore({
      network: { score: 95, factors: ['WPA3 encrypted network with isolated clients'] },
      permissions: { score: 90, factors: ['Zero dangerous permissions granted to sideloaded apps'] },
      qrThreats: { score: 100, factors: ['All scanned items verified safe'] },
      awareness: { score: 95, factors: ['Daily cybersecurity micro-learning active'] },
    });

    expect(cleanScore.overallScore).toBeGreaterThanOrEqual(90);
    expect(cleanScore.riskBand).toBe('EXCELLENT');

    const explanation = generateScoreExplanation(cleanScore);
    expect(explanation.summary).toContain('Outstanding');
  });
});
