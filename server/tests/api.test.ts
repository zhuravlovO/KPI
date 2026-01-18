import request from 'supertest';
import app from '../src/app';

describe('Integration Test: API Endpoints', () => {
  
  test('GET /api/courses should return 200 and an array', async () => {
    const res = await request(app).get('/api/courses');
    
    expect(res.status).toBe(200); 
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('GET /api/courses/1 should return React course', async () => {
    const res = await request(app).get('/api/courses/1');

    expect(res.status).toBe(200);
    expect(res.body.title).toContain('React'); 
  });

  test('GET /api/courses/999 should return 404', async () => {
    const res = await request(app).get('/api/courses/999');
    expect(res.status).toBe(404);
  });

});