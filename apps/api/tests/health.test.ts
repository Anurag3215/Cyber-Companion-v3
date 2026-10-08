import request from 'supertest';
import { createApp } from '../src/app';

describe('GET /v1/health', () => {
  const app = createApp();

  test('returns 200 OK with healthy status payload', async () => {
    const res = await request(app).get('/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.service).toBe('cyber-companion-api-gateway');
    expect(res.body.version).toBe('0.1.0');
  });

  test('returns 404 for non-existent endpoints', async () => {
    const res = await request(app).get('/v1/non-existent');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });
});
