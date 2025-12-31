const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('responds with Hello message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Hello from Kubernetes');
  });
});

describe('GET /health', () => {
  it('responds with 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('OK');
  });
});
