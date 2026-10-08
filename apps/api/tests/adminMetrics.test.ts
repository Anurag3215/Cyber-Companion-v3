import request from 'supertest';
import { createApp } from '../src/app';

describe('Admin Console Routes & Telemetry', () => {
  const app = createApp();

  test('GET /v1/admin/metrics returns 401 when no token is provided', async () => {
    const res = await request(app).get('/v1/admin/metrics');
    expect(res.status).toBe(401);
  });

  test('GET /v1/admin/metrics returns 200 and anonymized metrics for VIEWER', async () => {
    const res = await request(app)
      .get('/v1/admin/metrics')
      .set('Authorization', 'Bearer viewer_auditor:VIEWER:sig');

    expect(res.status).toBe(200);
    expect(res.body.metrics.totalThreatScans).toBeDefined();
    expect(res.body.privacyAudit.zeroPiiGuaranteed).toBe(true);
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
  });

  test('POST /v1/admin/tips allows EDITOR to create tips', async () => {
    const res = await request(app)
      .post('/v1/admin/tips')
      .set('Authorization', 'Bearer editor_content:EDITOR:sig')
      .send({
        title: 'New Phishing Vector Alert',
        body: 'Beware of QR codes printed on parking meters or shared bikes.',
        category: 'PHYSICAL_QR',
      });

    expect(res.status).toBe(201);
    expect(res.body.tip.title).toBe('New Phishing Vector Alert');
  });

  test('POST /v1/admin/tips denies VIEWER role with 403 Forbidden', async () => {
    const res = await request(app)
      .post('/v1/admin/tips')
      .set('Authorization', 'Bearer viewer_auditor:VIEWER:sig')
      .send({
        title: 'Unauthorized Post',
        body: 'This should fail.',
      });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  test('DELETE /v1/admin/cache/threats allows ADMIN only', async () => {
    // EDITOR cannot delete cache
    const resEditor = await request(app)
      .delete('/v1/admin/cache/threats')
      .set('Authorization', 'Bearer editor_content:EDITOR:sig');
    expect(resEditor.status).toBe(403);

    // ADMIN can delete cache
    const resAdmin = await request(app)
      .delete('/v1/admin/cache/threats')
      .set('Authorization', 'Bearer admin:ADMIN:sig');
    expect(resAdmin.status).toBe(200);
    expect(resAdmin.body.message).toContain('flushed successfully');
  });
});
