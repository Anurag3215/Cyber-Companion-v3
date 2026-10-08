import request from 'supertest';
import { createApp } from '../src/app';

describe('Threat Intelligence Gateway Routes', () => {
  const app = createApp();

  test('POST /v1/threat/inspect evaluates valid URL', async () => {
    const res = await request(app)
      .post('/v1/threat/inspect')
      .send({ url: 'https://github.com' });

    expect(res.status).toBe(200);
    expect(res.body.target).toBe('https://github.com');
    expect(res.body.verdict).toBeDefined();
  });

  test('POST /v1/threat/inspect blocks SSRF target', async () => {
    const res = await request(app)
      .post('/v1/threat/inspect')
      .send({ url: 'http://169.254.169.254/latest/meta-data' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Forbidden Target');
  });

  test('POST /v1/threat/wifi/assess assesses open Wi-Fi network', async () => {
    const res = await request(app)
      .post('/v1/threat/wifi/assess')
      .send({ ssid: 'Cafe_Open', securityType: 'OPEN' });

    expect(res.status).toBe(200);
    expect(res.body.riskLevel).toBe('CRITICAL');
    expect(res.body.isEncrypted).toBe(false);
  });
});
