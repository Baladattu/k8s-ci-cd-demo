const request = require('supertest');
const app = require('../app');

// Mock Redis
jest.mock('redis', () => ({
  createClient: jest.fn(() => ({
    on: jest.fn(),
    connect: jest.fn().mockResolvedValue(),
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue('test-value'),
  })),
}));

describe('GET /', () => {
  it('responds with Hello message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Redis');
  });
});

describe('GET /health', () => {
  it('responds with 200 OK', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('OK');
  });
});

describe('Redis Operations', () => {
  it('POST /data stores value', async () => {
    const response = await request(app)
      .post('/data')
      .send({ key: 'name', value: 'Antigravity' });
    expect(response.statusCode).toBe(201);
  });

  it('GET /data/:key retrieves value', async () => {
    const response = await request(app).get('/data/name');
    expect(response.statusCode).toBe(200);
    expect(response.body.value).toBe('test-value');
  });
});
