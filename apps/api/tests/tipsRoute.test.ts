import request from 'supertest';
import { createApp } from '../src/app';

describe('Cyber Tips API Routes', () => {
  const app = createApp();

  test('GET /v1/tips/daily returns valid tip payload', async () => {
    const res = await request(app).get('/v1/tips/daily');
    expect(res.status).toBe(200);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBeDefined();
    expect(res.body.summary).toBeDefined();
    expect(res.body.readingLevelGrade).toBeLessThanOrEqual(6);
  });

  test('GET /v1/tips/list returns tips collection', async () => {
    const res = await request(app).get('/v1/tips/list');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
